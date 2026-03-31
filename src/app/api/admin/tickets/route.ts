import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAllTickets } from "@/lib/googleSheets";
import type { AttendeeRow } from "@/types/attendee";
import { adminTicketSchema } from "@/lib/validations";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { error: NextResponse.json({ message: "Unauthorized" }, { status: 401 }) };
  }
  if (session.user.role !== "admin") {
    return { error: NextResponse.json({ message: "Forbidden" }, { status: 403 }) };
  }
  return { session };
}

export async function GET() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  try {
    const tickets = await getAllTickets();

    let maleCount = 0;
    let femaleCount = 0;
    let otherCount = 0;

    const universityStats: Record<string, number> = {};
    const bloodGroupStats: Record<string, number> = {};

    for (const t of tickets) {
      const ticket = t as unknown as AttendeeRow;
      if (ticket.gender === "Male") maleCount++;
      else if (ticket.gender === "Female") femaleCount++;
      else if (ticket.gender) otherCount++;

      if (ticket.university) {
        universityStats[ticket.university] = (universityStats[ticket.university] || 0) + 1;
      }
      if (ticket.bloodGroup) {
        bloodGroupStats[ticket.bloodGroup] = (bloodGroupStats[ticket.bloodGroup] || 0) + 1;
      }
    }

    return NextResponse.json({
      total: tickets.length,
      male: maleCount,
      female: femaleCount,
      other: otherCount,
      tickets: tickets.toReversed(),
      stats: {
        byUniversity: universityStats,
        byBloodGroup: bloodGroupStats,
      },
    });
  } catch (error) {
    console.error("Admin API error:", error);
    return NextResponse.json(
      { message: "Failed to fetch tickets" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  try {
    const body = await request.json();
    
    const validation = adminTicketSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { message: "Invalid request", errors: validation.error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "Admin action processed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin POST error:", error);
    return NextResponse.json(
      { message: "Failed to process admin action" },
      { status: 500 }
    );
  }
}
