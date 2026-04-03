import { z } from "zod";
import { instituteOptions, paymentMethodOptions } from "./institute";

export const institutes = instituteOptions;

export const registrationSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .regex(/^\+880[1-9]\d{9}$/, "Phone must be in format: +880 1XXXXXXXXX"),
  studentId: z
    .string()
    .regex(/^[A-Za-z0-9]{5,15}$/, "Student ID must be 5-15 alphanumeric characters"),
  university: z.enum(institutes, { message: "Please select your institute" }),
  gender: z.enum(["Male", "Female"], { message: "Please select your gender" }),
  bloodGroup: z.string().min(1, "Please select your blood group"),
  paymentMethod: z.enum(paymentMethodOptions).optional(),
  transactionId: z.string().trim().optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).superRefine((data, ctx) => {
  const needsPayment = data.university === "BUP" || data.university === "AFMC";
  const transactionId = (data.transactionId || "").trim();

  if (needsPayment) {
    if (!data.paymentMethod) {
      ctx.addIssue({
        code: "custom",
        path: ["paymentMethod"],
        message: "Please select a payment method",
      });
    }

    if (!transactionId) {
      ctx.addIssue({
        code: "custom",
        path: ["transactionId"],
        message: "Transaction ID is required for BUP/AFMC students",
      });
    } else if (!/^[A-Za-z0-9-]{6,40}$/.test(transactionId)) {
      ctx.addIssue({
        code: "custom",
        path: ["transactionId"],
        message: "Transaction ID must be 6-40 characters (letters, numbers, hyphen)",
      });
    }
  }
});

export type RegistrationData = z.infer<typeof registrationSchema>;

export const ticketVerifySchema = z.object({
  ticketId: z
    .string()
    .regex(/^AT-[A-Z0-9]{8}$/, "Invalid ticket ID format. Expected format: AT-XXXXXXXX"),
});

export type TicketVerifyData = z.infer<typeof ticketVerifySchema>;

export const ticketIdSchema = z.object({
  id: z
    .string()
    .regex(/^AT-[A-Z0-9]{8}$/, "Invalid ticket ID format"),
});

export type TicketIdData = z.infer<typeof ticketIdSchema>;

export const adminTicketSchema = z.object({
  action: z.enum(["create", "update", "delete", "get", "list"]),
  ticketId: z.string().regex(/^AT-[A-Z0-9]{8}$/).optional(),
  data: z.object({
    status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
    assignee: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }).optional(),
});

export type AdminTicketData = z.infer<typeof adminTicketSchema>;

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export type SignInData = z.infer<typeof signInSchema>;
