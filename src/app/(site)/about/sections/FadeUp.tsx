"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface FadeUpProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger index within a group — multiplied by 60ms. */
  index?: number;
}

// Page-local to About (not the shared AnimatedSection, which other pages
// already use with different timing) — fades up 16px over 400ms, once,
// respecting prefers-reduced-motion via the .fade-up rules in globals.css.
export function FadeUp({ children, className, index = 0 }: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("fade-up", isVisible && "is-visible", className)}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {children}
    </div>
  );
}
