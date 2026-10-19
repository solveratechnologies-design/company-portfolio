import { BarChart3, Bot, Check, Globe, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { InView } from "@/components/ui/InView";

const nodes = [
  { label: "Website", sub: "Inquiry form", icon: Globe, x: 14, y: 13, tone: "brand" },
  { label: "AI Assistant", sub: "Classifies intent", icon: Bot, x: 86, y: 16, tone: "mint" },
  { label: "CRM", sub: "Record updated", icon: Users, x: 84, y: 86, tone: "brand" },
  { label: "Insights", sub: "Weekly report", icon: BarChart3, x: 16, y: 88, tone: "mint" },
] as const;

// Curves from the centre (50,50) to each node, in a 100×100 viewBox.
const paths = [
  "M50 50 C 36 50, 26 28, 14 13",
  "M50 50 C 64 48, 74 28, 86 16",
  "M50 50 C 64 54, 72 74, 84 86",
  "M50 50 C 36 54, 28 74, 16 88",
];

/**
 * Original hero composition: a central "running workflow" card connected
 * to the systems it coordinates. Motion pauses when off-screen and is
 * disabled under prefers-reduced-motion.
 */
export function HeroVisual({ className }: { className?: string }) {
  return (
    <InView
      role="img"
      aria-label="Illustration: a website, an AI assistant, a CRM and an insights dashboard connected through one automated workflow"
      className={cn("relative aspect-[3/4] w-full max-w-[560px] sm:aspect-square", className)}
    >
      <div aria-hidden className="absolute inset-[8%] rounded-full bg-brand/20 blur-[80px]" />
      <div aria-hidden className="absolute left-1/2 top-1/2 aspect-square w-[56%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.06]" />
      <div aria-hidden className="absolute left-1/2 top-1/2 aspect-square w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-white/[0.07]" />

      <svg aria-hidden viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
        <defs>
          <linearGradient id="hv-line" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#8fb0f1" />
            <stop offset="1" stopColor="#38b98a" />
          </linearGradient>
        </defs>
        {paths.map((d) => (
          <g key={d}>
            <path d={d} fill="none" stroke="rgb(255 255 255 / 0.10)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <path d={d} className="flow-line" fill="none" stroke="url(#hv-line)" strokeWidth="1.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </g>
        ))}
      </svg>

      {nodes.map(({ label, sub, icon: Icon, x, y, tone }, i) => (
        <div
          key={label}
          aria-hidden
          className="enter absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: `clamp(56px, ${x}%, calc(100% - 56px))`, top: `${y}%`, ["--i" as string]: i + 4 }}
        >
          <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-ink-2/90 py-2 pl-2 pr-3.5 shadow-[0_18px_40px_-18px_rgb(0_0_0/0.8)] backdrop-blur">
            <span
              className={cn(
                "node-pulse flex size-8 items-center justify-center rounded-lg",
                tone === "brand" ? "bg-brand/20 text-brand-300" : "bg-mint/15 text-mint-300",
              )}
              style={{ ["--i" as string]: i }}
            >
              <Icon className="size-4" />
            </span>
            <span className="flex flex-col">
              <span className="whitespace-nowrap text-[0.8rem] font-semibold text-white">{label}</span>
              <span className="hidden whitespace-nowrap text-[0.68rem] text-white/55 sm:block">{sub}</span>
            </span>
          </div>
        </div>
      ))}

      <div aria-hidden className="enter absolute left-1/2 top-1/2 w-[64%] -translate-x-1/2 -translate-y-1/2 sm:w-[52%] sm:min-w-[210px]" style={{ ["--i" as string]: 3 }}>
        <div className="rounded-2xl border border-white/12 bg-gradient-to-b from-ink-3 to-ink-2 p-4 shadow-[0_30px_80px_-30px_rgb(45_106_227/0.6)]">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-white/60">Workflow</span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/15 px-2 py-0.5 text-[0.65rem] font-medium text-mint-300">
              <span className="size-1.5 rounded-full bg-mint" /> Running
            </span>
          </div>
          <p className="mt-2 text-[0.92rem] font-semibold text-white">New project inquiry</p>
          <ol className="mt-3 flex flex-col gap-2">
            {["Inquiry received", "Intent classified", "CRM record created", "Follow-up scheduled"].map((step, i) => (
              <li key={step} className="flex items-center gap-2.5 text-[0.75rem] text-white/75">
                <span
                  className={cn(
                    "flex size-4 items-center justify-center rounded-full",
                    i < 3 ? "bg-mint text-ink" : "border border-white/25 text-transparent",
                  )}
                >
                  <Check className="size-2.5" strokeWidth={3} />
                </span>
                {step}
              </li>
            ))}
          </ol>
          <div className="mt-3.5 h-1 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-brand to-mint" />
          </div>
        </div>
      </div>
    </InView>
  );
}
