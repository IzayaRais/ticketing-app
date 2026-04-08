import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getConfig, setConfig } from "@/lib/appConfig";

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
  return NextResponse.json(getConfig());
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  try {
    const body = await request.json();
    const { registrationEnabled, pauseUntil } = body;
    
    const updated = setConfig({
      registrationEnabled: typeof registrationEnabled === "boolean" ? registrationEnabled : undefined,
      pauseUntil: pauseUntil === undefined ? undefined : pauseUntil,
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Config POST error:", error);
    return NextResponse.json(
      { message: "Failed to update configuration" },
      { status: 500 }
    );
  }
}
