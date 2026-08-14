"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  creditUnionProfileSchema,
  wordCount,
  SERVICE_OPTIONS,
  type CreditUnionProfileValues,
} from "@/lib/validation/credit-union-profile";

type ProfileApiResponse = Omit<
  CreditUnionProfileValues,
  "yearFounded" | "totalMembers" | "branchCount" | "boardMemberCount" | "staffCount"
> & {
  yearFounded: number | null;
  totalMembers: number | null;
  branchCount: number | null;
  boardMemberCount: number | null;
  staffCount: number | null;
};

const emptyDefaults = {
  creditUnionName: "",
  code: "",
  chapter: "",
  yearFounded: undefined as unknown as number,
  city: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  briefHistory: "",
  totalMembers: undefined as unknown as number,
  branchCount: undefined as unknown as number,
  servicesOffered: [] as string[],
  servicesOfferedOther: "",
  boardChairperson: "",
  generalManager: "",
  boardMemberCount: undefined as unknown as number,
  staffCount: undefined as unknown as number,
};

const inputClass =
  "w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition disabled:opacity-50 disabled:bg-gray-50 disabled:cursor-not-allowed";
const labelClass = "text-sm font-medium text-gray-700";
const errorClass = "text-xs text-red-500 min-h-[16px]";

export default function CreditUnionProfilePage() {
  const router = useRouter();
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<CreditUnionProfileValues>({
    resolver: zodResolver(creditUnionProfileSchema),
    defaultValues: emptyDefaults,
  });

  useEffect(() => {
    let ignore = false;

    async function load() {
      try {
        const res = await fetch("/api/dashboard/profile");
        if (!res.ok) throw new Error("Failed to load profile");
        const data: ProfileApiResponse & { name: string; code: string; chapter: string } =
          await res.json();
        if (ignore) return;

        // Only fields that already have a real value overwrite the empty
        // defaults above — a chapter filling this in for the first time
        // should see blank required fields, not 0 / "Invalid Date" style
        // placeholders derived from nulls.
        reset({
          creditUnionName: data.name ?? "",
          code: data.code ?? "",
          chapter: data.chapter ?? "",
          yearFounded: data.yearFounded ?? emptyDefaults.yearFounded,
          city: data.city ?? "",
          address: data.address ?? "",
          phone: data.phone ?? "",
          email: data.email ?? "",
          website: data.website ?? "",
          briefHistory: data.briefHistory ?? "",
          totalMembers: data.totalMembers ?? emptyDefaults.totalMembers,
          branchCount: data.branchCount ?? emptyDefaults.branchCount,
          servicesOffered: data.servicesOffered ?? [],
          servicesOfferedOther: data.servicesOfferedOther ?? "",
          boardChairperson: data.boardChairperson ?? "",
          generalManager: data.generalManager ?? "",
          boardMemberCount: data.boardMemberCount ?? emptyDefaults.boardMemberCount,
          staffCount: data.staffCount ?? emptyDefaults.staffCount,
        });
      } catch {
        if (!ignore) setLoadError(true);
      } finally {
        if (!ignore) setIsLoadingProfile(false);
      }
    }

    load();
    return () => {
      ignore = true;
    };
  }, [reset]);

  const briefHistoryValue = useWatch({ control, name: "briefHistory" });
  const briefHistoryWords = wordCount(briefHistoryValue ?? "");

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    setIsSubmitting(true);

    const res = await fetch("/api/dashboard/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    setIsSubmitting(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setSubmitError(body?.error ?? "Something went wrong. Please try again.");
      return;
    }

    setIsSubmitted(true);
    setTimeout(() => router.push("/dashboard"), 2000);
  });

  if (isLoadingProfile) {
    return (
      <div className="max-w-3xl mx-auto text-center py-24 text-gray-400 text-sm">
        Loading your profile...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-16">
      <h1 className="font-display text-2xl font-bold text-primary-900">
        Credit Union Profile Form
      </h1>
      <p className="text-gray-600 mt-2">
        Complete all fields below. Once approved, this information will
        appear on the CamCCUL website.
      </p>

      {isSubmitted && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
          <p className="text-green-700 text-sm">
            Your profile has been submitted. You will receive a confirmation
            email.
          </p>
        </div>
      )}

      {loadError && (
        <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-amber-500 shrink-0" />
          <p className="text-amber-700 text-sm">
            Couldn&apos;t load your existing profile data. You can still fill
            in the form below.
          </p>
        </div>
      )}

      {submitError && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-red-700 text-sm">{submitError}</p>
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-8 mt-8">
        <fieldset disabled={isSubmitting || isSubmitted} className="space-y-8">
          {/* SECTION 1: CREDIT UNION INFORMATION */}
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-primary-900 uppercase tracking-wide mb-4">
              Credit Union Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="space-y-1">
                <label htmlFor="creditUnionName" className={labelClass}>
                  Credit Union Name
                </label>
                <input
                  id="creditUnionName"
                  type="text"
                  className={inputClass}
                  {...register("creditUnionName")}
                />
                <p className={errorClass}>{errors.creditUnionName?.message}</p>
              </div>
              <div className="space-y-1">
                <label htmlFor="code" className={labelClass}>
                  Code
                </label>
                <input id="code" type="text" className={inputClass} {...register("code")} />
                <p className={errorClass}>{errors.code?.message}</p>
              </div>
              <div className="space-y-1">
                <label htmlFor="chapter" className={labelClass}>
                  Chapter
                </label>
                <input id="chapter" type="text" className={inputClass} {...register("chapter")} />
                <p className={errorClass}>{errors.chapter?.message}</p>
              </div>
            </div>
          </Card>

          {/* SECTION 2: BASIC INFORMATION */}
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-primary-900 uppercase tracking-wide mb-4">
              Basic Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label htmlFor="yearFounded" className={labelClass}>
                  Year Founded
                </label>
                <input
                  id="yearFounded"
                  type="number"
                  className={inputClass}
                  {...register("yearFounded", { valueAsNumber: true })}
                />
                <p className={errorClass}>{errors.yearFounded?.message}</p>
              </div>
              <div className="space-y-1">
                <label htmlFor="city" className={labelClass}>
                  City
                </label>
                <input id="city" type="text" className={inputClass} {...register("city")} />
                <p className={errorClass}>{errors.city?.message}</p>
              </div>
            </div>
            <div className="space-y-1 mt-5">
              <label htmlFor="address" className={labelClass}>
                Address
              </label>
              <input id="address" type="text" className={inputClass} {...register("address")} />
              <p className={errorClass}>{errors.address?.message}</p>
            </div>
          </Card>

          {/* SECTION 3: CONTACT INFORMATION */}
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-primary-900 uppercase tracking-wide mb-4">
              Contact Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label htmlFor="phone" className={labelClass}>
                  Phone
                </label>
                <input
                  id="phone"
                  type="text"
                  placeholder="+237 6XX XXX XXX"
                  className={inputClass}
                  {...register("phone")}
                />
                <p className={errorClass}>{errors.phone?.message}</p>
              </div>
              <div className="space-y-1">
                <label htmlFor="email" className={labelClass}>
                  Email
                </label>
                <input id="email" type="email" className={inputClass} {...register("email")} />
                <p className={errorClass}>{errors.email?.message}</p>
              </div>
            </div>
            <div className="space-y-1 mt-5">
              <label htmlFor="website" className={labelClass}>
                Website <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <input id="website" type="text" className={inputClass} {...register("website")} />
              <p className={errorClass}>{errors.website?.message}</p>
            </div>
          </Card>

          {/* SECTION 4: CREDIT UNION PROFILE */}
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-primary-900 uppercase tracking-wide mb-4">
              Credit Union Profile
            </h2>
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="briefHistory" className={labelClass}>
                  Brief History
                </label>
                <span
                  className={
                    briefHistoryWords > 500
                      ? "text-xs font-medium text-red-500"
                      : "text-xs text-gray-400"
                  }
                >
                  {briefHistoryWords}/500 words
                </span>
              </div>
              <textarea
                id="briefHistory"
                rows={6}
                className={inputClass}
                {...register("briefHistory")}
              />
              <p className={errorClass}>{errors.briefHistory?.message}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
              <div className="space-y-1">
                <label htmlFor="totalMembers" className={labelClass}>
                  Number of Members
                </label>
                <input
                  id="totalMembers"
                  type="number"
                  className={inputClass}
                  {...register("totalMembers", { valueAsNumber: true })}
                />
                <p className={errorClass}>{errors.totalMembers?.message}</p>
              </div>
              <div className="space-y-1">
                <label htmlFor="branchCount" className={labelClass}>
                  Number of Branches
                </label>
                <input
                  id="branchCount"
                  type="number"
                  className={inputClass}
                  {...register("branchCount", { valueAsNumber: true })}
                />
                <p className={errorClass}>{errors.branchCount?.message}</p>
              </div>
            </div>

            <div className="space-y-2 mt-5">
              <p className={labelClass}>Services Offered</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                {SERVICE_OPTIONS.map((service) => (
                  <label key={service} className="flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      value={service}
                      className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
                      {...register("servicesOffered")}
                    />
                    {service}
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-2 pt-1">
                <label htmlFor="servicesOfferedOther" className="text-sm text-gray-700 shrink-0">
                  Other:
                </label>
                <input
                  id="servicesOfferedOther"
                  type="text"
                  className={inputClass}
                  {...register("servicesOfferedOther")}
                />
              </div>
              <p className={errorClass}>{errors.servicesOffered?.message}</p>
            </div>
          </Card>

          {/* SECTION 5: LEADERSHIP */}
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-primary-900 uppercase tracking-wide mb-4">
              Leadership
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label htmlFor="boardChairperson" className={labelClass}>
                  Board Chairperson
                </label>
                <input
                  id="boardChairperson"
                  type="text"
                  className={inputClass}
                  {...register("boardChairperson")}
                />
                <p className={errorClass}>{errors.boardChairperson?.message}</p>
              </div>
              <div className="space-y-1">
                <label htmlFor="generalManager" className={labelClass}>
                  General Manager
                </label>
                <input
                  id="generalManager"
                  type="text"
                  className={inputClass}
                  {...register("generalManager")}
                />
                <p className={errorClass}>{errors.generalManager?.message}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">
              <div className="space-y-1">
                <label htmlFor="boardMemberCount" className={labelClass}>
                  Number of Board Members
                </label>
                <input
                  id="boardMemberCount"
                  type="number"
                  className={inputClass}
                  {...register("boardMemberCount", { valueAsNumber: true })}
                />
                <p className={errorClass}>{errors.boardMemberCount?.message}</p>
              </div>
              <div className="space-y-1">
                <label htmlFor="staffCount" className={labelClass}>
                  Number of Staff
                </label>
                <input
                  id="staffCount"
                  type="number"
                  className={inputClass}
                  {...register("staffCount", { valueAsNumber: true })}
                />
                <p className={errorClass}>{errors.staffCount?.message}</p>
              </div>
            </div>
          </Card>

          <Button type="submit" size="lg" disabled={isSubmitting || isSubmitted}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Profile"
            )}
          </Button>
        </fieldset>
      </form>
    </div>
  );
}
