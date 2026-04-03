import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";
import fs from "fs";
import type { AttendeeRow } from "@/types/attendee";

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
      // fall through to env var auth
    }
  }
  const email = process.env.GOOGLE_CLIENT_EMAIL;
  let key = process.env.GOOGLE_PRIVATE_KEY || "";
  if (key.startsWith('"')) key = key.slice(1, -1);
  key = key.replace(/\\n/g, "\n");
  
  return new JWT({ email, key, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const auth = getAuth();
    const doc = new GoogleSpreadsheet(SPREADSHEET_ID!, auth);
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows();

    const attendees: AttendeeRow[] = rows.map((row) => ({
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
      paymentFromNumber: row.get("paymentFromNumber") || "",
      status: row.get("status"),
      timestamp: row.get("timestamp"),
      checkedIn: row.get("checkedIn") || "",
      checkedInAt: row.get("checkedInAt") || "",
    }));

    return NextResponse.json({ attendees });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Admin fetch failed:", message);
    return NextResponse.json({ error: "Failed to fetch data from spreadsheet" }, { status: 500 });
  }
}
