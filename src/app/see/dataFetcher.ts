import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import fs from "fs";

export interface Ticket {
  ticketId: string;
  fullName: string;
  gender: string;
  bloodGroup: string;
  university: string;
  checkedInAt: string;
  checkedIn: boolean;
  scannedBy: string;
}

export interface ScanLog {
  result: string;
  ticketId: string;
  details: string;
  timestamp: string;
}

export interface DashboardStats {
  totalReg: number;
  maleCount: number;
  femaleCount: number;
  scansDone: number;
  duplicateScans: number;
  universityCounts: Record<string, number>;
  scannerCounts: Record<string, number>;
  bloodGroupCounts: Record<string, number>;
  recentScans: { ticketId: string; fullName: string; university: string; timestamp: string }[];
  scanHistory: { time: string; count: number }[];
  currentVelocity: number;
  securityAlerts: { type: string; timestamp: string; ticketId: string; details: string }[];
  serverStatus: "operational" | "degraded" | "offline" | "error";
  lastUpdated: string;
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;

function getAuth() {
  const keyPath = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (keyPath) {
    try {
      const credentials = JSON.parse(fs.readFileSync(keyPath, "utf-8"));
      return new JWT({
        email: credentials.client_email,
        key: credentials.private_key,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
      });
    } catch {
      // Fall through to env-based auth
    }
  }

  const email = process.env.GOOGLE_CLIENT_EMAIL;
  let key = process.env.GOOGLE_PRIVATE_KEY || "";
  if (key.startsWith('"')) key = key.slice(1, -1);
  key = key.replace(/\\n/g, "\n");

  if (!email || !key) {
    throw new Error("Google Sheets credentials not configured.");
  }

  return new JWT({
    email,
    key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

async function getDoc() {
  if (!SPREADSHEET_ID) {
    throw new Error("GOOGLE_SHEETS_ID environment variable is missing.");
  }
  const auth = getAuth();
  const doc = new GoogleSpreadsheet(SPREADSHEET_ID, auth);
  await doc.loadInfo();
  return doc;
}

export async function getDashboardStats() {
  try {
    const doc = await getDoc();
    const mainSheet = doc.sheetsByIndex[0];
    const logSheet = doc.sheetsByTitle["Scan Log"];

    const rawTickets = await mainSheet.getRows();
    const tickets: Ticket[] = rawTickets.map((r) => ({
      ticketId: r.get("ticketId") || "",
      fullName: r.get("fullName") || "Anonymous",
      gender: r.get("gender") || "",
      bloodGroup: r.get("bloodGroup") || "Unknown",
      university: r.get("university") || "",
      checkedInAt: r.get("checkedInAt") || "",
      checkedIn: String(r.get("checkedIn") || "").toLowerCase() === "true",
      scannedBy: r.get("scannedBy") || "",
    }));

    let logs: ScanLog[] = [];
    if (logSheet) {
      const rawLogs = await logSheet.getRows();
      logs = rawLogs.map((r) => ({
        result: r.get("result") || "",
        ticketId: r.get("ticketId") || "",
        details: r.get("details") || "",
        timestamp: r.get("timestamp") || "",
      }));
    }

    // Stats calculations
    const totalReg = tickets.length;
    const maleCount = tickets.filter(t => t.gender === "Male").length;
    const femaleCount = tickets.filter(t => t.gender === "Female").length;
    const scansDone = tickets.filter(t => t.checkedIn).length;
    
    const duplicateScans = logs.filter(l => l.result === "duplicate").length;
    
    const universityCounts: Record<string, number> = {};
    const scannerCounts: Record<string, number> = {};
    const bloodGroupCounts: Record<string, number> = {};
    const hourlyScans: Record<string, number> = {};

    const recentScans = tickets
      .filter(t => t.checkedIn && t.checkedInAt)
      .sort((a, b) => new Date(b.checkedInAt).getTime() - new Date(a.checkedInAt).getTime())
      .slice(0, 10)
      .map(t => ({
        ticketId: t.ticketId,
        fullName: t.fullName,
        university: t.university,
        timestamp: t.checkedInAt
      }));

    tickets.forEach(t => {
      const uni = t.university || "Unknown";
      universityCounts[uni] = (universityCounts[uni] || 0) + 1;
      
      const bg = t.bloodGroup || "Unknown";
      bloodGroupCounts[bg] = (bloodGroupCounts[bg] || 0) + 1;

      if (t.checkedIn && t.checkedInAt) {
        // Group by hour (e.g., "14:00")
        const date = new Date(t.checkedInAt);
        const hour = `${String(date.getHours()).padStart(2, "0")}:00`;
        hourlyScans[hour] = (hourlyScans[hour] || 0) + 1;

        if (t.scannedBy) {
          const scanner = t.scannedBy;
          scannerCounts[scanner] = (scannerCounts[scanner] || 0) + 1;
        }
      }
    });

    // Format scan history for chart
    const scanHistory = Object.entries(hourlyScans)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([time, count]) => ({ time, count }));

    // Calculate Scan Velocity (Scans in the last 15 minutes)
    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const currentVelocity = tickets.filter(t => 
      t.checkedIn && t.checkedInAt && new Date(t.checkedInAt) > fifteenMinutesAgo
    ).length;

    // Security Alerts (Duplicates or failed IDs)
    const securityAlerts = logs
      .filter(l => l.result === "duplicate" || l.result === "invalid")
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 5)
      .map(l => ({
        type: l.result,
        ticketId: l.ticketId,
        details: l.details,
        timestamp: l.timestamp
      }));

    // Prediction: If 30% of total time has passed and 40% are checked in, project final
    const attendanceProjection = scansDone > 0 
      ? Math.min(totalReg, Math.round(scansDone * 1.15)) // Simple 15% growth buffer for now
      : totalReg;

    return {
      totalReg,
      maleCount,
      femaleCount,
      scansDone,
      duplicateScans,
      universityCounts,
      scannerCounts,
      bloodGroupCounts,
      recentScans,
      scanHistory,
      currentVelocity,
      securityAlerts,
      attendanceProjection,
      serverStatus: "operational",
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Dashboard data fetching failed:", error);
    return {
      totalReg: 0,
      maleCount: 0,
      femaleCount: 0,
      scansDone: 0,
      duplicateScans: 0,
      universityCounts: {},
      scannerCounts: {},
      securityAlerts: [],
      currentVelocity: 0,
      serverStatus: "error",
      lastUpdated: new Date().toISOString(),
    };
  }
}
