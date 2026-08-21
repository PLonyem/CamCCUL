"use client";

import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";

export interface ProfileField {
  key: string;
  label: string;
  /** Element id on /dashboard/profile this field's input lives at, for the
   * "click a missing field to jump to it" link below. */
  anchorId: string;
  filled: boolean;
}

interface ProfileCompletionProps {
  fields: ProfileField[];
}

export function ProfileCompletion({ fields }: ProfileCompletionProps) {
  const filledFields = fields.filter((f) => f.filled);
  const missingFields = fields.filter((f) => !f.filled);
  const percentage = Math.round((filledFields.length / fields.length) * 100);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-semibold text-lg text-gray-900">Profile Completion</h2>
        <p className="font-display text-3xl font-bold text-primary-600">{percentage}% complete</p>
      </div>

      <div className="h-2 bg-gray-100 rounded-full mt-4 overflow-hidden">
        <div
          className="h-2 bg-primary-500 rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {percentage === 100 ? (
        <div className="mt-5 flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm font-medium">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Profile complete!
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Completed</p>
            <ul className="mt-2 space-y-1.5">
              {filledFields.map((field) => (
                <li key={field.key} className="flex items-center gap-2 text-sm text-gray-700">
                  <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                  {field.label}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Still needed:</p>
            <ul className="mt-2 space-y-1.5">
              {missingFields.map((field) => (
                <li key={field.key}>
                  <Link
                    href={`/dashboard/profile#${field.anchorId}`}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors"
                  >
                    <Circle className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                    {field.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
