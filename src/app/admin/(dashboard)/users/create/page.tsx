"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Building2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";
import { ChapterCombobox, type ChapterOption } from "@/components/admin/ChapterCombobox";

type Role = "admin" | "credit_union";

interface CreatedCredentials {
  email: string;
  password: string;
}

const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
const inputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition disabled:opacity-50";

export default function AdminCreateAccountPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("credit_union");
  const [email, setEmail] = useState("");
  const [chapters, setChapters] = useState<ChapterOption[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<ChapterOption | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<CreatedCredentials | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/admin/affiliates?limit=1000")
      .then((res) => res.json())
      .then((data) => setChapters(data.affiliates ?? []))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (role === "credit_union" && !selectedChapter) {
      setError("Select which credit union this account belongs to.");
      return;
    }

    setIsSubmitting(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        role,
        affiliateId: role === "credit_union" ? selectedChapter?.id : undefined,
      }),
    });
    const body = await res.json().catch(() => null);
    setIsSubmitting(false);

    if (!res.ok) {
      setError(body?.error ?? "Something went wrong. Please try again.");
      return;
    }

    setCreated({ email: body.email, password: body.password });
  }

  async function handleCopy() {
    if (!created) return;
    await navigator.clipboard.writeText(
      `Email: ${created.email}\nPassword: ${created.password}`
    );
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  function handleCreateAnother() {
    setCreated(null);
    setEmail("");
    setSelectedChapter(null);
    setError(null);
  }

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
      <p className="text-sm text-gray-500 mt-1">
        Create a new admin or credit union login in Clerk, fully linked from
        the start — no manual metadata setup needed afterward.
      </p>

      <Card className="mt-6 p-6">
        {created ? (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm">
              <p className="font-medium text-amber-800">
                Copy this now — the password won&rsquo;t be shown again.
              </p>
              <dl className="mt-3 space-y-1 font-mono text-xs text-gray-700">
                <div className="flex gap-2">
                  <dt className="text-gray-500 w-16 shrink-0">Email</dt>
                  <dd className="break-all">{created.email}</dd>
                </div>
                <div className="flex gap-2">
                  <dt className="text-gray-500 w-16 shrink-0">Password</dt>
                  <dd className="break-all">{created.password}</dd>
                </div>
              </dl>
            </div>
            <div className="flex gap-3">
              <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy credentials
                  </>
                )}
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={handleCreateAnother}>
                Create another
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => router.push("/admin/users")}
              >
                View all users
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={labelClass}>Account type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={cn(
                    "flex items-center gap-2 justify-center rounded-lg border py-2.5 text-sm font-medium transition-colors",
                    role === "admin"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-300 text-gray-500 hover:bg-gray-50"
                  )}
                >
                  <ShieldCheck className="h-4 w-4" />
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setRole("credit_union")}
                  className={cn(
                    "flex items-center gap-2 justify-center rounded-lg border py-2.5 text-sm font-medium transition-colors",
                    role === "credit_union"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-300 text-gray-500 hover:bg-gray-50"
                  )}
                >
                  <Building2 className="h-4 w-4" />
                  Credit Union
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className={inputClass}
              />
            </div>

            {role === "credit_union" && (
              <div>
                <label className={labelClass}>Credit union</label>
                <ChapterCombobox
                  chapters={chapters}
                  value={selectedChapter}
                  onChange={setSelectedChapter}
                  disabled={isSubmitting}
                />
              </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={isSubmitting} className="w-full justify-center">
              {isSubmitting ? "Creating..." : "Create Account"}
            </Button>
          </form>
        )}
      </Card>
    </div>
  );
}
