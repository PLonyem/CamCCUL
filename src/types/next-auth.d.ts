import { DefaultSession } from "next-auth";

// role is "admin" for AdminUser or "credit_union" for CreditUnionUser (see
// src/lib/auth.ts). The affiliate* fields are only ever set for
// "credit_union" sessions — a chapter's own affiliate, never chosen by the
// client.
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: string;
      affiliateId?: string;
      affiliateName?: string;
      affiliateCode?: string;
      chapter?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: string;
    affiliateId?: string;
    affiliateName?: string;
    affiliateCode?: string;
    chapter?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    affiliateId?: string;
    affiliateName?: string;
    affiliateCode?: string;
    chapter?: string;
  }
}
