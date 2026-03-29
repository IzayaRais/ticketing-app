import { NextResponse } from "next/server";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
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
    } catch (e) {}
  }
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  let key = process.env.GOOGLE_PRIVATE_KEY || "";
  if (key.startsWith('"')) key = key.slice(1, -1);
  key = key.replace(/\\n/g, "\n");
  
  return new JWT({ email, key, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const pass = searchParams.get("pass");

  // Verified admin credentials
  if (email !== "admin@antorip.com" || pass !== "antorip123") {
    return NextResponse.json({ error: "Unauthorized access: Invalid Credentials" }, { status: 401 });
  }

  try {
    const auth = getAuth();
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID!, auth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const attendees = rows.map((row: any) => ({
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
    }));

    return NextResponse.json({ attendees });
  } catch (error: any) {
    console.error("Admin fetch failed:", error.message);
    return NextResponse.json({ error: "Failed to fetch data from spreadsheet" }, { status: 500 });
  }
}
