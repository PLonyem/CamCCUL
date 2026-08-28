"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Building2, ChevronDown, KeyRound, Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CAMCCUL_CHAPTERS } from "@/lib/chapters";
import { cn } from "@/lib/utils";

interface CreditUnionRow {
  id: string;
  code: string;
  name: string;
  chapter: string | null;
  email: string | null;
  status: "Active" | "Inactive" | "No Account";
}

async function fetchCreditUnions(): Promise<CreditUnionRow[]> {
  const response = await fetch("/api/admin/credit-unions", { cache: "no-store" });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error ?? "Could not load credit unions.");
  return body.creditUnions ?? [];
}

export default function ChaptersPage() {
  const [creditUnions, setCreditUnions] = useState<CreditUnionRow[]>([]);
  const [openChapters, setOpenChapters] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const loadCreditUnions = useCallback(async () => {
    setIsLoading(true);
    try {
      setCreditUnions(await fetchCreditUnions());
    } catch (caught) {
      setMessage({ type: "error", text: caught instanceof Error ? caught.message : "Could not load credit unions." });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    fetchCreditUnions()
      .then((rows) => { if (!ignore) setCreditUnions(rows); })
      .catch((caught) => {
        if (!ignore) setMessage({ type: "error", text: caught instanceof Error ? caught.message : "Could not load credit unions." });
      })
      .finally(() => { if (!ignore) setIsLoading(false); });
    return () => { ignore = true; };
  }, []);

  const byChapter = useMemo(() => {
    const groups = new Map<string, CreditUnionRow[]>(CAMCCUL_CHAPTERS.map((chapter) => [chapter, []]));
    for (const creditUnion of creditUnions) {
      if (creditUnion.chapter && groups.has(creditUnion.chapter)) groups.get(creditUnion.chapter)?.push(creditUnion);
    }
    return groups;
  }, [creditUnions]);

  function toggleChapter(chapter: string) {
    setOpenChapters((current) => {
      const next = new Set(current);
      if (next.has(chapter)) next.delete(chapter); else next.add(chapter);
      return next;
    });
  }

  async function deleteCreditUnion(creditUnion: CreditUnionRow) {
    if (!window.confirm(`Delete ${creditUnion.name} and its portal account? This cannot be undone.`)) return;
    setActiveAction(`delete-${creditUnion.id}`);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/credit-unions/${creditUnion.id}`, { method: "DELETE" });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error ?? "Could not delete the credit union.");
      setMessage({ type: "success", text: `${creditUnion.name} was deleted.` });
      await loadCreditUnions();
    } catch (caught) {
      setMessage({ type: "error", text: caught instanceof Error ? caught.message : "Could not delete the credit union." });
    } finally {
      setActiveAction(null);
    }
  }

  async function resetPassword(creditUnion: CreditUnionRow) {
    if (!window.confirm(`Reset the portal password for ${creditUnion.name}? Existing sessions will be signed out.`)) return;
    setActiveAction(`reset-${creditUnion.id}`);
    setMessage(null);
    try {
      const response = await fetch(`/api/admin/credit-unions/${creditUnion.id}/reset-password`, { method: "POST" });
      const body = await response.json().catch(() => null);
      if (!response.ok) throw new Error(body?.error ?? "Could not reset the password.");
      setMessage({
        type: body.emailSent ? "success" : "error",
        text: body.emailSent
          ? `A new password was emailed to ${creditUnion.email}.`
          : `Password reset, but email failed. Temporary password: ${body.password}`,
      });
    } catch (caught) {
      setMessage({ type: "error", text: caught instanceof Error ? caught.message : "Could not reset the password." });
    } finally {
      setActiveAction(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900">Chapters &amp; Credit Unions</h1>
      <p className="mt-1 text-sm text-gray-500">Manage all 10 chapters and the credit unions under each one.</p>

      {message && (
        <p className={cn("mt-5 rounded-lg border px-4 py-3 text-sm", message.type === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-700")}>{message.text}</p>
      )}

      <div className="mt-6 space-y-3">
        {CAMCCUL_CHAPTERS.map((chapter) => {
          const rows = byChapter.get(chapter) ?? [];
          const isOpen = openChapters.has(chapter);
          return (
            <Card key={chapter} className="overflow-hidden p-0">
              <div className="flex flex-wrap items-center gap-3 px-5 py-4">
                <button type="button" onClick={() => toggleChapter(chapter)} aria-expanded={isOpen} className="flex min-w-0 flex-1 items-center gap-3 text-left">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50 text-primary-600"><Building2 className="h-5 w-5" /></span>
                  <span className="min-w-0">
                    <span className="block font-bold text-gray-900">{chapter}</span>
                    <span className="block text-sm text-gray-500">{rows.length} credit {rows.length === 1 ? "union" : "unions"}</span>
                  </span>
                  <ChevronDown className={cn("ml-auto h-5 w-5 shrink-0 text-gray-400 transition-transform", isOpen && "rotate-180")} />
                </button>
                <Link href={`/admin/users/create?chapter=${encodeURIComponent(chapter)}`} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "shrink-0")}>
                  <Plus className="h-4 w-4" /> Add Credit Union
                </Link>
              </div>

              {isOpen && (
                <div className="border-t border-gray-200">
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2 px-5 py-8 text-sm text-gray-500"><Loader2 className="h-4 w-4 animate-spin" /> Loading...</div>
                  ) : rows.length === 0 ? (
                    <p className="px-5 py-8 text-center text-sm text-gray-500">No credit unions have been added to this chapter.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[850px] text-left text-sm">
                        <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500"><tr><th className="px-5 py-3">Code</th><th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Status</th><th className="px-5 py-3 text-right">Actions</th></tr></thead>
                        <tbody className="divide-y divide-gray-100">
                          {rows.map((creditUnion) => (
                            <tr key={creditUnion.id} className="hover:bg-gray-50/70">
                              <td className="px-5 py-4 font-mono text-xs text-gray-600">{creditUnion.code}</td>
                              <td className="px-5 py-4 font-medium text-gray-900">{creditUnion.name}</td>
                              <td className="px-5 py-4 text-gray-600">{creditUnion.email ?? "—"}</td>
                              <td className="px-5 py-4"><Badge variant={creditUnion.status === "Active" ? "success" : creditUnion.status === "Inactive" ? "danger" : "default"}>{creditUnion.status}</Badge></td>
                              <td className="px-5 py-4"><div className="flex justify-end gap-1">
                                <Link href={`/admin/affiliates/${creditUnion.id}/edit`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}><Pencil className="h-4 w-4" /> Edit</Link>
                                <Button type="button" variant="ghost" size="sm" disabled={activeAction === `reset-${creditUnion.id}` || creditUnion.status === "No Account"} onClick={() => resetPassword(creditUnion)}>{activeAction === `reset-${creditUnion.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />} Reset Password</Button>
                                <Button type="button" variant="ghost" size="sm" disabled={activeAction === `delete-${creditUnion.id}`} onClick={() => deleteCreditUnion(creditUnion)} className="text-red-600 hover:bg-red-50 hover:text-red-700">{activeAction === `delete-${creditUnion.id}` ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />} Delete</Button>
                              </div></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
