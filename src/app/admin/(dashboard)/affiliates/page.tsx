"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { regions, regionLabels } from "@/lib/mock-data";

interface AffiliateRow {
  id: string;
  code: string;
  name: string;
  region: string;
  city: string | null;
  phone: string | null;
  isActive: boolean;
}

interface ListResponse {
  affiliates: AffiliateRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const LIMIT = 50;

function regionLabel(region: string): string {
  return regionLabels[region]?.en ?? region;
}

export default function AdminAffiliatesPage() {
  const [affiliates, setAffiliates] = useState<AffiliateRow[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [region, setRegion] = useState("");

  const [deleteTarget, setDeleteTarget] = useState<AffiliateRow | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshToken, setRefreshToken] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset to page 1 whenever the filters change, and flag a reload whenever
  // the effective request (page + filters + manual refresh) changes.
  // Adjusted during render (React's documented pattern for this) rather
  // than in an effect, so it doesn't trigger a second, cascading render.
  const filterKey = `${debouncedSearch}|${region}`;
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey);
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey);
    setPage(1);
  }

  const requestKey = `${filterKey}|${page}|${refreshToken}`;
  const [prevRequestKey, setPrevRequestKey] = useState(requestKey);
  if (requestKey !== prevRequestKey) {
    setPrevRequestKey(requestKey);
    setIsLoading(true);
  }

  useEffect(() => {
    let ignore = false;
    const params = new URLSearchParams({
      page: String(page),
      limit: String(LIMIT),
    });
    if (debouncedSearch) params.set("search", debouncedSearch);
    if (region) params.set("region", region);

    fetch(`/api/admin/affiliates?${params.toString()}`)
      .then((res) => res.json())
      .then((data: ListResponse) => {
        if (ignore) return;
        setAffiliates(data.affiliates);
        setTotal(data.total);
        setTotalPages(data.totalPages);
        setIsLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [page, debouncedSearch, region, refreshToken]);

  async function handleDelete() {
    if (!deleteTarget) return;
    setIsDeleting(true);
    await fetch(`/api/admin/affiliates/${deleteTarget.id}`, {
      method: "DELETE",
    });
    setIsDeleting(false);
    setDeleteTarget(null);
    setRefreshToken((t) => t + 1);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Affiliates</h1>
        <div className="flex gap-3">
          <Link
            href="/admin/affiliates/new"
            className={buttonVariants({ variant: "default" })}
          >
            <Plus className="h-4 w-4" />
            Add Affiliate
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or code..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-300 rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
          />
        </div>

        <select
          value={region}
          onChange={(e) => setRegion(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
        >
          <option value="">All Regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {regionLabel(r)}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
          Loading...
        </div>
      ) : affiliates.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
          No affiliates found
        </div>
      ) : (
        <>
          {/* Desktop: table */}
          <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">
                      Code
                    </th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">
                      Name
                    </th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">
                      Region
                    </th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">
                      City
                    </th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">
                      Phone
                    </th>
                    <th className="text-left font-medium text-gray-500 px-4 py-3">
                      Status
                    </th>
                    <th className="text-right font-medium text-gray-500 px-4 py-3">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {affiliates.map((affiliate) => (
                    <tr key={affiliate.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-600">
                        {affiliate.code}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-bold text-gray-900">{affiliate.name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant="primary">{regionLabel(affiliate.region)}</Badge>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {affiliate.city ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {affiliate.phone ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={affiliate.isActive ? "success" : "default"}>
                          {affiliate.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/affiliates/${affiliate.id}/edit`}
                            className="text-gray-400 hover:text-primary-600 transition-colors"
                            aria-label="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(affiliate)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                            aria-label="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile: stacked cards */}
          <div className="md:hidden space-y-3">
            {affiliates.map((affiliate) => (
              <div
                key={affiliate.id}
                className="bg-white border border-gray-200 rounded-xl p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-gray-900">{affiliate.name}</p>
                    <p className="font-mono text-xs text-gray-500 mt-0.5">
                      {affiliate.code}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <Link
                      href={`/admin/affiliates/${affiliate.id}/edit`}
                      className="text-gray-400 hover:text-primary-600 transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(affiliate)}
                      className="text-gray-400 hover:text-red-600 transition-colors"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="primary">{regionLabel(affiliate.region)}</Badge>
                  <Badge variant={affiliate.isActive ? "success" : "default"}>
                    {affiliate.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{affiliate.city ?? "—"}</span>
                  <span>{affiliate.phone ?? "—"}</span>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {total} affiliate{total === 1 ? "" : "s"} — page {page} of{" "}
            {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Delete affiliate?"
        description={`This will permanently delete "${deleteTarget?.name ?? ""}". This action cannot be undone.`}
        isConfirming={isDeleting}
        onConfirm={handleDelete}
      />
    </div>
  );
}
