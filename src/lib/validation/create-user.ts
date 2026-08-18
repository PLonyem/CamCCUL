import { z } from "zod";

export const createUserSchema = z
  .object({
    email: z.string().trim().email(),
    role: z.enum(["admin", "credit_union"]),
    affiliateId: z.string().optional(),
  })
  .refine((data) => data.role !== "credit_union" || !!data.affiliateId, {
    message: "An affiliate must be selected for a credit union account.",
    path: ["affiliateId"],
  });

export type CreateUserInput = z.infer<typeof createUserSchema>;
