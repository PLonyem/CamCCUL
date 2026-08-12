import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCategory(category: string): string {
  return category.replace(/([a-z])([A-Z])/g, "$1 $2");
}

// Detects seed/mock content that hasn't been replaced with real CamCCUL
// copy yet — bracket-wrapped filler (e.g. "[City Name]") or text that
// describes itself as a placeholder — so callers can hide it instead of
// ever showing it to site visitors.
export function isPlaceholder(value: string | null | undefined): boolean {
  if (!value) return true;
  const trimmed = value.trim();
  if (!trimmed) return true;
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) return true;
  if (trimmed.toLowerCase().includes("placeholder")) return true;
  return false;
}
