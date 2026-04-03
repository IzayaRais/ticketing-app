import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import crypto from "crypto";
import fs from "fs";

const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_ID;
const SHEET_TITLE = "Scanner Users";

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

async function getScannerUsersSheet() {
  const doc = await getDoc();
  let sheet = doc.sheetsByTitle[SHEET_TITLE];
  if (!sheet) {
    sheet = await doc.addSheet({ title: SHEET_TITLE });
  }
  await ensureScannerUsersHeaders(sheet);
  return sheet;
}

async function ensureScannerUsersHeaders(sheet: GoogleSpreadsheetWorksheet) {
  const requiredHeaders = ["email", "passwordHash", "createdAt", "createdBy", "active"];
  try {
    await sheet.loadHeaderRow();
    const headers = [...sheet.headerValues];
    const missing = requiredHeaders.filter((h) => !headers.includes(h));
    if (missing.length > 0) {
      await sheet.setHeaderRow([...headers, ...missing]);
    }
  } catch {
    await sheet.setHeaderRow(requiredHeaders);
  }
}

function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${derived}`;
}

function verifyPassword(password: string, hashed: string) {
  const [salt, saved] = hashed.split(":");
  if (!salt || !saved) return false;
  const derived = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(saved, "hex");
  const b = Buffer.from(derived, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export async function listScannerUsers() {
  const sheet = await getScannerUsersSheet();
  const rows = await sheet.getRows();
  return rows
    .filter((r) => String(r.get("active") || "true").toLowerCase() === "true")
    .map((r) => ({
      email: r.get("email"),
      createdAt: r.get("createdAt"),
      createdBy: r.get("createdBy"),
      active: r.get("active"),
    }));
}

export async function createScannerUser(email: string, password: string, createdBy: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const sheet = await getScannerUsersSheet();
  const rows = await sheet.getRows();
  const exists = rows.find((r) => String(r.get("email")).trim().toLowerCase() === normalizedEmail);

  if (exists && String(exists.get("active") || "true").toLowerCase() === "true") {
    throw new Error("Scanner user already exists.");
  }

  const passwordHash = hashPassword(password);
  const now = new Date().toISOString();

  if (exists) {
    exists.set("passwordHash", passwordHash);
    exists.set("createdAt", now);
    exists.set("createdBy", createdBy);
    exists.set("active", "true");
    await exists.save();
    return;
  }

  await sheet.addRow({
    email: normalizedEmail,
    passwordHash,
    createdAt: now,
    createdBy,
    active: "true",
  });
}

export async function validateScannerUser(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const sheet = await getScannerUsersSheet();
  const rows = await sheet.getRows();
  const row = rows.find((r) => String(r.get("email")).trim().toLowerCase() === normalizedEmail);
  if (!row) return false;
  if (String(row.get("active") || "true").toLowerCase() !== "true") return false;
  return verifyPassword(password, row.get("passwordHash"));
}
