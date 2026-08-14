import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [
    Credentials({
      name: "Login",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      // Tries AdminUser first, then CreditUnionUser — the two tables are
      // keyed by the same unique email column but never share a row, so
      // checking both by email (rather than asking the client which kind
      // of account it is) is safe and keeps the login form unified.
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        const admin = await prisma.adminUser.findUnique({ where: { email } });
        if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
          return {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          };
        }

        const cuUser = await prisma.creditUnionUser.findUnique({
          where: { email },
          include: { affiliate: true },
        });
        if (cuUser && (await bcrypt.compare(password, cuUser.passwordHash))) {
          return {
            id: cuUser.id,
            email: cuUser.email,
            name: cuUser.affiliate.name,
            role: "credit_union",
            affiliateId: cuUser.affiliateId,
            affiliateName: cuUser.affiliate.name,
            affiliateCode: cuUser.affiliate.code,
            chapter: cuUser.affiliate.chapter ?? undefined,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.affiliateId = user.affiliateId;
        token.affiliateName = user.affiliateName;
        token.affiliateCode = user.affiliateCode;
        token.chapter = user.chapter;
      }
      return token;
    },
    // The JWT only carries a stable id + role — everything else is looked
    // up fresh from the database on every session check (from AdminUser or
    // CreditUnionUser depending on token.role), so profile edits made
    // elsewhere (an admin's Settings page, a chapter's affiliate profile)
    // are reflected immediately everywhere the session is read, without a
    // fragile client-side JWT refresh.
    async session({ session, token }) {
      if (!session.user || !token.id) return session;

      session.user.id = token.id as string;
      session.user.role = token.role as string;

      if (token.role === "admin") {
        const admin = await prisma.adminUser.findUnique({
          where: { id: token.id as string },
          select: { name: true, email: true, role: true },
        });
        if (admin) {
          session.user.name = admin.name;
          session.user.email = admin.email;
          session.user.role = admin.role;
        }
        return session;
      }

      if (token.role === "credit_union") {
        const cuUser = await prisma.creditUnionUser.findUnique({
          where: { id: token.id as string },
          include: { affiliate: true },
        });
        if (cuUser) {
          session.user.name = cuUser.affiliate.name;
          session.user.email = cuUser.email;
          session.user.affiliateId = cuUser.affiliateId;
          session.user.affiliateName = cuUser.affiliate.name;
          session.user.affiliateCode = cuUser.affiliate.code;
          session.user.chapter = cuUser.affiliate.chapter ?? undefined;
        }
      }

      return session;
    },
  },
});
