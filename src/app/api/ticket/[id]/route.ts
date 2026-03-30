import { NextResponse } from "next/server";
import { getTicketById } from "@/lib/googleSheets";
import { generateTicketPdf } from "@/lib/generatePdf";
import { ticketIdSchema } from "@/lib/validations";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json(
        { message: "Ticket ID is required" },
        { status: 400 }
      );
    }

    const validation = ticketIdSchema.safeParse({ id });
    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const ticket = await getTicketById(id);
    
    if (!ticket) {
      return NextResponse.json(
        { message: "Ticket not found" },
        { status: 404 }
      );
    }

    const pdfBuffer = await generateTicketPdf(
      {
        fullName: ticket.fullName,
        email: ticket.email,
        phone: ticket.phone,
        studentId: ticket.studentId || "",
        university: ticket.university,
        gender: ticket.gender || "Other",
        bloodGroup: ticket.bloodGroup || "",
        terms: true,
      },
      ticket.ticketId
    );

    return new NextResponse(pdfBuffer as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="ticket-${ticket.ticketId}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error fetching ticket PDF:", error);
    return NextResponse.json(
      { message: "Error generating ticket PDF" },
      { status: 500 }
    );
  }
}
