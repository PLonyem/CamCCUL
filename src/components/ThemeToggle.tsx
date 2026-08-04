"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "theme";

function applyTheme(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
}

interface ThemeToggleProps {
  className?: string;
  "aria-label"?: string;
}

export function ThemeToggle({ className, "aria-label": ariaLabel }: ThemeToggleProps) {
  const [isDark, setIsDark] = useState(false);

  // Deliberately an effect, not a lazy useState initializer: the server
  // can't read localStorage/matchMedia, so the first client render must
  // also start from `false` to match the server-rendered HTML, or React
  // hits a hydration mismatch. Swapping after mount is the correct fix
  // here, even though it trips the generic set-state-in-effect lint rule.
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialIsDark = stored ? stored === "dark" : prefersDark;
    setIsDark(initialIsDark);
    applyTheme(initialIsDark);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={ariaLabel ?? "Toggle dark mode"}
      className={cn(
        "inline-flex items-center justify-center min-h-11 min-w-11 p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
        className
      )}
    >
      {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}
