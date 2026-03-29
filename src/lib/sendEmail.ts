import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
// Using Antorip Farewell Concert as the display name
const EMAIL_FROM = process.env.EMAIL_FROM || '"Antorip Farewell Concert" <no-reply@premiumevents.com>';

export const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: any[];
}

export async function sendEmail({ to, subject, html, attachments }: EmailOptions) {
  if (!SMTP_USER || !SMTP_PASS) {
    console.warn("SMTP environment variables are missing. Skipping email send.");
    return;
  }

  try {
    const info = await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      html,
      attachments,
    });

    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

export const generateTicketEmailHTML = (name: string, ticketId: string) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
    <div style="background-color: #800000; padding: 40px; text-align: center; border-radius: 12px 12px 0 0;">
      <h1 style="color: #ffffff; margin: 0; font-size: 28px; letter-spacing: 1px;">Registration Confirmed!</h1>
      <p style="color: #fecdd3; margin-top: 5px; font-weight: bold;">ANTORIP FAREWELL CONCERT 2026</p>
    </div>
    <div style="padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; background-color: #ffffff; line-height: 1.6;">
      <p>Hello <strong>${name}</strong>,</p>
      <p>Your registration for the <strong>Antorip Farewell Concert</strong> has been successfully confirmed. Get ready for an unforgettable night of music and legacy!</p>
      <div style="background-color: #f8fafc; padding: 30px; border-radius: 12px; border: 2px dashed #800000; margin: 25px 0; text-align: center;">
        <p style="margin: 0; color: #64748b; font-size: 13px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">YOUR OFFICIAL TICKET ID</p>
        <p style="margin: 10px 0 0 0; color: #800000; font-size: 32px; font-weight: 800; letter-spacing: 4px;">${ticketId}</p>
      </div>
      <p>Please find attached your digital ticket pass. We recommend downloading and keeping it safe on your phone to present at the entrance for verification.</p>
      <p style="margin-top: 25px;">See you at the show!</p>
      <div style="font-size: 11px; color: #94a3b8; margin-top: 40px; text-align: center; border-top: 1px solid #f1f5f9; pt: 20px;">
        Antorip Farewell Concert · Premium Event Management System<br>
        Build with excellence.
      </div>
    </div>
  </div>
`;
