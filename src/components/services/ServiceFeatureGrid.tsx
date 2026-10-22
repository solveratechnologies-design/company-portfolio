import type { CSSProperties } from "react";
import type { ServiceItem } from "@/types/service";
import { cn } from "@/lib/utils";

export function ServiceFeatureGrid({
  items,
  columns = 3,
  tone = "light",
  numbered = false,
}: {
  items: ServiceItem[];
  columns?: 2 | 3 | 4;
  tone?: "light" | "dark" | "paper";
  numbered?: boolean;
}) {
  const cols = { 2: "md:grid-cols-2", 3: "md:grid-cols-2 lg:grid-cols-3", 4: "sm:grid-cols-2 lg:grid-cols-4" }[columns];
  const dark = tone === "dark";
  return (
    <ul className={cn("grid gap-4", cols)}>
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <li
            key={item.title}
            data-reveal
            style={{ "--i": i % 4 } as CSSProperties}
            className={cn(
              "group flex flex-col rounded-[var(--radius-card)] border p-6 transition-[translate,border-color,background-color,box-shadow] duration-300 hover:-translate-y-0.5 md:p-7",
              dark ? "border-white/10 bg-white/[0.03] hover:border-white/25 hover:bg-white/[0.05]" : tone === "paper" ? "border-line bg-white hover:border-brand/30" : "border-line bg-paper/60 hover:border-brand/30 hover:bg-white",
            )}
          >
            <div className="flex items-center justify-between">
              {Icon ? (
                <span className={cn("flex size-10 items-center justify-center rounded-lg transition-colors", dark ? "bg-white/5 text-brand" : "bg-white text-brand ring-1 ring-line group-hover:bg-brand group-hover:text-ink group-hover:ring-brand")}>
                  <Icon aria-hidden className="size-[1.1rem]" />
                </span>
              ) : (
                <span />
              )}
              {numbered && <span className={cn("font-mono text-xs", dark ? "text-white/55" : "text-muted")}>{String(i + 1).padStart(2, "0")}</span>}
            </div>
            <h3 className={cn("mt-5 text-[1.08rem] font-semibold", dark ? "text-white" : "text-ink")}>{item.title}</h3>
            <p className={cn("mt-2 text-[0.95rem] leading-relaxed", dark ? "text-white/60" : "text-muted")}>{item.description}</p>
          </li>
        );
      })}
    </ul>
  );
}
