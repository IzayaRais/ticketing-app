import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
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
    } catch {
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
  try {
    await sheet.loadHeaderRow();
    const headers = sheet.headerValues;
    if (!headers.includes("gender")) {
       await sheet.setHeaderRow([
        "timestamp", "ticketId", "fullName", "email",
        "phone", "studentId", "university", "gender", "bloodGroup", "status"
      ]);
    }
  } catch {
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
      bloodGroup: data.bloodGroup,
      status: "Verified",
    });

    console.log("✅ Google Sheets row appended:", data.ticketId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Google Sheets append failed:", message);
    throw error;
  }
}

export async function getTicketById(ticketId: string) {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const row = rows.find((r) => r.get("ticketId") === ticketId);
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
      status: row.get("status"),
      timestamp: row.get("timestamp"),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Google Sheets fetch failed:", message);
    throw error;
  }
}

export async function getTicketByEmail(email: string) {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];
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
      status: row.get("status"),
      timestamp: row.get("timestamp"),
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("❌ Google Sheets fetch by email failed:", message);
    throw error;
  }
}

export async function getAllTickets() {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];
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

export async function markTicketCheckedIn(ticketId: string) {
  try {
    const doc = await getDoc();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const row = rows.find((r) => r.get("ticketId") === ticketId);
    if (!row) return { found: false };

    const alreadyChecked = row.get("checkedIn") === "true";
    if (alreadyChecked) {
      return {
        found: true,
        alreadyCheckedIn: true,
        checkedInAt: row.get("checkedInAt") || "",
        fullName: row.get("fullName"),
        email: row.get("email"),
        university: row.get("university"),
      };
    }

    row.set("checkedIn", "true");
    row.set("checkedInAt", new Date().toISOString());
    await row.save();

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
