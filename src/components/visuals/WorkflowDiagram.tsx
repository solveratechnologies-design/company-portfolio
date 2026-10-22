import type { LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";
import { InView } from "@/components/ui/InView";

export interface WorkflowStep {
  title: string;
  description: string;
  icon: LucideIcon;
  kind?: "trigger" | "ai" | "action" | "human";
}

const kindLabel: Record<NonNullable<WorkflowStep["kind"]>, string> = {
  trigger: "Trigger",
  ai: "AI-assisted",
  action: "Automated action",
  human: "Human review",
};

/**
 * Linear workflow: horizontal on large screens, vertical on small screens.
 * Connections draw in when visible; nodes pulse in sequence while on screen.
 */
export function WorkflowDiagram({
  steps,
  tone = "dark",
  label,
  className,
}: {
  steps: WorkflowStep[];
  tone?: "dark" | "light";
  label: string;
  className?: string;
}) {
  const dark = tone === "dark";
  return (
    <InView className={cn("relative", className)}>
      <ol
        aria-label={label}
        className="relative grid gap-3 lg:[grid-template-columns:repeat(var(--n),minmax(0,1fr))]"
        style={{ "--n": steps.length } as CSSProperties}
      >
        {steps.map((step, i) => {
          const Icon = step.icon;
          const last = i === steps.length - 1;
          return (
            <li key={step.title} className="relative flex lg:flex-col" data-reveal style={{ "--i": i } as CSSProperties}>
              {/* connector */}
              {!last && (
                <>
                  <svg aria-hidden className="absolute left-[1.45rem] top-12 h-[calc(100%-1.5rem)] w-px overflow-visible lg:hidden" preserveAspectRatio="none" viewBox="0 0 1 100">
                    <line x1="0.5" y1="0" x2="0.5" y2="100" pathLength={1} className="draw-line" stroke={dark ? "#f8c4a0" : "#f27222"} strokeOpacity="0.5" strokeWidth="1" style={{ "--i": i } as CSSProperties} />
                  </svg>
                  <svg aria-hidden className="absolute left-[3.25rem] top-[1.45rem] hidden h-px w-[calc(100%-2.5rem)] overflow-visible lg:block" preserveAspectRatio="none" viewBox="0 0 100 1">
                    <line x1="0" y1="0.5" x2="100" y2="0.5" pathLength={1} className="draw-line" stroke={dark ? "#f8c4a0" : "#f27222"} strokeOpacity="0.55" strokeWidth="1" style={{ "--i": i } as CSSProperties} />
                  </svg>
                </>
              )}
              <span
                className={cn(
                  "node-pulse relative z-10 flex size-12 shrink-0 items-center justify-center rounded-2xl border",
                  dark ? "border-white/12 bg-ink-2 text-brand-300" : "border-line bg-white text-brand shadow-sm",
                )}
                style={{ "--i": i } as CSSProperties}
              >
                <Icon aria-hidden className="size-5" />
              </span>
              <div className="ml-4 pb-6 lg:ml-0 lg:mt-5 lg:pb-0 lg:pr-4">
                <p className={cn("font-mono text-[0.68rem] uppercase tracking-[0.14em]", dark ? "text-white/60" : "text-muted")}>
                  {String(i + 1).padStart(2, "0")}
                  {step.kind && <span className="ml-2 normal-case tracking-normal">· {kindLabel[step.kind]}</span>}
                </p>
                <h3 className={cn("mt-1.5 text-[1.02rem] font-semibold", dark ? "text-white" : "text-ink")}>{step.title}</h3>
                <p className={cn("mt-1.5 text-sm leading-relaxed", dark ? "text-white/60" : "text-muted")}>{step.description}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </InView>
  );
}
