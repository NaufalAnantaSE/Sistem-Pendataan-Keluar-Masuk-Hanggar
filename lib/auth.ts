import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import bcrypt from "bcryptjs";

const credentialsSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

const adminUsername = process.env.ADMIN_USERNAME ?? "admin";
const adminPassword = process.env.ADMIN_PASSWORD;
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { username, password } = parsed.data;
        if (username !== adminUsername) return null;

        let valid = false;
        if (adminPasswordHash) {
          valid = await bcrypt.compare(password, adminPasswordHash);
        } else if (adminPassword) {
          valid = password === adminPassword;
        }

        if (!valid) return null;

        return {
          id: "admin",
          name: "ADMIN",
          email: "admin@hanggar.local",
          role: "ADMIN",
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role ?? "ADMIN";
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "admin";
        session.user.role = (token as { role?: string }).role ?? "ADMIN";
      }
      return session;
    },
  },
};

export function auth() {
  return getServerSession(authOptions);
}
