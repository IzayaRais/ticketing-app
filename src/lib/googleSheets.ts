import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import { RegistrationData } from "./validations";
import { PAYMENT_NUMBER } from "./institute";
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

async function ensureHeaders(sheet: GoogleSpreadsheetWorksheet) {
  const requiredHeaders = [
    "timestamp", "ticketId", "fullName", "email",
    "phone", "studentId", "university", "gender", "bloodGroup",
    "paymentMethod", "transactionId", "paymentNumber",
    "status",
  ];

  try {
    await sheet.loadHeaderRow();
    const headers = [...sheet.headerValues];
    if (headers.length === 0) {
      await sheet.setHeaderRow(requiredHeaders);
      return;
    }

    const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));
    if (missingHeaders.length > 0) {
      await sheet.setHeaderRow([...headers, ...missingHeaders]);
    }
  } catch {
    await sheet.setHeaderRow(requiredHeaders);
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
      bloodGroup: data.bloodGroup,
      paymentMethod: data.paymentMethod || "",
      transactionId: data.transactionId || "",
      paymentNumber: data.paymentMethod ? PAYMENT_NUMBER : "",
      status: "Verified",
    });
  } catch (error) {
    throw error;
  }
}

export async function getTicketById(ticketId: string) {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];
    await ensureHeaders(sheet);
    const rows = await sheet.getRows();

    const row = rows.find((r) => {
      const val = r.get("ticketId");
      return val && val.trim().toUpperCase() === ticketId.trim().toUpperCase();
    });
    if (!row) return null;

    return {
      ticketId: row.get("ticketId"),
      fullName: row.get("fullName"),
      email: row.get("email"),
      phone: row.get("phone"),
      studentId: row.get("studentId"),
      university: row.get("university"),
      gender: row.get("gender"),
      bloodGroup: row.get("bloodGroup"),
      paymentMethod: row.get("paymentMethod") || "",
      transactionId: row.get("transactionId") || "",
      paymentNumber: row.get("paymentNumber") || "",
      status: row.get("status"),
      timestamp: row.get("timestamp"),
      checkedIn: row.get("checkedIn") || "",
      checkedInAt: row.get("checkedInAt") || "",
    };
  } catch (error) {
    throw error;
  }
}

export async function getTicketByEmail(email: string) {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];
    await ensureHeaders(sheet);
    const rows = await sheet.getRows();

    const row = rows.find((r) => r.get("email") === email);
    if (!row) return null;

    return {
      ticketId: row.get("ticketId"),
      fullName: row.get("fullName"),
      email: row.get("email"),
      phone: row.get("phone"),
      studentId: row.get("studentId"),
      university: row.get("university"),
      gender: row.get("gender"),
      bloodGroup: row.get("bloodGroup"),
      paymentMethod: row.get("paymentMethod") || "",
      transactionId: row.get("transactionId") || "",
      paymentNumber: row.get("paymentNumber") || "",
      status: row.get("status"),
      timestamp: row.get("timestamp"),
    };
  } catch (error) {
    throw error;
  }
}

export async function getAllTickets() {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];
    await ensureHeaders(sheet);
    const rows = await sheet.getRows();

    return rows.map((r) => ({
      ticketId: r.get("ticketId"),
      fullName: r.get("fullName"),
      email: r.get("email"),
      phone: r.get("phone"),
      studentId: r.get("studentId"),
      university: r.get("university"),
      gender: r.get("gender"),
      bloodGroup: r.get("bloodGroup"),
      paymentMethod: r.get("paymentMethod") || "",
      transactionId: r.get("transactionId") || "",
      paymentNumber: r.get("paymentNumber") || "",
      status: r.get("status"),
      timestamp: r.get("timestamp"),
      checkedIn: r.get("checkedIn") || "",
      checkedInAt: r.get("checkedInAt") || "",
    }));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Google Sheets fetch all failed:", message);
    throw error;
  }
}

export async function logScanAttempt(ticketId: string, result: "success" | "duplicate" | "not_found" | "error", details?: string) {
  try {
    const doc = await getDoc();
    let sheet = doc.sheetsByIndex[1] || doc.sheetsByIndex[0];

    // Try to find or create a "Scan Log" sheet
    try {
      sheet = doc.sheetsByIndex[1];
      if (!sheet) {
        sheet = await doc.addSheet({ title: "Scan Log" });
      }
    } catch {
      // Use first sheet if second doesn't exist
      sheet = doc.sheetsByIndex[0];
    }

    await sheet.loadHeaderRow().catch(async () => {
      await sheet.setHeaderRow(["timestamp", "ticketId", "result", "details"]);
    });

    await sheet.addRow({
      timestamp: new Date().toISOString(),
      ticketId,
      result,
      details: details || "",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Scan log failed:", message);
  }
}

export async function markTicketCheckedIn(ticketId: string) {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];

    await sheet.loadHeaderRow();
    const headers = [...sheet.headerValues];
    const missingCols: string[] = [];
    if (!headers.includes("checkedIn")) missingCols.push("checkedIn");
    if (!headers.includes("checkedInAt")) missingCols.push("checkedInAt");

    if (missingCols.length > 0) {
      await sheet.setHeaderRow([...headers, ...missingCols]);
      console.log("✅ Added check-in columns:", missingCols.join(", "));
    }

    // Reload rows after ensuring columns exist
    const rows = await sheet.getRows();

    const row = rows.find((r) => {
      const val = r.get("ticketId");
      return val && val.trim().toUpperCase() === ticketId.trim().toUpperCase();
    });

    if (!row) {
      console.error("❌ Ticket not found:", ticketId);
      await logScanAttempt(ticketId, "not_found", "Ticket ID not found in sheet");
      return { found: false };
    }

    // Strict check - treat any truthy value as already checked in
    const checkedInVal = String(row.get("checkedIn") || "").trim().toLowerCase();
    const alreadyChecked = checkedInVal === "true" || checkedInVal === "yes" || checkedInVal === "1";
    
    if (alreadyChecked) {
      await logScanAttempt(ticketId, "duplicate", `Already checked in at ${row.get("checkedInAt") || "unknown time"}`);
      return {
        found: true,
        alreadyCheckedIn: true,
        checkedInAt: row.get("checkedInAt") || "",
        fullName: row.get("fullName"),
        email: row.get("email"),
        university: row.get("university"),
      };
    }

    // Mark as checked in
    row.set("checkedIn", "true");
    row.set("checkedInAt", new Date().toISOString());
    await row.save();

    // Verify the save took effect by re-reading the row
    const verifyRows = await sheet.getRows();
    const verifyRow = verifyRows.find((r) => {
      const val = r.get("ticketId");
      return val && val.trim().toUpperCase() === ticketId.trim().toUpperCase();
    });

    if (!verifyRow || String(verifyRow.get("checkedIn") || "").trim().toLowerCase() !== "true") {
      console.error("❌ Check-in save verification failed:", ticketId);
      await logScanAttempt(ticketId, "error", "Failed to save check-in status");
      return { found: false, message: "Failed to save check-in status" };
    }

    await logScanAttempt(ticketId, "success", `Checked in: ${row.get("fullName")}`);
    console.log("✅ Checked in:", ticketId, row.get("fullName"));

    return {
      found: true,
      alreadyCheckedIn: false,
      fullName: row.get("fullName"),
      email: row.get("email"),
      university: row.get("university"),
      ticketId: row.get("ticketId"),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Check-in failed:", message);
    throw error;
  }
}
