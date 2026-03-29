import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { RegistrationData } from "./validations";
import fs from "fs";

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
    } catch (e: any) {
      console.error("❌ Failed to load credentials from JSON file:", e.message);
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

async function ensureHeaders(sheet: any) {
  try {
    await sheet.loadHeaderRow();
    const headers = sheet.headerValues;
    if (!headers.includes("gender")) {
       await sheet.setHeaderRow([
        "timestamp", "ticketId", "fullName", "email",
        "phone", "studentId", "university", "gender", "tshirtSize", "bloodGroup", "status"
      ]);
    }
  } catch (e) {
    await sheet.setHeaderRow([
      "timestamp", "ticketId", "fullName", "email",
      "phone", "studentId", "university", "gender", "tshirtSize", "bloodGroup", "status"
    ]);
  }
}

export async function appendToSheet(data: RegistrationData & { ticketId: string }) {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];
    await ensureHeaders(sheet);

    await sheet.addRow({
      timestamp: new Date().toISOString(),
      ticketId: data.ticketId,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      studentId: data.studentId,
      university: data.university,
      gender: data.gender,
      tshirtSize: data.tshirtSize,
      bloodGroup: data.bloodGroup,
      status: "Verified",
    });

    console.log("✅ Google Sheets row appended:", data.ticketId);
  } catch (error: any) {
    console.error("❌ Google Sheets append failed:", error.message);
    throw error;
  }
}

export async function getTicketById(ticketId: string) {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const row = rows.find((r: any) => r.get("ticketId") === ticketId);
    if (!row) return null;

    return {
      ticketId: row.get("ticketId"),
      fullName: row.get("fullName"),
      email: row.get("email"),
      phone: row.get("phone"),
      studentId: row.get("studentId"),
      university: row.get("university"),
      gender: row.get("gender"),
      tshirtSize: row.get("tshirtSize"),
      bloodGroup: row.get("bloodGroup"),
      status: row.get("status"),
      timestamp: row.get("timestamp"),
    };
  } catch (error: any) {
    console.error("❌ Google Sheets fetch failed:", error.message);
    throw error;
  }
}

export async function getTicketByEmail(email: string) {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const row = rows.find((r: any) => r.get("email") === email);
    if (!row) return null;

    return {
      ticketId: row.get("ticketId"),
      fullName: row.get("fullName"),
      email: row.get("email"),
      phone: row.get("phone"),
      studentId: row.get("studentId"),
      university: row.get("university"),
      gender: row.get("gender"),
      tshirtSize: row.get("tshirtSize"),
      bloodGroup: row.get("bloodGroup"),
      status: row.get("status"),
      timestamp: row.get("timestamp"),
    };
  } catch (error: any) {
    console.error("❌ Google Sheets fetch by email failed:", error.message);
    throw error;
  }
}

export async function getAllTickets() {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    return rows.map((r: any) => ({
      ticketId: r.get("ticketId"),
      fullName: r.get("fullName"),
      email: r.get("email"),
      phone: r.get("phone"),
      studentId: r.get("studentId"),
      university: r.get("university"),
      gender: r.get("gender"),
      tshirtSize: r.get("tshirtSize"),
      bloodGroup: r.get("bloodGroup"),
      status: r.get("status"),
      timestamp: r.get("timestamp"),
    }));
  } catch (error: any) {
    console.error("❌ Google Sheets fetch all failed:", error.message);
    throw error;
  }
}
