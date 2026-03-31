import { NextResponse } from "next/server";
import { getTicketById } from "@/lib/googleSheets";
import { generateTicketPdf } from "@/lib/generatePdf";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Ticket ID required" }, { status: 400 });
    }

    // Fetch the data from Google Sheets by ID
    const ticketData = await getTicketById(id);

    if (!ticketData) {
      return NextResponse.json({ message: "Ticket not found" }, { status: 404 });
    }

    // Generate the PDF
    const pdfBuffer = await generateTicketPdf(
      {
        fullName: ticketData.fullName,
        email: ticketData.email,
        phone: ticketData.phone,
        studentId: ticketData.studentId || "",
        university: ticketData.university,
        gender: ticketData.gender || "Other",
        bloodGroup: ticketData.bloodGroup || "",
        terms: true,
      },
      id
    );

    // Return the PDF as a downloadable response
    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ticket-${id}.pdf"`,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("PDF download API error:", message);
    return NextResponse.json(
      { message: "Failed to generate ticket PDF" },
      { status: 500 }
    );
  }
}
