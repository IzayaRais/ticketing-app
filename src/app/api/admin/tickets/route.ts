import { NextResponse } from "next/server";
import { getAllTickets } from "@/lib/googleSheets";

export async function GET() {
  try {
    const tickets = await getAllTickets();

    const maleCount = tickets.filter((t: any) => t.gender === "Male").length;
    const femaleCount = tickets.filter((t: any) => t.gender === "Female").length;
    const otherCount = tickets.filter((t: any) => t.gender === "Other").length;

    const universityStats: Record<string, number> = {};
    const tshirtStats: Record<string, number> = {};
    const bloodGroupStats: Record<string, number> = {};

    tickets.forEach((t: any) => {
      if (t.university) {
        universityStats[t.university] = (universityStats[t.university] || 0) + 1;
      }
      if (t.tshirtSize) {
        tshirtStats[t.tshirtSize] = (tshirtStats[t.tshirtSize] || 0) + 1;
      }
      if (t.bloodGroup) {
        bloodGroupStats[t.bloodGroup] = (bloodGroupStats[t.bloodGroup] || 0) + 1;
      }
    });

    return NextResponse.json({
      total: tickets.length,
      male: maleCount,
      female: femaleCount,
      other: otherCount,
      tickets: tickets.reverse(),
      stats: {
        byUniversity: universityStats,
        byTshirt: tshirtStats,
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
