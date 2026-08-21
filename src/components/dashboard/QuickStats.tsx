"use client";

import Link from "next/link";
import { Users, Building2, Calendar, Tag, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickStatsProps {
  isApproved: boolean;
  totalMembers: number | null;
  branchCount: number | null;
  yearEstablished: number | null;
  servicesCount: number;
}

function StatCard({
  icon: Icon,
  value,
  label,
}: {
  icon: typeof Users;
  value: number | null;
  label: string;
}) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
      <div className="bg-primary-100 text-primary-600 rounded-full p-3 w-fit mx-auto">
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-display text-2xl font-bold text-gray-900 mt-3">
        {value === null ? "—" : value}
      </p>
      <p className="text-sm text-gray-500 mt-0.5">{label}</p>
    </div>
  );
}

export function QuickStats({
  isApproved,
  totalMembers,
  branchCount,
  yearEstablished,
  servicesCount,
}: QuickStatsProps) {
  if (!isApproved) {
    return (
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 text-sm">
        <Info className="h-4 w-4 shrink-0 mt-0.5" />
        Stats will appear once your profile is approved.
      </div>
    );
  }

  const hasMissingData = totalMembers === null || branchCount === null || yearEstablished === null;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard icon={Users} value={totalMembers} label="Members" />
        <StatCard icon={Building2} value={branchCount} label="Branches" />
        <StatCard icon={Calendar} value={yearEstablished} label="Founded" />
        <StatCard icon={Tag} value={servicesCount} label="Services" />
      </div>
      {hasMissingData && (
        <p className="text-sm text-gray-400 mt-3 text-center">
          Some fields aren&apos;t filled in yet.{" "}
          <Link href="/dashboard/profile" className={cn("text-primary-600 hover:text-primary-700")}>
            Complete your profile
          </Link>{" "}
          to see your stats here.
        </p>
      )}
    </div>
  );
}
