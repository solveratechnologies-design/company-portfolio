import { AlertTriangle, CalendarCheck, FileInput, GitBranch, Mail, RefreshCw, UserCheck, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

function Node({
  icon: Icon,
  label,
  title,
  detail,
  tone = "neutral",
  index,
}: {
  icon: LucideIcon;
  label: string;
  title: string;
  detail: string;
  tone?: "neutral" | "trigger" | "condition" | "success" | "alt" | "error";
  index: number;
}) {
  const tones = {
    neutral: "border-line bg-white",
    trigger: "border-brand/30 bg-brand-50",
    condition: "border-amber-300/70 bg-amber-50",
    success: "border-mint/40 bg-mint-50",
    alt: "border-line bg-white",
    error: "border-dashed border-red-300 bg-red-50/60",
  } as const;
  const iconTones = {
    neutral: "bg-paper text-ink",
    trigger: "bg-brand text-white",
    condition: "bg-amber-400 text-ink",
    success: "bg-mint text-white",
    alt: "bg-paper text-ink",
    error: "bg-red-100 text-red-700",
  } as const;
  return (
    <div data-reveal style={{ "--i": index } as CSSProperties} className={cn("relative z-10 flex w-full items-start gap-3 rounded-2xl border p-4 shadow-[0_10px_30px_-20px_rgb(16_24_32/0.4)]", tones[tone])}>
      <span className={cn("flex size-9 shrink-0 items-center justify-center rounded-xl", iconTones[tone])}>
        <Icon aria-hidden className="size-4" />
      </span>
      <div>
        <p className="font-mono text-[0.66rem] uppercase tracking-[0.14em] text-muted">{label}</p>
        <p className="mt-0.5 font-semibold text-ink">{title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted">{detail}</p>
      </div>
    </div>
  );
}

function Connector({ className }: { className?: string }) {
  return <span aria-hidden className={cn("mx-auto block h-6 w-px bg-ink/20", className)} />;
}

/**
 * Example automation: trigger → processing → condition → branch actions,
 * with error handling. Laid out as a readable vertical tree that collapses
 * to a single column on small screens.
 */
export function BranchingWorkflow() {
  return (
    <figure className="mx-auto max-w-3xl">
      <div className="mx-auto flex max-w-md flex-col">
        <Node index={0} icon={Zap} tone="trigger" label="Trigger" title="Appointment booked" detail="A new booking is created in the scheduling tool." />
        <Connector />
        <Node index={1} icon={FileInput} label="Process" title="Create or update contact" detail="Match the client in the CRM; create a record if new." />
        <Connector />
        <Node index={2} icon={Mail} label="Process" title="Send confirmation & intake form" detail="Email and SMS with a secure intake form link." />
        <Connector />
        <Node index={3} icon={GitBranch} tone="condition" label="Condition · 24h before visit" title="Intake form completed?" detail="Check the form status before the appointment." />
      </div>

      <div className="relative mx-auto mt-0 max-w-3xl">
        <div aria-hidden className="mx-auto hidden h-6 w-1/2 border-x border-t border-ink/20 sm:block" style={{ borderTopLeftRadius: 12, borderTopRightRadius: 12 }} />
        <Connector className="sm:hidden" />
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          <div className="flex flex-col">
            <p className="mb-2 text-center text-sm font-semibold text-[#1f7a58]">Yes</p>
            <Node index={4} icon={CalendarCheck} tone="success" label="Action" title="Mark ready & send reminder" detail="Appointment flagged as ready; standard reminder sent." />
          </div>
          <div className="flex flex-col">
            <p className="mb-2 text-center text-sm font-semibold text-amber-700">No</p>
            <Node index={5} icon={UserCheck} tone="alt" label="Action" title="Nudge client & alert front desk" detail="A reminder with the form link, plus a task for staff to follow up." />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-6 max-w-md">
        <Node index={6} icon={AlertTriangle} tone="error" label="Error handling" title="If any step fails" detail="Retry safe steps automatically, log the error, and notify a named owner." />
        <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted">
          <RefreshCw aria-hidden className="size-4" /> Every run is logged for visibility.
        </p>
      </div>
      <figcaption className="sr-only">
        Example appointment workflow: a booking triggers a CRM update and confirmation message; 24 hours before the visit the
        workflow checks whether the intake form is complete and either sends a standard reminder or alerts staff. Failures are retried, logged and reported.
      </figcaption>
    </figure>
  );
}
