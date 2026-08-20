"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// @clerk/nextjs's plain export now points to a newer signals-based
// useSignUp ({ signUp, errors, fetchStatus }) — this custom flow needs the
// classic resource hook ({ isLoaded, signUp, setActive }), which lives at
// this legacy subpath instead.
import { useSignUp } from "@clerk/nextjs/legacy";
import { Loader2, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import {
  creditUnionSignupFormSchema,
  SIGNUP_CHAPTERS,
} from "@/lib/validation/credit-union-signup";

type Step = "form" | "verify";

// Wider than the validated CreditUnionSignupFormInput (whose `chapter` is
// narrowed to the enum literals) — this is the raw, possibly-incomplete
// state of the <select>, which starts as "" so the placeholder shows and
// an unsubmitted form can't silently carry a real chapter value.
interface FormState {
  creditUnionName: string;
  chapter: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const EMPTY_FORM: FormState = {
  creditUnionName: "",
  chapter: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";
const inputClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition disabled:opacity-50";
const helperClass = "text-xs text-gray-500 mt-1";
const errorClass = "text-xs text-red-600 mt-1";

// Clerk throws with an `errors` array on both its own resources and the
// backend SDK — same shape, different layer. `form_identifier_exists` is
// Clerk's stable code for "this email already has an account."
function extractSignUpErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === "object" &&
    "errors" in error &&
    Array.isArray((error as { errors: unknown }).errors)
  ) {
    const first = (error as { errors: { code?: string; message?: string; longMessage?: string }[] })
      .errors[0];
    if (first?.code === "form_identifier_exists") {
      return "This email is already in use. Please sign in.";
    }
    if (first?.longMessage || first?.message) {
      return first.longMessage ?? first.message ?? "Something went wrong. Please try again.";
    }
  }
  return "Something went wrong. Please try again.";
}

export default function CreditUnionSignupPage() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [step, setStep] = useState<Step>("form");
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [code, setCode] = useState("");
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear a stale error as soon as the field changes, rather than leaving
    // a blur-time duplicate message on screen after the user starts fixing it.
    setFieldErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  }

  // Real-time duplicate check on blur — same endpoint the submit-time
  // pre-flight check below uses, just called earlier so the applicant sees
  // "this email already requested access" before filling out the rest of
  // the form instead of only at submission.
  async function checkDuplicate(field: "email" | "creditUnionName", value: string) {
    if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return;
    if (field === "creditUnionName" && value.trim().length < 3) return;

    try {
      const res = await fetch("/api/signup/credit-union/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      const body = await res.json().catch(() => null);
      if (field === "email" && body?.emailInUse) {
        setFieldErrors((prev) => ({ ...prev, email: body.emailMessage }));
      } else if (field === "creditUnionName" && body?.nameInUse) {
        setFieldErrors((prev) => ({ ...prev, creditUnionName: body.nameMessage }));
      }
    } catch {
      // Best-effort — the submit-time check below is the real gate.
    }
  }

  // Files the review-queue row now that the Clerk account is confirmed —
  // shared by both the no-verification-needed path and the post-code-entry
  // path below, since either can be the moment verification finishes.
  async function finalizeSignupRequest() {
    const res = await fetch("/api/signup/credit-union", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ creditUnionName: form.creditUnionName, chapter: form.chapter }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => null);
      throw new Error(body?.error ?? "Something went wrong. Please try again.");
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFieldErrors({});

    const parsed = creditUnionSignupFormSchema.safeParse(form);
    if (!parsed.success) {
      const nextErrors: Partial<Record<keyof FormState, string>> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormState;
        if (!nextErrors[key]) nextErrors[key] = issue.message;
      }
      setFieldErrors(nextErrors);
      return;
    }

    if (!isLoaded) return;

    setIsSubmitting(true);
    try {
      // Pre-flight check (both fields together) first — avoids the dead
      // end of a Clerk account existing but the review request permanently
      // blocked by an email or name someone else already claimed.
      const checkRes = await fetch("/api/signup/credit-union/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data.email, creditUnionName: parsed.data.creditUnionName }),
      });
      const checkBody = await checkRes.json().catch(() => null);
      if (!checkRes.ok) {
        const nextErrors: Partial<Record<keyof FormState, string>> = {};
        if (checkBody?.emailInUse) nextErrors.email = checkBody.emailMessage;
        if (checkBody?.nameInUse) nextErrors.creditUnionName = checkBody.nameMessage;
        if (Object.keys(nextErrors).length > 0) {
          setFieldErrors(nextErrors);
        } else {
          setFormError(checkBody?.error ?? "Something went wrong. Please try again.");
        }
        return;
      }

      const result = await signUp.create({
        emailAddress: parsed.data.email,
        password: parsed.data.password,
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        await finalizeSignupRequest();
        // Straight to the homepage, where the Navbar now shows a "My
        // Dashboard" button for this exact state (signed in, no role yet).
        // Clicking it lands on /dashboard's review-status screen — that's
        // the actual confirmation now, not a message on this page that a
        // stray Clerk-triggered navigation could blow past unseen.
        router.push("/");
      } else {
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setStep("verify");
      }
    } catch (error) {
      setFormError(error instanceof Error ? error.message : extractSignUpErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleVerify(e: FormEvent) {
    e.preventDefault();
    setVerifyError(null);

    if (!isLoaded) return;

    setIsVerifying(true);
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        await finalizeSignupRequest();
        // Straight to the homepage, where the Navbar now shows a "My
        // Dashboard" button for this exact state (signed in, no role yet).
        // Clicking it lands on /dashboard's review-status screen — that's
        // the actual confirmation now, not a message on this page that a
        // stray Clerk-triggered navigation could blow past unseen.
        router.push("/");
      } else {
        setVerifyError("Invalid or expired code. Please try again.");
      }
    } catch (error) {
      setVerifyError(error instanceof Error ? error.message : extractSignUpErrorMessage(error));
    } finally {
      setIsVerifying(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-xl">C</span>
          </div>
          <h1 className="font-display text-2xl font-bold text-primary-900 mt-3">Create Account</h1>
          <p className="text-sm text-gray-500 mt-1">Set up your credit union&apos;s access</p>
        </div>

        <div className="bg-white shadow-lg rounded-xl border border-gray-200 p-6">
          {step === "verify" ? (
            <form onSubmit={handleVerify} className="space-y-5">
              <div>
                <p className="text-sm text-gray-600">
                  We sent a verification code to <span className="font-medium">{form.email}</span>.
                  Enter it below to finish creating your account.
                </p>
              </div>
              <div>
                <label htmlFor="code" className={labelClass}>
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  inputMode="numeric"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={isVerifying}
                  className={inputClass}
                />
                {verifyError && <p className={errorClass}>{verifyError}</p>}
              </div>
              <Button type="submit" disabled={isVerifying} className="w-full justify-center">
                {isVerifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify Email"
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="creditUnionName" className={labelClass}>
                  Credit Union Name
                </label>
                <input
                  id="creditUnionName"
                  type="text"
                  placeholder="Type your full credit union name"
                  value={form.creditUnionName}
                  onChange={(e) => updateField("creditUnionName", e.target.value)}
                  onBlur={(e) => checkDuplicate("creditUnionName", e.target.value)}
                  disabled={isSubmitting}
                  className={inputClass}
                />
                <p className={helperClass}>This must be the official name of your credit union.</p>
                {fieldErrors.creditUnionName && <p className={errorClass}>{fieldErrors.creditUnionName}</p>}
              </div>

              <div>
                <label htmlFor="chapter" className={labelClass}>
                  Chapter
                </label>
                <select
                  id="chapter"
                  value={form.chapter}
                  onChange={(e) => updateField("chapter", e.target.value)}
                  disabled={isSubmitting}
                  className={inputClass}
                >
                  <option value="" disabled>
                    — Select Chapter —
                  </option>
                  {SIGNUP_CHAPTERS.map((chapter) => (
                    <option key={chapter} value={chapter}>
                      {chapter}
                    </option>
                  ))}
                </select>
                {fieldErrors.chapter && <p className={errorClass}>{fieldErrors.chapter}</p>}
              </div>

              <div>
                <label htmlFor="email" className={labelClass}>
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="manager@yourcreditunion.cm"
                  value={form.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  onBlur={(e) => checkDuplicate("email", e.target.value)}
                  disabled={isSubmitting}
                  className={inputClass}
                />
                {fieldErrors.email && <p className={errorClass}>{fieldErrors.email}</p>}
              </div>

              <div>
                <label htmlFor="password" className={labelClass}>
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => updateField("password", e.target.value)}
                    disabled={isSubmitting}
                    className={cn(inputClass, "pr-10")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={isSubmitting}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <p className={helperClass}>At least 8 characters, including one number.</p>
                {fieldErrors.password && <p className={errorClass}>{fieldErrors.password}</p>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className={labelClass}>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => updateField("confirmPassword", e.target.value)}
                    disabled={isSubmitting}
                    className={cn(inputClass, "pr-10")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    disabled={isSubmitting}
                    aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && <p className={errorClass}>{fieldErrors.confirmPassword}</p>}
              </div>

              {formError && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {formError}
                </p>
              )}

              {/* Required by Clerk for the CAPTCHA widget used on some
                  instances — invisible unless the instance has bot
                  protection enabled, in which case Clerk renders into it. */}
              <div id="clerk-captcha" />

              <Button type="submit" disabled={isSubmitting} className="w-full justify-center">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center">
                Your account will be reviewed by CamCCUL before you can access the portal. You&apos;ll
                receive an email when your account is approved.
              </p>
            </form>
          )}
        </div>

        {step === "form" && (
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="font-medium text-primary-600 hover:text-primary-700">
                Sign In
              </Link>
            </p>
            <p className="text-sm">
              <Link href="/" className="font-medium text-gray-500 hover:text-gray-700">
                Back to Website
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
