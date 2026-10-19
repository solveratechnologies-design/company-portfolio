import { cn } from "@/lib/utils";

/** Solvera mark: two connected nodes forming an abstract "S" path. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn("size-8", className)}>
      <rect width="32" height="32" rx="9" fill="#2D6AE3" />
      <path
        d="M22.5 9.5h-8a4 4 0 0 0 0 8h3a4 4 0 0 1 0 8h-8"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <circle cx="22.5" cy="9.5" r="2.4" fill="#38B98A" stroke="#fff" strokeWidth="1.4" />
      <circle cx="9.5" cy="25.5" r="2.4" fill="#fff" />
    </svg>
  );
}

export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      <span className={cn("flex flex-col leading-none", tone === "light" ? "text-white" : "text-ink")}>
        <span className="text-[1.08rem] font-semibold tracking-[-0.02em]">Solvera</span>{" "}
        <span className={cn("mt-0.5 font-mono text-[0.6rem] uppercase tracking-[0.2em]", tone === "light" ? "text-white/55" : "text-muted")}>
          Technologies
        </span>
      </span>
    </span>
  );
}
