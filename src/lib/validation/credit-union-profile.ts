import { z } from "zod";

// Seven fixed service options plus a free-text "Other" field folded into
// the stored array as "Other: <text>" (see the dashboard profile route).
export const SERVICE_OPTIONS = [
  "Savings Accounts",
  "Loans (Personal)",
  "Loans (Business)",
  "Loans (Agricultural)",
  "Money Transfers",
  "Mobile Banking",
  "Financial Education",
] as const;

const currentYear = new Date().getFullYear();

// A loose "reasonable phone number" check — digits, spaces, parentheses,
// and a leading + are all fine; this is a self-reported contact field, not
// something that needs to satisfy a specific national numbering plan.
const PHONE_REGEX = /^[+()\d][\d\s()-]{6,19}$/;

function countWords(text: string): number {
  const trimmed = text.trim();
  return trimmed === "" ? 0 : trimmed.split(/\s+/).length;
}

// Number fields are registered with { valueAsNumber: true }, so an empty
// input reaches zod as NaN (not undefined/""), which is why every numeric
// field below sets both required_error and invalid_type_error rather than
// relying on zod's default "Expected number, received nan" message.
export const creditUnionProfileSchema = z
  .object({
    // Editable by design — a chapter can correct its own name, or a typo
    // in its code/chapter label, the same way it edits every other field
    // here. code uniqueness is enforced server-side (Affiliate.code is a
    // unique column), not by this schema.
    creditUnionName: z.string().trim().min(1, "Credit union name is required"),
    code: z.string().trim().min(1, "Code is required"),
    chapter: z.string().trim().min(1, "Chapter is required"),
    yearFounded: z
      .number({
        required_error: "Year founded is required",
        invalid_type_error: "Year founded is required",
      })
      .int("Enter a whole year")
      .min(1900, "Enter a year no earlier than 1900")
      .max(currentYear, `Enter a year no later than ${currentYear}`),
    city: z.string().trim().min(1, "City is required"),
    address: z.string().trim().min(1, "Address is required"),
    phone: z
      .string()
      .trim()
      .min(1, "Phone is required")
      .regex(PHONE_REGEX, "Enter a valid phone number"),
    email: z.string().trim().min(1, "Email is required").email("Enter a valid email address"),
    website: z.string().trim().optional(),
    briefHistory: z
      .string()
      .trim()
      .min(1, "Brief history is required")
      .refine((value) => countWords(value) <= 500, "Brief history must be 500 words or fewer"),
    totalMembers: z
      .number({
        required_error: "Number of members is required",
        invalid_type_error: "Number of members is required",
      })
      .int("Enter a whole number")
      .min(0, "Number of members cannot be negative"),
    branchCount: z
      .number({
        required_error: "Number of branches is required",
        invalid_type_error: "Number of branches is required",
      })
      .int("Enter a whole number")
      .min(1, "A credit union has at least one branch"),
    servicesOffered: z.array(z.string()),
    servicesOfferedOther: z.string().trim().optional(),
    boardChairperson: z.string().trim().min(1, "Board chairperson is required"),
    generalManager: z.string().trim().min(1, "General manager is required"),
    boardMemberCount: z
      .number({
        required_error: "Number of board members is required",
        invalid_type_error: "Number of board members is required",
      })
      .int("Enter a whole number")
      .min(1, "Enter at least one board member"),
    staffCount: z
      .number({
        required_error: "Number of staff is required",
        invalid_type_error: "Number of staff is required",
      })
      .int("Enter a whole number")
      .min(1, "Enter at least one staff member"),
  })
  .refine(
    (data) => data.servicesOffered.length > 0 || (data.servicesOfferedOther?.trim().length ?? 0) > 0,
    { message: "Select at least one service", path: ["servicesOffered"] }
  );

export type CreditUnionProfileValues = z.infer<typeof creditUnionProfileSchema>;

export function wordCount(text: string): number {
  return countWords(text);
}
