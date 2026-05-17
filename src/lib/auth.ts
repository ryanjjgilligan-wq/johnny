import type { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";

const providers: NextAuthOptions["providers"] = [
  // Always-available demo provider so the app is usable without env config
  CredentialsProvider({
    name: "Demo",
    credentials: {
      email: { label: "Email", type: "email", placeholder: "you@example.com" },
      name: { label: "Display name", type: "text", placeholder: "Your name" },
    },
    async authorize(credentials) {
      const email = (credentials?.email || "").trim().toLowerCase();
      if (!email) return null;
      const name = credentials?.name?.trim() || email.split("@")[0];
      const user = await prisma.user.upsert({
        where: { email },
        update: { name },
        create: {
          email,
          name,
          image: `https://i.pravatar.cc/200?u=${encodeURIComponent(email)}`,
        },
      });
      return { id: user.id, email: user.email!, name: user.name, image: user.image };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as NextAuthOptions["adapter"],
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/signin" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.uid = (user as { id?: string }).id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.uid) {
        (session.user as { id?: string }).id = token.uid as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
