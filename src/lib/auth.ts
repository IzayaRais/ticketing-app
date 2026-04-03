import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { signInSchema } from "@/lib/validations";
import { validateScannerUser } from "./scannerUsers";

const ADMIN_EMAIL = "raisultensors@gmail.com";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Registration ID",
      credentials: {
        email: { label: "Email", type: "email" },
        ticketId: { label: "Ticket ID", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.ticketId) {
          return null;
        }

        const validation = signInSchema.safeParse({
          email: credentials.email,
          password: credentials.ticketId,
        });

        if (!validation.success) {
          return null;
        }

        return {
          id: credentials.ticketId,
          email: credentials.email,
          name: "Premium Member",
          role: "user" as const,
        };
      },
    }),
    CredentialsProvider({
      id: "scanner-credentials",
      name: "Scanner Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const validation = signInSchema.safeParse({
          email: credentials.email,
          password: credentials.password,
        });

        if (!validation.success) return null;

        const valid = await validateScannerUser(credentials.email, credentials.password);
        if (!valid) return null;

        return {
          id: credentials.email.toLowerCase(),
          email: credentials.email.toLowerCase(),
          name: "Scanner User",
          role: "scanner" as const,
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const email = user.email?.toLowerCase();
        user.role = email === ADMIN_EMAIL.toLowerCase() ? "admin" : "user";
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        if (account?.provider === "google") {
          const email = user.email?.toLowerCase();
          token.role = email === ADMIN_EMAIL.toLowerCase() ? "admin" : "user";
        } else {
          token.role = user.role || "user";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
