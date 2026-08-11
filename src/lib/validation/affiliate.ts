import { z } from "zod";
import { regions } from "@/lib/mock-data";

export const affiliateSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(1, "Name is required"),
  region: z
    .string()
    .refine((value) => regions.includes(value), "Invalid region"),
  city: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  email: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
});

export const updateAffiliateSchema = affiliateSchema.partial();
