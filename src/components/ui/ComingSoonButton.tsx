"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComingSoonButtonProps {
  className?: string;
  children: ReactNode;
}

export function ComingSoonButton({ className, children }: ComingSoonButtonProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => setShow(false), 2200);
    return () => clearTimeout(timer);
  }, [show]);

  return (
    <button
      type="button"
      onClick={() => setShow(true)}
      className={cn("relative", className)}
    >
      {children}
      {show && (
        <span
          role="status"
          className="absolute left-1/2 -translate-x-1/2 top-full mt-2 z-50 inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-gray-900 text-white text-xs font-medium px-3 py-2 shadow-lg"
        >
          <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0" />
          Coming Soon...
        </span>
      )}
    </button>
  );
}
