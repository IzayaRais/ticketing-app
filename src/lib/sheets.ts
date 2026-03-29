import { JWT } from 'google-auth-library';
import { google, sheets_v4 } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export interface SheetRow {
  timestamp: string;
  name: string;
  email: string;
  ticketType: string;
  ticketId: string;
}

export async function getSheetsClient(): Promise<sheets_v4.Sheets> {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!serviceAccountEmail || !privateKey) {
    throw new Error('Missing Google service account credentials');
  }

  const auth = new JWT({
    email: serviceAccountEmail,
    key: privateKey,
    scopes: SCOPES,
  });

  return google.sheets({ version: 'v4', auth });
}

export async function appendToSheet(
  spreadsheetId: string,
  sheetName: string,
  data: SheetRow
): Promise<void> {
  const sheets = await getSheetsClient();

  const values = [
    [
      data.timestamp,
      data.name,
      data.email,
      data.ticketType,
      data.ticketId,
    ],
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${sheetName}!A:E`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values,
    },
  });
}
