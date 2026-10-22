import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { CSSProperties } from "react";
import type { Service } from "@/types/service";
import { cn } from "@/lib/utils";

/**
 * Whole-card link (single anchor — no nested interactive elements).
 */
export function ServiceCard({ service, index = 0, variant = "default" }: { service: Service; index?: number; variant?: "default" | "large" }) {
  const Icon = service.icon;
  return (
    <Link
      href={service.href}
      data-reveal
      style={{ "--i": index } as CSSProperties}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white p-7 transition-[translate,transform,border-color,box-shadow] duration-300 ease-out hover:-translate-y-1 hover:border-brand/30 hover:shadow-[0_24px_48px_-28px_rgb(16_24_32/0.35)] md:p-8",
        variant === "large" && "md:p-10",
      )}
    >
      <div aria-hidden className={cn("absolute -right-16 -top-16 size-48 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100", service.accent === "mint" ? "bg-mint/20" : "bg-brand/15")} />
      <div className="relative flex items-start justify-between">
        <span className={cn("flex size-12 items-center justify-center rounded-xl transition-colors duration-300", service.accent === "mint" ? "bg-mint-50 text-[#1f7a58] group-hover:bg-mint group-hover:text-white" : "bg-brand-50 text-brand group-hover:bg-brand group-hover:text-ink")}>
          <Icon aria-hidden className="size-5" />
        </span>
        <span className="font-mono text-xs text-muted">0{index + 1}</span>
      </div>
      <h3 className="relative mt-8 text-card font-semibold">{service.title}</h3>
      <p className="relative mt-3 leading-relaxed text-muted">{service.summary}</p>
      <ul className="relative mt-6 flex flex-wrap gap-1.5">
        {service.offerings.slice(0, 4).map((o) => (
          <li key={o.title} className="rounded-full border border-line px-2.5 py-1 text-xs text-ink/70">
            {o.title}
          </li>
        ))}
      </ul>
      <span className="relative mt-auto inline-flex items-center gap-1.5 pt-8 text-sm font-medium text-brand">
        Learn More<span className="sr-only"> about {service.title}</span>
        <ArrowRight aria-hidden className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
