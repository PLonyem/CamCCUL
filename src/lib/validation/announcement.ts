import { z } from "zod";

export const announcementSchema = z.object({
  title: z.string().trim().min(5, "Title must be at least 5 characters"),
  content: z.string().trim().min(10, "Content must be at least 10 characters"),
  category: z.string().min(1).default("Circular"),
  priority: z.string().min(1).default("normal"),
  targetChapter: z.string().trim().nullable().optional(),
  isPublished: z.boolean().default(false),
  expiryDate: z.string().nullable().optional(),
});

export const updateAnnouncementSchema = announcementSchema.partial();
