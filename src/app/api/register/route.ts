import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { registrationSchema } from "@/lib/validations";
import { appendToSheet, getTicketByEmail } from "@/lib/googleSheets";
import { generateTicketPdf } from "@/lib/generatePdf";
import { sendEmail, generateTicketEmailHTML } from "@/lib/sendEmail";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = registrationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { message: "Invalid registration data", errors: result.error.flatten() },
        { status: 400 }
      );
    }

    const { data } = result;

    // --- CHECK FOR DUPLICATE EMAIL ---
    try {
      const existing = await getTicketByEmail(data.email);
      if (existing) {
        return NextResponse.json(
          { message: "This email is already registered. Please use the Verify Ticket page to access your pass." },
          { status: 409 }
        );
      }
    } catch (e) {
      console.error("Duplicate check failed:", e);
      // Proceeding might be risky, but let's assume if sheet fails we might have larger issues
    }

    const ticketId = `AT-${uuidv4().substring(0, 8).toUpperCase()}`;

    console.log("Starting registration for:", data.email, "ticketId:", ticketId);
    
    // Primary sync to Google Sheets
    try {
      console.log("Attempting to append to Google Sheets...");
      await appendToSheet({ ...data, ticketId });
      console.log("Google Sheets append successful!");
    } catch (e) {
      console.error("Sheets sync failed:", e);
      return NextResponse.json(
        { message: "Registration failed due to server synchronization error." },
        { status: 500 }
      );
    }

    // Secondary tasks (Email / PDF) can run in background
    (async () => {
      try {
        const pdfBuffer = await generateTicketPdf(data, ticketId);
        const emailHtml = generateTicketEmailHTML(data.fullName, ticketId);
        
        await sendEmail({
          to: data.email,
          subject: "Your Antorip Farewell Concert Entry Pass",
          html: emailHtml,
          attachments: [
            {
              filename: `ticket-${ticketId}.pdf`,
              content: pdfBuffer,
            },
          ],
        });
        console.log("Confirmation email sent to:", data.email);
      } catch (e) {
        console.error("Email/PDF orchestration failed:", e);
      }
    })();

    return NextResponse.json({
      message: "Registration successful",
      ticketId,
      email: data.email,
    });
  } catch (error: any) {
    console.error("Critical registration error:", error);
    return NextResponse.json(
      { message: "Critical error during registration" },
      { status: 500 }
    );
  }
}
