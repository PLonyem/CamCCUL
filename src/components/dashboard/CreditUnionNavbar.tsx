"use client";

import { useState } from "react";
import Link from "next/link";
import { useClerk } from "@clerk/nextjs";
import { Building2, LogOut, ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface CreditUnionNavbarProps {
  user: {
    name?: string | null;
  };
}

export function CreditUnionNavbar({ user }: CreditUnionNavbarProps) {
  const { signOut } = useClerk();
  const [isSigningOut, setIsSigningOut] = useState(false);

  // A credit union manager signing out should land back on the public
  // site, not on /login like the admin sign-out does.
  async function handleSignOut() {
    setIsSigningOut(true);
    await signOut({ redirectUrl: "/" });
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2 shrink-0">
            <Building2 className="h-6 w-6 text-primary-600" />
            <span className="font-display font-bold text-lg text-primary-900">
              CamCCUL
            </span>
          </div>
          <Badge variant="primary" className="hidden sm:inline-flex shrink-0">
            Credit Union Portal
          </Badge>
        </div>

        <div className="flex items-center gap-4 shrink-0">
          <span className="text-sm font-medium text-gray-700 hidden sm:block truncate max-w-[220px]">
            {user.name}
          </span>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Website</span>
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            disabled={isSigningOut}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-primary-600 transition-colors disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" />
            {isSigningOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </div>
    </header>
  );
}
