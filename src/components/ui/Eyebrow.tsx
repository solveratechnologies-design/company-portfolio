import { cn } from "@/lib/utils";

export function Eyebrow({ children, tone = "light", className }: { children: React.ReactNode; tone?: "light" | "dark"; className?: string }) {
  return (
    <p
      className={cn(
        "inline-flex items-center gap-2.5 font-mono text-[0.72rem] font-medium uppercase tracking-[0.16em]",
        tone === "dark" ? "text-white/70" : "text-muted",
        className,
      )}
    >
      <span aria-hidden className="relative flex size-2">
        <span className="absolute inset-0 rounded-full bg-brand" />
        <span className="absolute -inset-1 rounded-full border border-brand/40" />
      </span>
      {children}
    </p>
  );
}
