import { NextResponse } from "next/server";
import { getTicketByEmail } from "@/lib/googleSheets";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const ticket = await getTicketByEmail(email);

    if (!ticket) {
      return NextResponse.json(
        { exists: false },
        { status: 200 }
      );
    }

    return NextResponse.json({
      exists: true,
      ticket,
    });
  } catch (error) {
    console.error("Error checking ticket by email:", error);
    return NextResponse.json(
      { message: "Error checking ticket" },
      { status: 500 }
    );
  }
}
