import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { signInSchema } from "@/lib/validations";

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
        (user as any).role = email === ADMIN_EMAIL.toLowerCase() ? "admin" : "user";
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
          token.role = "user";
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};
