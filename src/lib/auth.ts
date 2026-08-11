import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
  providers: [
    Credentials({
      name: "Admin Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.adminUser.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    // The JWT only carries a stable id — name/email/role are looked up
    // fresh from the database on every session check, so an admin's own
    // profile edits (Settings) are reflected immediately everywhere the
    // session is read, without needing a fragile client-side JWT refresh.
    async session({ session, token }) {
      if (session.user && token.id) {
        const user = await prisma.adminUser.findUnique({
          where: { id: token.id as string },
          select: { name: true, email: true, role: true },
        });
        if (user) {
          session.user.id = token.id as string;
          session.user.name = user.name;
          session.user.email = user.email;
          session.user.role = user.role;
        }
      }
      return session;
    },
  },
});
