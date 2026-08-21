"use client";

import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { SignupRequestRow } from "@/app/api/admin/users/pending/route";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function statusBadgeVariant(status: string): "success" | "danger" | "default" {
  if (status === "approved") return "success";
  if (status === "rejected") return "danger";
  return "default";
}

function ApproveDialog({
  request,
  onOpenChange,
  isConfirming,
  onConfirm,
}: {
  request: SignupRequestRow | null;
  onOpenChange: (open: boolean) => void;
  isConfirming: boolean;
  onConfirm: () => void;
}) {
  return (
    <Dialog.Root open={!!request} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-white rounded-xl shadow-lg p-6">
          <Dialog.Title className="text-lg font-semibold text-gray-900">Approve account?</Dialog.Title>
          <Dialog.Description className="mt-2 text-sm text-gray-500">
            Approve this account for <span className="font-medium text-gray-700">{request?.creditUnionName}</span>?
            They&apos;ll be able to sign in and access their dashboard immediately.
          </Dialog.Description>
          <div className="mt-6 flex justify-end gap-3">
            <Dialog.Close asChild>
              <Button variant="outline" disabled={isConfirming}>
                Cancel
              </Button>
            </Dialog.Close>
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              disabled={isConfirming}
              onClick={onConfirm}
            >
              {isConfirming ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                "Approve"
              )}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Keyed by request?.id in the parent below — remounting on a different
// request naturally resets `reason` to "", so no effect is needed to
// clear it between opens (React's recommended fix for "reset local state
// when a prop changes" is a key, not useEffect + setState).
function RejectDialogContent({
  request,
  isConfirming,
  onConfirm,
}: {
  request: SignupRequestRow;
  isConfirming: boolean;
  onConfirm: (reason: string) => void;
}) {
  const [reason, setReason] = useState("");

  return (
    <>
      <Dialog.Title className="text-lg font-semibold text-gray-900">Reject account?</Dialog.Title>
      <Dialog.Description className="mt-2 text-sm text-gray-500">
        Reject the request from <span className="font-medium text-gray-700">{request.creditUnionName}</span>?
      </Dialog.Description>
      <div className="mt-4">
        <label htmlFor="rejectReason" className="block text-sm font-medium text-gray-700 mb-1.5">
          Why is this request being rejected?
        </label>
        <textarea
          id="rejectReason"
          rows={3}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={isConfirming}
          placeholder="Optional — included in the email sent to the applicant"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition disabled:opacity-50"
        />
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <Dialog.Close asChild>
          <Button variant="outline" disabled={isConfirming}>
            Cancel
          </Button>
        </Dialog.Close>
        <Button
          variant="default"
          className="bg-red-600 hover:bg-red-700"
          disabled={isConfirming}
          onClick={() => onConfirm(reason)}
        >
          {isConfirming ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Rejecting...
            </>
          ) : (
            "Reject"
          )}
        </Button>
      </div>
    </>
  );
}

function RejectDialog({
  request,
  onOpenChange,
  isConfirming,
  onConfirm,
}: {
  request: SignupRequestRow | null;
  onOpenChange: (open: boolean) => void;
  isConfirming: boolean;
  onConfirm: (reason: string) => void;
}) {
  return (
    <Dialog.Root open={!!request} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-40" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-sm bg-white rounded-xl shadow-lg p-6">
          {request && (
            <RejectDialogContent key={request.id} request={request} isConfirming={isConfirming} onConfirm={onConfirm} />
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export default function PendingAccountRequestsPage() {
  const [pending, setPending] = useState<SignupRequestRow[] | null>(null);
  const [recentlyProcessed, setRecentlyProcessed] = useState<SignupRequestRow[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [approveTarget, setApproveTarget] = useState<SignupRequestRow | null>(null);
  const [rejectTarget, setRejectTarget] = useState<SignupRequestRow | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  function loadData() {
    fetch("/api/admin/users/pending")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load");
        return res.json();
      })
      .then((body: { pending: SignupRequestRow[]; recentlyProcessed: SignupRequestRow[] }) => {
        setPending(body.pending);
        setRecentlyProcessed(body.recentlyProcessed);
      })
      .catch(() => setError("Could not load pending account requests."));
  }

  useEffect(() => {
    loadData();
  }, []);

  async function handleApprove() {
    if (!approveTarget) return;
    setIsProcessing(true);
    setActionError(null);
    const res = await fetch("/api/admin/users/approve", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: approveTarget.id }),
    });
    const body = await res.json().catch(() => null);
    setIsProcessing(false);

    if (!res.ok) {
      setActionError(body?.error ?? "Could not approve this request.");
      return;
    }
    setApproveTarget(null);
    loadData();
    window.dispatchEvent(new Event("admin-badge-refresh"));
  }

  async function handleReject(reason: string) {
    if (!rejectTarget) return;
    setIsProcessing(true);
    setActionError(null);
    const res = await fetch("/api/admin/users/reject", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: rejectTarget.id, reason }),
    });
    const body = await res.json().catch(() => null);
    setIsProcessing(false);

    if (!res.ok) {
      setActionError(body?.error ?? "Could not reject this request.");
      return;
    }
    setRejectTarget(null);
    loadData();
    window.dispatchEvent(new Event("admin-badge-refresh"));
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">Pending Account Requests</h1>
      <p className="text-sm text-gray-500 mt-1">Review and approve credit union account requests.</p>

      {actionError && (
        <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {actionError}
        </p>
      )}

      {error ? (
        <p className="mt-6 text-sm text-red-600">{error}</p>
      ) : !pending ? (
        <p className="mt-6 text-sm text-gray-400">Loading...</p>
      ) : pending.length === 0 ? (
        <div className="mt-6 bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
          No pending account requests.
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {pending.map((request) => (
            <Card key={request.id} className="p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-lg">{request.creditUnionName}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="primary">{request.chapter}</Badge>
                </div>
                <p className="text-sm text-gray-600 mt-1.5">{request.email}</p>
                <p className="text-xs text-gray-400 mt-1">Requested {formatDate(request.createdAt)}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  type="button"
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => setApproveTarget(request)}
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Approve
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                  onClick={() => setRejectTarget(request)}
                >
                  <XCircle className="h-4 w-4" />
                  Reject
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <h2 className="text-lg font-semibold text-gray-900 mt-10">Recently Processed</h2>
      {recentlyProcessed.length === 0 ? (
        <p className="mt-3 text-sm text-gray-400">Nothing processed yet.</p>
      ) : (
        <div className="mt-4 bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Credit Union</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Chapter</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Email</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Status</th>
                  <th className="text-left font-medium text-gray-500 px-4 py-3">Processed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentlyProcessed.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-gray-900">{request.creditUnionName}</td>
                    <td className="px-4 py-3 text-gray-600">{request.chapter}</td>
                    <td className="px-4 py-3 text-gray-600 font-mono text-xs">{request.email}</td>
                    <td className="px-4 py-3">
                      <Badge variant={statusBadgeVariant(request.status)}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs">{formatDate(request.updatedAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ApproveDialog
        request={approveTarget}
        onOpenChange={(open) => !open && setApproveTarget(null)}
        isConfirming={isProcessing}
        onConfirm={handleApprove}
      />
      <RejectDialog
        request={rejectTarget}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        isConfirming={isProcessing}
        onConfirm={handleReject}
      />
    </div>
  );
}
