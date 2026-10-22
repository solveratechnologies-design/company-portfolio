import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Eyebrow } from "./Eyebrow";

export function SectionHeading({
  eyebrow,
  title,
  description,
  id,
  align = "left",
  tone = "light",
  as: Tag = "h2",
  className,
  action,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  id?: string;
  align?: "left" | "center";
  tone?: "light" | "dark";
  as?: "h1" | "h2" | "h3";
  className?: string;
  action?: ReactNode;
}) {
  return (
    <div
      data-reveal
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        action && "md:flex-row md:items-end md:justify-between md:gap-12",
        className,
      )}
    >
      <div className={cn("flex max-w-3xl flex-col gap-5", align === "center" && "items-center")}>
        {eyebrow && <Eyebrow tone={tone === "dark" ? "dark" : "light"}>{eyebrow}</Eyebrow>}
        <Tag id={id} className={cn("text-heading font-semibold text-balance", tone === "dark" ? "text-white" : "text-ink")}>
          {title}
        </Tag>
        {description && (
          <div className={cn("max-w-2xl text-lead text-pretty", tone === "dark" ? "text-white/70" : "text-muted")}>{description}</div>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
