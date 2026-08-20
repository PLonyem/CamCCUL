import { z } from "zod";

// Matches Affiliate.chapter's documented valid values (prisma/schema.prisma)
// — kept as a plain literal list here rather than derived from
// regions/regionLabels in mock-data.ts, since a signup applicant is naming
// their own chapter before any admin has matched them to a specific
// Affiliate record; the two lists happen to agree today but aren't the same
// concept.
export const SIGNUP_CHAPTERS = [
  "Northwest Chapter",
  "Southwest Chapter",
  "Littoral Chapter",
  "Centre Chapter",
  "West Chapter",
  "Adamawa Chapter",
  "North Chapter",
  "Far North Chapter",
  "East Chapter",
  "South Chapter",
] as const;

// Full client-side form validation, including the password fields that
// never leave the browser except via Clerk's own signUp.create() call —
// they're never sent to our API.
export const creditUnionSignupFormSchema = z
  .object({
    creditUnionName: z.string().trim().min(3, "Credit union name must be at least 3 characters."),
    chapter: z.enum(SIGNUP_CHAPTERS, { errorMap: () => ({ message: "Select a chapter." }) }),
    email: z.string().trim().email("Enter a valid email address."),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters.")
      .regex(/\d/, "Password must contain at least one number."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type CreditUnionSignupFormInput = z.infer<typeof creditUnionSignupFormSchema>;

// What actually reaches the API, once the Clerk account already exists —
// email is read from the authenticated session server-side, never trusted
// from the client, and no password field exists here at all.
export const creditUnionSignupRequestSchema = z.object({
  creditUnionName: z.string().trim().min(3, "Credit union name must be at least 3 characters."),
  chapter: z.enum(SIGNUP_CHAPTERS),
});

export type CreditUnionSignupRequestInput = z.infer<typeof creditUnionSignupRequestSchema>;
