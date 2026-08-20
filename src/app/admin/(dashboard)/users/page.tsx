"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { UserPlus, Download, Search, ShieldCheck, Building2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { AdminUserListItem } from "@/app/api/admin/users/route";

type RoleFilter = "all" | "admin" | "credit_union";

const ROLE_FILTER_LABEL: Record<RoleFilter, string> = {
  all: "users",
  admin: "admins",
  credit_union: "credit-unions",
};

function formatDate(ms: number | null): string {
  if (!ms) return "Never";
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// Wraps a value in quotes and escapes any quotes it contains only when
// needed — cheap correctness for the rare name/affiliate with a comma or
// quote in it, without visually cluttering every plain cell.
function csvCell(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function exportUsersCsv(users: AdminUserListItem[], roleFilter: RoleFilter) {
  const header = ["Name", "Email", "Role", "Affiliate Name", "Affiliate Code", "Created", "Last Sign-In", "Banned"];
  const rows = users.map((u) => [
    u.name ?? "",
    u.email ?? "",
    u.role ?? "",
    u.affiliateName ?? "",
    u.affiliateCode ?? "",
    formatDate(u.createdAt),
    formatDate(u.lastSignInAt),
    u.banned ? "Yes" : "No",
  ]);
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");

  // Leading BOM so Excel (the realistic target for a "download as CSV, then
  // print" workflow) renders accented characters in French names/chapters
  // correctly instead of guessing the wrong encoding.
  const BOM = "﻿";
  const blob = new Blob([BOM + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const today = new Date().toISOString().slice(0, 10);
  link.href = url;
  link.download = `camccul-${ROLE_FILTER_LABEL[roleFilter]}-${today}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function RoleBadge({ role }: { role: string | null }) {
  if (role === "admin") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary-900/10 text-primary-900 text-xs font-medium px-2 py-0.5">
        <ShieldCheck className="h-3 w-3" />
        Admin
      </span>
    );
  }
  if (role === "credit_union") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-primary-500/10 text-primary-700 text-xs font-medium px-2 py-0.5">
        <Building2 className="h-3 w-3" />
        Credit Union
      </span>
    );
  }
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 text-gray-500 text-xs font-medium px-2 py-0.5">
      No role set
    </span>
  );
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUserListItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");

  useEffect(() => {
    let ignore = false;
    fetch("/api/admin/users")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((body: { users: AdminUserListItem[] }) => {
        if (!ignore) setUsers(body.users);
      })
      .catch(() => {
        if (!ignore) setError("Could not load users.");
      });
    return () => {
      ignore = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!users) return [];
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (!q) return true;
      return (
        u.email?.toLowerCase().includes(q) ||
        u.name?.toLowerCase().includes(q) ||
        u.affiliateName?.toLowerCase().includes(q)
      );
    });
  }, [users, search, roleFilter]);

  return (
    <div className="max-w-5xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All Users</h1>
          <p className="text-sm text-gray-500 mt-1">
            Every admin and credit union account in Clerk.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            disabled={filtered.length === 0}
            onClick={() => exportUsersCsv(filtered, roleFilter)}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Link href="/admin/users/create" className={buttonVariants({ variant: "default" })}>
            <UserPlus className="h-4 w-4" />
            Create Account
          </Link>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or affiliate..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
          />
        </div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          {(["all", "admin", "credit_union"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRoleFilter(option)}
              className={cn(
                "px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                roleFilter === option
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {option === "all" ? "All" : option === "admin" ? "Admins" : "Credit Unions"}
            </button>
          ))}
        </div>
      </div>

      {error ? (
        <p className="mt-8 text-sm text-red-600">{error}</p>
      ) : !users ? (
        <p className="mt-8 text-sm text-gray-400">Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
          No users match your search.
        </div>
      ) : (
        <div className="mt-6 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Name</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Email</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Role</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Affiliate</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Created</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Last Sign-In</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-900">
                      {user.name ?? <span className="text-gray-400">—</span>}
                      {user.banned && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-red-50 text-red-600 text-[10px] font-medium px-1.5 py-0.5">
                          Banned
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                      {user.email ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {user.affiliateName ? (
                        <>
                          {user.affiliateName}{" "}
                          <span className="text-gray-400 text-xs">({user.affiliateCode})</span>
                        </>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(user.createdAt)}</td>
                    <td className="px-4 py-3 text-gray-500 text-xs">
                      {formatDate(user.lastSignInAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
