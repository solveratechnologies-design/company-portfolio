import Image from "next/image";
import type { ProjectVisualSpec, VisualKind } from "@/types/project";
import { cn } from "@/lib/utils";

/**
 * Original, code-drawn interface mockups used for concept projects.
 * When a project supplies a real screenshot (`image`), it is rendered with next/image instead.
 */
export function ProjectVisual({
  spec,
  className,
  priority,
  sizes = "(min-width: 1024px) 50vw, 100vw",
}: {
  spec: ProjectVisualSpec;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  if (spec.image) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image
          src={spec.image.src}
          width={spec.image.width}
          height={spec.image.height}
          alt={spec.image.alt}
          sizes={sizes}
          priority={priority}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }
  return <UIMockup kind={spec.kind} label={spec.caption} className={className} />;
}

const backdrops: Record<VisualKind, string> = {
  dashboard: "from-[#fff1e6] to-[#fff8f4]",
  chat: "from-[#fff1e6] to-[#f7f3ef]",
  storefront: "from-[#fff4ec] to-[#fffaf7]",
  workflow: "from-[#fff1e6] to-[#fff6f0]",
  analytics: "from-[#fff1e6] to-[#fff8f4]",
  pipeline: "from-[#fff4ec] to-[#fff6f0]",
  document: "from-[#fff4ec] to-[#fffaf7]",
  portal: "from-[#fff1e6] to-[#fff6f0]",
};

const SAMPLE_KINDS: VisualKind[] = ["dashboard", "analytics", "pipeline", "portal"];

export function UIMockup({ kind, label, className }: { kind: VisualKind; label: string; className?: string }) {
  return (
    <div
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      className={cn("relative flex items-center justify-center overflow-hidden bg-gradient-to-br p-[6%]", backdrops[kind], className)}
    >
      <div aria-hidden className="bg-grid-light mask-radial absolute inset-0" />
      <Frame sample={SAMPLE_KINDS.includes(kind)}>
        {kind === "dashboard" && <Dashboard />}
        {kind === "chat" && <Chat />}
        {kind === "storefront" && <Storefront />}
        {kind === "workflow" && <WorkflowMini />}
        {kind === "analytics" && <Analytics />}
        {kind === "pipeline" && <Pipeline />}
        {kind === "document" && <DocumentReview />}
        {kind === "portal" && <Portal />}
      </Frame>
    </div>
  );
}

function Frame({ children, sample }: { children: React.ReactNode; sample?: boolean }) {
  return (
    <div aria-hidden className="relative w-full overflow-hidden rounded-[10px] border border-ink/10 bg-white shadow-[0_24px_50px_-24px_rgb(16_24_32/0.35)]">
      <div className="flex items-center gap-1.5 border-b border-ink/[0.07] bg-[#fbfbfc] px-3 py-2">
        <span className="size-2 rounded-full bg-[#e5e7eb]" />
        <span className="size-2 rounded-full bg-[#e5e7eb]" />
        <span className="size-2 rounded-full bg-[#e5e7eb]" />
        <span className="ml-2 h-3.5 flex-1 rounded bg-ink/[0.04]" />
        {sample && <span className="rounded bg-amber-50 px-1.5 py-0.5 font-mono text-[7px] font-semibold uppercase tracking-wider text-amber-700">Sample data</span>}
      </div>
      <div className="text-[9px] leading-tight text-ink">{children}</div>
    </div>
  );
}

const bar = (w: string, tone = "bg-ink/10") => <span className={cn("block h-1.5 rounded-full", tone)} style={{ width: w }} />;

function Dashboard() {
  const stats = [
    ["Appointments", "18"],
    ["Forms complete", "14"],
    ["Reminders sent", "32"],
  ];
  return (
    <div className="flex">
      <div className="hidden w-[22%] flex-col gap-2 border-r border-ink/[0.06] p-3 sm:flex">
        <span className="mb-1 h-3 w-8 rounded bg-brand" />
        {[70, 55, 62, 48, 58].map((w, i) => (
          <span key={i} className={cn("block h-1.5 rounded-full", i === 0 ? "bg-brand/40" : "bg-ink/10")} style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="flex-1 p-3">
        <div className="mb-2.5 flex items-center justify-between">
          <span className="text-[10px] font-semibold">Today</span>
          <span className="rounded-full bg-mint-50 px-2 py-0.5 text-[8px] font-medium text-[#1f7a58]">Synced</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {stats.map(([k, v]) => (
            <div key={k} className="rounded-md border border-ink/[0.07] p-2">
              <div className="text-[7.5px] text-muted">{k}</div>
              <div className="mt-0.5 text-[13px] font-semibold tracking-tight">{v}</div>
            </div>
          ))}
        </div>
        <div className="mt-2.5 flex flex-col gap-1.5">
          {[
            ["09:00", "Confirmed", "bg-mint"],
            ["10:30", "Form pending", "bg-amber-400"],
            ["11:15", "Confirmed", "bg-mint"],
            ["13:00", "Rescheduled", "bg-brand"],
          ].map(([t, s, c]) => (
            <div key={t} className="flex items-center gap-2 rounded-md bg-paper px-2 py-1.5">
              <span className="w-7 font-mono text-[8px] text-muted">{t}</span>
              {bar("38%")}
              <span className="ml-auto flex items-center gap-1 text-[7.5px] text-muted">
                <span className={cn("size-1.5 rounded-full", c)} />
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Chat() {
  return (
    <div className="flex flex-col gap-2 p-3">
      <div className="flex items-center gap-2 border-b border-ink/[0.06] pb-2">
        <span className="flex size-5 items-center justify-center rounded-full bg-[#1f7a58] text-[8px] font-bold text-white">AI</span>
        <span className="text-[9.5px] font-semibold">Help assistant</span>
        <span className="ml-auto text-[7.5px] text-muted">Answers from help centre</span>
      </div>
      <div className="ml-auto max-w-[70%] rounded-lg rounded-br-sm bg-brand px-2.5 py-1.5 text-[8.5px] text-white">Can I change my delivery address after ordering?</div>
      <div className="max-w-[80%] rounded-lg rounded-bl-sm bg-paper px-2.5 py-2 text-[8.5px]">
        Yes — you can update it from your order page until the order is packed.
        <div className="mt-1.5 flex gap-1">
          <span className="rounded border border-brand/20 bg-white px-1.5 py-0.5 text-[7px] text-brand-ink">Source: Shipping FAQ</span>
          <span className="rounded border border-brand/20 bg-white px-1.5 py-0.5 text-[7px] text-brand-ink">Order changes</span>
        </div>
      </div>
      <div className="ml-auto max-w-[70%] rounded-lg rounded-br-sm bg-brand px-2.5 py-1.5 text-[8.5px] text-white">I need a refund for a damaged item.</div>
      <div className="max-w-[80%] rounded-lg rounded-bl-sm border border-amber-300/60 bg-amber-50 px-2.5 py-2 text-[8.5px] text-amber-900">
        I&apos;ll connect you with a team member who can help with refunds.
        <div className="mt-1.5 inline-flex rounded bg-ink px-1.5 py-0.5 text-[7px] text-white">Handed over to a person</div>
      </div>
      <div className="mt-1 flex items-center gap-2 rounded-md border border-ink/10 px-2 py-1.5">
        {bar("40%")}
        <span className="ml-auto size-3.5 rounded bg-brand" />
      </div>
    </div>
  );
}

function Storefront() {
  const tones = ["#ffe4d2", "#fff1e6", "#f6ebe3", "#ffd7be", "#f0ece6", "#ffe8da"];
  return (
    <div className="p-3">
      <div className="mb-2.5 flex items-center gap-2">
        <span className="text-[10px] font-semibold">Collection</span>
        <div className="ml-auto flex gap-1">
          {["Size", "Colour", "Price", "In stock"].map((f, i) => (
            <span key={f} className={cn("rounded-full border px-1.5 py-0.5 text-[7px]", i === 3 ? "border-brand bg-brand text-white" : "border-ink/10 text-muted")}>
              {f}
            </span>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {tones.map((t, i) => (
          <div key={i} className="overflow-hidden rounded-md border border-ink/[0.06]">
            <div className="relative aspect-[4/3]" style={{ background: t }}>
              <span className="absolute left-1/2 top-1/2 size-[42%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/70" />
            </div>
            <div className="flex flex-col gap-1 p-1.5">
              {bar("70%")}
              <div className="flex items-center justify-between">
                {bar("30%", "bg-ink/25")}
                <span className="rounded bg-ink px-1 py-0.5 text-[6.5px] text-white">Add</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkflowMini() {
  const steps = [
    ["Booking received", "Trigger", "bg-brand"],
    ["Send confirmation", "Email + SMS", "bg-mint"],
    ["Intake form link", "Secure form", "bg-mint"],
    ["Form complete?", "Condition", "bg-amber-400"],
    ["Update schedule", "Scheduler API", "bg-brand"],
  ];
  return (
    <div className="flex flex-col items-stretch gap-0 p-3">
      {steps.map(([t, s, c], i) => (
        <div key={t} className="flex flex-col items-center">
          <div className="flex w-[78%] items-center gap-2 rounded-md border border-ink/[0.08] bg-white px-2 py-1.5 shadow-sm">
            <span className={cn("size-2 rounded-full", c)} />
            <span className="text-[8.5px] font-medium">{t}</span>
            <span className="ml-auto font-mono text-[7px] text-muted">{s}</span>
          </div>
          {i < steps.length - 1 && <span className="h-2.5 w-px bg-ink/20" />}
        </div>
      ))}
    </div>
  );
}

function Analytics() {
  const bars = [42, 58, 50, 66, 61, 74, 70, 82];
  return (
    <div className="p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-semibold">Enquiries by channel</span>
        <span className="font-mono text-[7px] text-muted">Illustrative</span>
      </div>
      <div className="mb-2 grid grid-cols-3 gap-2">
        {[
          ["Organic", "bg-brand"],
          ["Paid search", "bg-mint"],
          ["Local", "bg-ink/40"],
        ].map(([k, c]) => (
          <div key={k} className="flex items-center gap-1.5 rounded-md bg-paper px-2 py-1">
            <span className={cn("size-1.5 rounded-full", c)} />
            <span className="text-[7.5px] text-muted">{k}</span>
          </div>
        ))}
      </div>
      <div className="flex h-24 items-end gap-1.5 border-b border-l border-ink/10 px-1.5 pt-2">
        {bars.map((h, i) => (
          <div key={i} className="flex flex-1 flex-col justify-end gap-px">
            <span className="block rounded-t-sm bg-mint/80" style={{ height: `${h * 0.35}px` }} />
            <span className="block bg-brand" style={{ height: `${h * 0.55}px` }} />
          </div>
        ))}
      </div>
    </div>
  );
}

function Pipeline() {
  const cols: [string, number, string][] = [
    ["New", 3, "bg-ink/30"],
    ["Qualifying", 2, "bg-amber-400"],
    ["Qualified", 2, "bg-mint"],
  ];
  return (
    <div className="grid grid-cols-3 gap-2 p-3">
      {cols.map(([name, n, c]) => (
        <div key={name} className="rounded-md bg-paper p-1.5">
          <div className="mb-1.5 flex items-center gap-1">
            <span className={cn("size-1.5 rounded-full", c)} />
            <span className="text-[8px] font-semibold">{name}</span>
            <span className="ml-auto text-[7px] text-muted">{n}</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {Array.from({ length: n }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1 rounded border border-ink/[0.07] bg-white p-1.5">
                {bar("75%", "bg-ink/20")}
                {bar("50%")}
                {name === "Qualified" && <span className="w-fit rounded bg-mint-50 px-1 py-0.5 text-[6.5px] text-[#1f7a58]">AI summary ready</span>}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DocumentReview() {
  return (
    <div className="grid grid-cols-2 gap-2 p-3">
      <div className="flex flex-col gap-1.5 rounded-md border border-ink/[0.08] p-2">
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold">INVOICE</span>
          {bar("28%", "bg-ink/20")}
        </div>
        {bar("55%")}
        {bar("40%")}
        <div className="mt-1 flex flex-col gap-1 border-t border-ink/[0.06] pt-1.5">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between">
              {bar("50%")}
              {bar("18%", "bg-ink/20")}
            </div>
          ))}
        </div>
        <div className="mt-1 flex justify-end">{bar("30%", "bg-brand/50")}</div>
      </div>
      <div className="flex flex-col gap-1.5">
        <span className="text-[9px] font-semibold">Extracted fields</span>
        {[
          ["Supplier", "bg-mint"],
          ["Invoice no.", "bg-mint"],
          ["Date", "bg-mint"],
          ["Tax", "bg-amber-400"],
          ["Total", "bg-mint"],
        ].map(([k, c]) => (
          <div key={k} className="flex items-center gap-1.5 rounded border border-ink/[0.07] px-1.5 py-1">
            <span className="w-12 text-[7.5px] text-muted">{k}</span>
            {bar("45%", "bg-ink/15")}
            <span className={cn("ml-auto size-1.5 rounded-full", c)} />
          </div>
        ))}
        <span className="mt-auto w-fit rounded bg-ink px-1.5 py-1 text-[7px] text-white">Review & approve</span>
      </div>
    </div>
  );
}

function Portal() {
  const cols: [string, string, number][] = [
    ["Scheduled", "bg-brand", 2],
    ["On site", "bg-amber-400", 2],
    ["Completed", "bg-mint", 3],
  ];
  return (
    <div className="p-3">
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[10px] font-semibold">Jobs this week</span>
        <span className="ml-auto flex -space-x-1">
          {["#F27222", "#F8C4A0", "#101820"].map((c) => (
            <span key={c} className="size-3.5 rounded-full border border-white" style={{ background: c }} />
          ))}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {cols.map(([name, c, n]) => (
          <div key={name} className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1 text-[8px] font-medium">
              <span className={cn("h-1.5 w-3 rounded-full", c)} />
              {name}
            </div>
            {Array.from({ length: n }).map((_, i) => (
              <div key={i} className="rounded border border-ink/[0.07] bg-white p-1.5 shadow-sm">
                <div className="mb-1 flex justify-between">
                  {bar("50%", "bg-ink/25")}
                  <span className="font-mono text-[6.5px] text-muted">#{140 + i * 7}</span>
                </div>
                {bar("70%")}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
