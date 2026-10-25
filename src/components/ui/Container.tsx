import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Container({
  as: Tag = "div",
  className,
  children,
  size = "default",
}: {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  size?: "default" | "narrow" | "wide";
}) {
  const max = size === "narrow" ? "max-w-[880px]" : "max-w-[1240px]";
  return <Tag className={cn("mx-auto w-full px-5 sm:px-8", max, className)}>{children}</Tag>;
}

/** Standard vertical rhythm for page sections. */
export function Section({
  id,
  tone = "white",
  className,
  children,
  labelledBy,
  reveal = true,
  spacing = "default",
}: {
  id?: string;
  tone?: "white" | "paper" | "ink";
  className?: string;
  children: ReactNode;
  labelledBy?: string;
  /** Turn off when the section contains a sticky element. */
  reveal?: boolean;
  spacing?: "default" | "compact";
}) {
  const tones = {
    white: "bg-canvas text-ink",
    paper: "bg-canvas text-ink",
    ink: "on-dark bg-ink text-white",
  } as const;
  const pads = {
    default: "py-10 md:py-28",
    compact: "py-8 md:py-16",
  } as const;
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      {...(reveal ? { "data-section": "", "data-animate-section": "" } : { "data-animate-section": "" })}
      className={cn("relative", pads[spacing], tones[tone], className)}
    >
      {reveal ? <div data-reveal>{children}</div> : children}
    </section>
  );
}
