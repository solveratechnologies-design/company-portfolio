"use client";

import { ArrowUp } from "lucide-react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const { y, progress } = useScrollProgress();
  const visible = y > 900;
  return (
    <button
      type="button"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        document.getElementById("main")?.focus({ preventScroll: true });
      }}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
      className={cn(
        "fixed bottom-5 right-5 z-40 flex size-12 items-center justify-center rounded-full border border-line bg-white text-ink shadow-lg transition-[opacity,transform] duration-300 hover:border-brand/40 hover:text-brand",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <svg aria-hidden viewBox="0 0 48 48" className="absolute inset-0 size-12 -rotate-90">
        <circle cx="24" cy="24" r="22.5" fill="none" stroke="#F27222" strokeWidth="1.5" pathLength={1} strokeDasharray="1" strokeDashoffset={1 - progress} />
      </svg>
      <ArrowUp className="size-4" />
    </button>
  );
}
