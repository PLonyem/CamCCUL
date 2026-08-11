"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

const passwordFormSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

function ProfileSection() {
  const router = useRouter();
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: { name: "", email: "" },
  });

  useEffect(() => {
    let ignore = false;
    fetch("/api/admin/settings/profile")
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data: { name: string; email: string }) => {
        if (ignore) return;
        reset({ name: data.name, email: data.email });
        setIsLoaded(true);
      })
      .catch(() => {
        if (!ignore) setLoadError("Couldn't load your profile.");
      });
    return () => {
      ignore = true;
    };
  }, [reset]);

  const onSubmit = handleSubmit(async (values) => {
    setMessage(null);
    setIsSubmitting(true);

    const res = await fetch("/api/admin/settings/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setMessage({
        type: "error",
        text: body?.error ?? "Something went wrong. Please try again.",
      });
      setIsSubmitting(false);
      return;
    }

    // The session callback re-reads name/email from the database on every
    // request, so re-rendering the (server-rendered) layout via router
    // refresh is enough to update the sidebar/navbar — no client-side
    // session mutation needed.
    router.refresh();
    setMessage({ type: "success", text: "Profile updated." });
    setIsSubmitting(false);
  });

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile</h2>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm mb-4 ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          {message.text}
        </div>
      )}

      {loadError && <p className="text-sm text-red-600">{loadError}</p>}

      {!isLoaded && !loadError && (
        <p className="text-sm text-gray-400">Loading profile...</p>
      )}

      {isLoaded && (
        <form onSubmit={onSubmit} noValidate className="space-y-5">
          <div className="space-y-1">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition disabled:opacity-50"
              {...register("name")}
            />
            <p className="text-xs text-red-500 min-h-[16px]">
              {errors.name?.message}
            </p>
          </div>

          <div className="space-y-1">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              disabled={isSubmitting}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition disabled:opacity-50"
              {...register("email")}
            />
            <p className="text-xs text-red-500 min-h-[16px]">
              {errors.email?.message}
            </p>
          </div>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Profile"}
          </Button>
        </form>
      )}
    </Card>
  );
}

function PasswordSection() {
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
  });

  const onSubmit = handleSubmit(async (values) => {
    setMessage(null);
    setIsSubmitting(true);

    const res = await fetch("/api/admin/settings/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setMessage({
        type: "error",
        text: body?.error ?? "Something went wrong. Please try again.",
      });
      setIsSubmitting(false);
      return;
    }

    reset();
    setMessage({ type: "success", text: "Password changed." });
    setIsSubmitting(false);
  });

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Change Password
      </h2>

      {message && (
        <div
          className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm mb-4 ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          {message.text}
        </div>
      )}

      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div className="space-y-1">
          <label
            htmlFor="currentPassword"
            className="text-sm font-medium text-gray-700"
          >
            Current Password
          </label>
          <input
            id="currentPassword"
            type="password"
            disabled={isSubmitting}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition disabled:opacity-50"
            {...register("currentPassword")}
          />
          <p className="text-xs text-red-500 min-h-[16px]">
            {errors.currentPassword?.message}
          </p>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="newPassword"
            className="text-sm font-medium text-gray-700"
          >
            New Password
          </label>
          <input
            id="newPassword"
            type="password"
            disabled={isSubmitting}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition disabled:opacity-50"
            {...register("newPassword")}
          />
          <p className="text-xs text-red-500 min-h-[16px]">
            {errors.newPassword?.message}
          </p>
        </div>

        <div className="space-y-1">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-gray-700"
          >
            Confirm New Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            disabled={isSubmitting}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition disabled:opacity-50"
            {...register("confirmPassword")}
          />
          <p className="text-xs text-red-500 min-h-[16px]">
            {errors.confirmPassword?.message}
          </p>
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Change Password"}
        </Button>
      </form>
    </Card>
  );
}

export default function AdminSettingsPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <ProfileSection />
      <PasswordSection />
    </div>
  );
}
