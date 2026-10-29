import { cn } from "@/lib/utils";

type Tone = "neutral" | "brand" | "mint" | "dark" | "warning";

const tones: Record<Tone, string> = {
  neutral: "border-line bg-white text-ink/80",
  brand: "border-brand/20 bg-brand-50 text-brand-ink",
  mint: "border-mint/30 bg-mint-50 text-[#1f7a58]",
  dark: "border-white/15 bg-white/5 text-white/80",
  warning: "border-amber-300/60 bg-amber-50 text-amber-800",
};

export function Badge({ children, tone = "neutral", className }: { children: React.ReactNode; tone?: Tone; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium leading-none", tones[tone], className)}>
      {children}
    </span>
  );
}
