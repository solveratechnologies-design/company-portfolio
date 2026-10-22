"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { services } from "@/data/services";
import type { Service } from "@/types/service";
import { cn } from "@/lib/utils";

const INTERVAL = 2000;

function offset(index: number, active: number, total: number) {
  let delta = index - active;
  const half = total / 2;
  if (delta > half) delta -= total;
  if (delta < -half) delta += total;
  return delta;
}

function CardFace({ service, index, featured }: { service: Service; index: number; featured: boolean }) {
  const Icon = service.icon;
  const mint = service.accent === "mint";
  return (
    <>
      <div className="flex items-start justify-between">
        <span
          className={cn(
            "flex size-12 items-center justify-center rounded-xl",
            featured
              ? mint
                ? "bg-mint text-ink"
                : "bg-brand text-ink"
              : mint
                ? "bg-mint-50 text-[#1f7a58]"
                : "bg-brand-50 text-brand",
          )}
        >
          <Icon aria-hidden className="size-5" />
        </span>
        <span className="font-mono text-xs text-muted">0{index + 1}</span>
      </div>
      <h3 className="mt-6 text-card font-semibold text-ink">{service.title}</h3>
      <p className="mt-3 leading-relaxed text-muted">{service.summary}</p>
      <ul className="mt-5 flex flex-wrap gap-1.5">
        {service.offerings.slice(0, 4).map((item) => (
          <li key={item.title} className="rounded-full border border-line px-2.5 py-1 text-xs text-ink/70">
            {item.title}
          </li>
        ))}
      </ul>
      <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-brand">
        Learn More
        <span className="sr-only"> about {service.title}</span>
        <ArrowRight aria-hidden className="size-4" />
      </span>
    </>
  );
}

function CardShell({
  featured,
  children,
  onSelect,
  href,
}: {
  featured: boolean;
  children: ReactNode;
  onSelect: () => void;
  href: string;
}) {
  const className = cn(
    "flex min-h-[420px] w-full flex-col rounded-[var(--radius-card)] border bg-white p-7 text-left md:min-h-[440px] md:p-8",
    featured
      ? "border-white shadow-[0_28px_60px_-28px_rgb(16_24_32/0.45)]"
      : "border-line shadow-[0_10px_30px_-24px_rgb(16_24_32/0.35)]",
  );
  if (featured) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <button type="button" onClick={onSelect} className={className}>
      {children}
    </button>
  );
}

export function ServiceOverviewCarousel() {
  const total = services.length;
  const labelId = useId();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [reduce, setReduce] = useState(false);
  const [wide, setWide] = useState(true);
  const previous = useRef(0);

  useEffect(() => {
    previous.current = active;
  }, [active]);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktop = window.matchMedia("(min-width: 768px)");
    const sync = () => {
      setReduce(motion.matches);
      setWide(desktop.matches);
    };
    sync();
    motion.addEventListener("change", sync);
    desktop.addEventListener("change", sync);
    return () => {
      motion.removeEventListener("change", sync);
      desktop.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (paused || reduce) return;
    const id = window.setInterval(() => setActive((current) => (current + 1) % total), INTERVAL);
    return () => window.clearInterval(id);
  }, [paused, reduce, total, timer]);

  function go(direction: number) {
    setActive((current) => (current + direction + total) % total);
    setTimer((current) => current + 1);
  }

  const step = wide ? 340 : 0;
  const reach = wide ? 1 : 1;

  return (
    <div
      className="mt-10"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <div className="flex justify-end">
        <div className="inline-flex overflow-hidden rounded-full border border-line bg-white">
          <button
            type="button"
            aria-label="Previous service"
            onClick={() => go(-1)}
            className="flex size-11 items-center justify-center text-ink/70 transition-colors hover:bg-paper hover:text-ink"
          >
            <ChevronLeft aria-hidden className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next service"
            onClick={() => go(1)}
            className="flex size-11 items-center justify-center border-l border-line text-ink/70 transition-colors hover:bg-paper hover:text-ink"
          >
            <ChevronRight aria-hidden className="size-4" />
          </button>
        </div>
      </div>

      <div
        role="region"
        aria-roledescription="carousel"
        aria-labelledby={labelId}
        className="relative mt-6 h-[560px] overflow-hidden md:h-[640px]"
      >
        <p id={labelId} className="sr-only">
          Services. Showing {services[active]?.title}.
        </p>
        <ul className="absolute inset-0">
          {services.map((service, index) => {
            const place = offset(index, active, total);
            const before = offset(index, previous.current, total);
            const jump = Math.abs(place - before) > 1;
            const featured = place === 0;
            const visible = Math.abs(place) <= reach;
            const scale = featured ? 1.06 : 0.86;
            const shift = wide ? place * step : place * 84;

            return (
              <li
                key={service.slug}
                aria-hidden={!featured}
                className="absolute top-1/2 left-1/2 w-[min(86vw,340px)] md:w-[380px]"
                style={{
                  transform: wide
                    ? `translate(-50%, -50%) translateX(${shift}px) translateY(${featured ? -14 : 12}px) scale(${scale})`
                    : `translate(-50%, -50%) translateX(${shift}vw) scale(${featured ? 1 : 0.86})`,
                  zIndex: featured ? 30 : 20 - Math.abs(place),
                  opacity: visible ? (featured ? 1 : 0.7) : 0,
                  transition: reduce || jump ? "none" : "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease",
                  pointerEvents: visible ? "auto" : "none",
                }}
              >
                <CardShell featured={featured} href={service.href} onSelect={() => go(place)}>
                  <CardFace service={service} index={index} featured={featured} />
                </CardShell>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
