import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createScannerUser, listScannerUsers } from "@/lib/scannerUsers";
import { generateScannerCredentialsEmailHTML, sendEmail } from "@/lib/sendEmail";

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
    const users = await listScannerUsers();
    return NextResponse.json({ users });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if ("error" in auth) return auth.error;

  try {
    const body = await request.json();
    const email = String(body.email || "").trim().toLowerCase();
    const password = String(body.password || "");

    if (!email || !email.includes("@")) {
      return NextResponse.json({ message: "Valid email is required." }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ message: "Password must be at least 6 characters." }, { status: 400 });
    }

    await createScannerUser(email, password, auth.session.user.email || "admin");
    let emailWarning = "";

    try {
      const assignedBy = auth.session.user.email || "admin";
      const html = generateScannerCredentialsEmailHTML({
        assignedBy,
        email,
        password,
      });

      await sendEmail({
        to: email,
        subject: "Your Scanner Access Credentials",
        html,
      });
    } catch (emailError) {
      const message = emailError instanceof Error ? emailError.message : "unknown email error";
      emailWarning = `Scanner user created, but credential email could not be sent: ${message}`;
    }

    return NextResponse.json(
      {
        message: emailWarning || "Scanner user saved and credentials email sent.",
        emailSent: !emailWarning,
      },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
