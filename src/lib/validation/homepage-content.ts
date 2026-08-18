import { z } from "zod";

// Content tab only — the Appearance and Sections tabs aren't built yet, so
// their fields (overlayColor, showHero, etc.) are deliberately left out of
// this schema rather than accepted-but-ignored.
export const homepageContentSchema = z.object({
  heroBadge: z.string().trim().min(1, "Badge text is required"),
  heroTitle: z.string().trim().min(1, "Headline is required"),
  heroSubtitle: z.string().trim().min(1, "Subtitle is required"),
  primaryButtonText: z.string().trim().min(1, "Primary button text is required"),
  primaryButtonLink: z
    .string()
    .trim()
    .min(1, "Primary button link is required")
    .refine((v) => v.startsWith("/"), "Link must start with /"),
  secondaryButtonText: z.string().trim().min(1, "Secondary button text is required"),
  secondaryButtonLink: z
    .string()
    .trim()
    .min(1, "Secondary button link is required")
    .refine((v) => v.startsWith("/"), "Link must start with /"),
  heroImages: z.array(z.string().url()).max(5, "Up to 5 images"),
  statsAffiliates: z.number().int().min(0),
  statsMembers: z.string().trim().min(1, "Members figure is required"),
  statsAssets: z.string().trim(),
});

export type HomepageContentInput = z.infer<typeof homepageContentSchema>;
