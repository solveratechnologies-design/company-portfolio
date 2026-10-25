import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Eyebrow } from "./Eyebrow";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

/**
 * Page hero shared by every inner page. Slightly darker than the site
 * background. The transparent header sits on top of it.
 */
export function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  actions,
  aside,
  size = "default",
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  breadcrumbs?: Crumb[];
  actions?: ReactNode;
  aside?: ReactNode;
  size?: "default" | "compact";
  children?: ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-hero text-ink">
      <div aria-hidden className="bg-grid-light mask-fade-b absolute inset-0 -z-10" />
      <div aria-hidden className="absolute -right-40 -top-40 -z-10 size-[620px] rounded-full bg-brand/25 blur-[140px]" />
      <div aria-hidden className="absolute -bottom-56 left-[-10%] -z-10 size-[460px] rounded-full bg-brand/10 blur-[140px]" />
      <Container
        className={cn(
          "pt-32 md:pt-40",
          size === "compact" ? "pb-10 md:pb-20" : "pb-12 md:pb-28",
          aside && "grid items-center gap-14 lg:grid-cols-[1.15fr_1fr]",
        )}
      >
        <div className="flex max-w-3xl flex-col gap-6">
          {breadcrumbs && (
            <div className="enter" style={{ "--i": 0 } as CSSProperties}>
              <Breadcrumbs items={breadcrumbs} />
            </div>
          )}
          {eyebrow && (
            <div className="enter" style={{ "--i": 1 } as CSSProperties}>
              <Eyebrow>{eyebrow}</Eyebrow>
            </div>
          )}
          <h1 className="enter text-title font-semibold text-balance" style={{ "--i": 2 } as CSSProperties}>
            {title}
          </h1>
          {description && (
            <div className="enter max-w-2xl text-lead text-muted text-pretty" style={{ "--i": 3 } as CSSProperties}>
              {description}
            </div>
          )}
          {actions && (
            <div className="enter mt-2 flex flex-wrap gap-3" style={{ "--i": 4 } as CSSProperties}>
              {actions}
            </div>
          )}
          {children}
        </div>
        {aside && (
          <div className="enter" style={{ "--i": 3 } as CSSProperties}>
            {aside}
          </div>
        )}
      </Container>
    </section>
  );
}
