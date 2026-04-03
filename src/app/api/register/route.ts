import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { registrationSchema } from "@/lib/validations";
import { appendToSheet, getTicketByEmail } from "@/lib/googleSheets";
import { generateTicketPdf } from "@/lib/generatePdf";
import { sendEmail, generateTicketEmailHTML } from "@/lib/sendEmail";

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const ipRequests = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipRequests.get(ip) || [];
  const recent = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
  
  if (recent.length >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  recent.push(now);
  ipRequests.set(ip, recent);
  
  if (recent.length > RATE_LIMIT_MAX_REQUESTS * 2) {
    ipRequests.set(ip, recent.slice(-RATE_LIMIT_MAX_REQUESTS));
  }
  
  return true;
}

function getClientIp(request: Request): string {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

function normalizeBdPhone(value: string): string {
  const cleaned = value.replace(/\s+/g, "");
  if (cleaned.startsWith("01")) return `88${cleaned}`;
  if (cleaned.startsWith("8801")) return cleaned;
  return cleaned;
}

export async function POST(request: Request) {
  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { message: "Too many registration attempts. Please try again later." },
      { status: 429 }
    );
  }

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
    const normalizedData = {
      ...data,
      phone: normalizeBdPhone(data.phone),
      transactionId: data.transactionId?.trim().toUpperCase() || "",
      paymentFromNumber: data.paymentFromNumber ? normalizeBdPhone(data.paymentFromNumber) : "",
    };

    const existing = await getTicketByEmail(normalizedData.email);
    if (existing) {
      return NextResponse.json(
        { message: "This email is already registered. Please use the Verify Ticket page to access your pass." },
        { status: 409 }
      );
    }

    const ticketId = `AT-${uuidv4().substring(0, 8).toUpperCase()}`;

    await appendToSheet({ ...normalizedData, ticketId });

    const pdfBuffer = await generateTicketPdf(normalizedData, ticketId);
    const emailHtml = generateTicketEmailHTML(normalizedData.fullName, ticketId);

    let emailSent = true;
    try {
      await sendEmail({
        to: normalizedData.email,
        subject: "Your অন্তরীপ ২১ Farewell Concert Entry Pass",
        html: emailHtml,
        attachments: [
          {
            filename: `ticket-${ticketId}.pdf`,
            content: pdfBuffer,
          },
        ],
      });
    } catch (emailError) {
      emailSent = false;
      const emailMessage =
        emailError instanceof Error ? emailError.message : "Unknown email error";
      console.error("Registration completed but email send failed:", emailMessage);
    }

    return NextResponse.json({
      message: emailSent
        ? "Registration successful"
        : "Registration successful, but email delivery failed. Please download your ticket from the success page.",
      ticketId,
      email: normalizedData.email,
      emailSent,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("Critical registration error:", message);
    return NextResponse.json(
      { message: "Critical error during registration" },
      { status: 500 }
    );
  }
}

