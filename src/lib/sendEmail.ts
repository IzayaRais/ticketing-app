import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587");
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
// Using Antorip Farewell Concert as the display name
const EMAIL_FROM = process.env.EMAIL_FROM || '"Antorip Farewell Concert" <no-reply@premiumevents.com>';

const SMTP_SECONDARY_HOST = process.env.SMTP_SECONDARY_HOST || SMTP_HOST;
const SMTP_SECONDARY_PORT = parseInt(process.env.SMTP_SECONDARY_PORT || String(SMTP_PORT));
const SMTP_SECONDARY_USER = process.env.SMTP_SECONDARY_USER;
const SMTP_SECONDARY_PASS = process.env.SMTP_SECONDARY_PASS;
const EMAIL_FROM_SECONDARY = process.env.EMAIL_FROM_SECONDARY || EMAIL_FROM;

function createTransport(host: string, port: number, user?: string, pass?: string) {
  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
}

export const transporter = createTransport(SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS);
const secondaryTransporter =
  SMTP_SECONDARY_USER && SMTP_SECONDARY_PASS
    ? createTransport(SMTP_SECONDARY_HOST, SMTP_SECONDARY_PORT, SMTP_SECONDARY_USER, SMTP_SECONDARY_PASS)
    : null;

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: Array<{ filename: string; content: Buffer }>;
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
    const message = error instanceof Error ? error.message : String(error);
    const shouldTrySecondary =
      !!secondaryTransporter &&
      /(quota|limit|rate|too many|daily|exceed|temporar|throttl|invalid login|auth)/i.test(message);

    if (shouldTrySecondary && secondaryTransporter) {
      try {
        const info = await secondaryTransporter.sendMail({
          from: EMAIL_FROM_SECONDARY,
          to,
          subject,
          html,
          attachments,
        });
        console.log("Email sent via secondary SMTP: %s", info.messageId);
        return info;
      } catch (secondaryError) {
        console.error("Primary and secondary email send failed:", secondaryError);
        throw secondaryError;
      }
    }

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

export const generateScannerCredentialsEmailHTML = ({
  name,
  assignedBy,
  email,
  password,
}: {
  name: string;
  assignedBy: string;
  email: string;
  password: string;
}) => `
  <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #1f2937;">
    <div style="background: linear-gradient(135deg, #0f172a, #1e293b); padding: 36px; border-radius: 14px 14px 0 0; text-align: center;">
      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800;">Scanner Access Assigned</h1>
      <p style="margin: 10px 0 0; color: #cbd5e1; font-size: 13px; letter-spacing: 0.6px;">ANTORIP FAREWELL CONCERT 2026</p>
    </div>
    <div style="border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 14px 14px; background: #ffffff; padding: 28px 30px; line-height: 1.6;">
      <p style="margin-top: 0;">Hello <strong>${name}</strong>,</p>
      <p>You have been assigned as a scanner user by <strong>${assignedBy}</strong>.</p>

      <div style="margin: 24px 0; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
        <div style="background: #f8fafc; padding: 10px 14px; font-size: 12px; color: #475569; font-weight: 700; text-transform: uppercase; letter-spacing: 0.8px;">Login Credentials</div>
        <div style="padding: 16px 14px; background: #ffffff;">
          <p style="margin: 0 0 10px;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 0;"><strong>Password:</strong> ${password}</p>
        </div>
      </div>

      <p style="margin-bottom: 8px;"><strong>Scanner Login URL:</strong></p>
      <p style="margin-top: 0;"><a href="${process.env.NEXT_PUBLIC_SITE_URL || "https://antorip.vercel.app"}/scan/login">${process.env.NEXT_PUBLIC_SITE_URL || "https://antorip.vercel.app"}/scan/login</a></p>

      <p style="margin-top: 20px; color: #b91c1c; font-weight: 700;">Do not share these credentials publicly.</p>

      <div style="margin-top: 30px; font-size: 11px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 14px;">
        This is an automated system email for scanner access provisioning.
      </div>
    </div>
  </div>
`;
