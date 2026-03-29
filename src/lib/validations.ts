import { z } from "zod";

export const registrationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Valid phone number is required"),
  studentId: z.string().min(2, "Student ID is required"),
  university: z.string().min(2, "University (short form) is required"),
  gender: z.enum(["Male", "Female", "Other"]),
  tshirtSize: z.enum(["S", "M", "L", "XL", "XXL"]),
  bloodGroup: z.string().min(1, "Blood group is required"),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

export type RegistrationData = z.infer<typeof registrationSchema>;
