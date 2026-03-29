import { NextRequest, NextResponse } from "next/server";
import { getTicketByEmail } from "@/lib/googleSheets";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");
  const ticketId = searchParams.get("ticketId");

  if (!email || !ticketId) {
    return NextResponse.json({ valid: false, message: "Email and Ticket ID are required." }, { status: 400 });
  }

  try {
    const ticket = await getTicketByEmail(email);

    if (ticket && ticket.ticketId === ticketId.trim().toUpperCase()) {
      return NextResponse.json({ valid: true, ticket });
    } else {
      return NextResponse.json({ valid: false, message: "Invalid email or ticket ID combination." });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ valid: false, message: "Internal server error." }, { status: 500 });
  }
}
