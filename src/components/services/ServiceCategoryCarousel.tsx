"use client";

import { useEffect, useId, useState } from "react";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { getService } from "@/data/services";
import { cn } from "@/lib/utils";

const offeringIcons = getService("web-development").offerings;

const INTERVAL = 2000;

function offset(index: number, active: number, total: number) {
  let delta = index - active;
  const half = total / 2;
  if (delta > half) delta -= total;
  if (delta < -half) delta += total;
  return delta;
}

export function ServiceCategoryCarousel({ items }: { items: { title: string; description: string }[] }) {
  const total = items.length;
  const labelId = useId();
  const [active, setActive] = useState(0);
  // Remember the previously active slide in state (not a ref read during render) so the
  // render stays pure; updating state while rendering is React's supported "adjust state on
  // prop/state change" pattern and does not need an effect.
  const [tracked, setTracked] = useState({ active: 0, previous: 0 });
  if (tracked.active !== active) setTracked({ active, previous: tracked.active });
  const [paused, setPaused] = useState(false);
  // Persistent pause chosen with the Pause/Play button (WCAG 2.2.2).
  const [userPaused, setUserPaused] = useState(false);
  const [timer, setTimer] = useState(0);
  const [reduce, setReduce] = useState(false);
  const [wide, setWide] = useState(true);

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

  const rotating = !reduce && !userPaused && !paused;

  useEffect(() => {
    if (!rotating) return;
    const id = window.setInterval(() => setActive((current) => (current + 1) % total), INTERVAL);
    return () => window.clearInterval(id);
  }, [rotating, total, timer]);

  function go(direction: number) {
    setActive((current) => (current + direction + total) % total);
    setTimer((current) => current + 1);
  }

  const step = wide ? 240 : 0;
  const reach = wide ? 2 : 1;

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
          {!reduce && (
            <button
              type="button"
              aria-label={userPaused ? "Start automatic rotation of categories" : "Pause automatic rotation of categories"}
              onClick={() => setUserPaused((current) => !current)}
              className="flex size-11 items-center justify-center border-r border-line text-ink/70 transition-colors hover:bg-paper hover:text-ink"
            >
              {userPaused ? <Play aria-hidden className="size-4" /> : <Pause aria-hidden className="size-4" />}
            </button>
          )}
          <button
            type="button"
            aria-label="Previous category"
            onClick={() => go(-1)}
            className="flex size-11 items-center justify-center text-ink/70 transition-colors hover:bg-paper hover:text-ink"
          >
            <ChevronLeft aria-hidden className="size-4" />
          </button>
          <button
            type="button"
            aria-label="Next category"
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
        className="relative mt-6 h-[320px] overflow-hidden md:h-[360px]"
      >
        <p id={labelId} aria-live={rotating ? "off" : "polite"} aria-atomic className="sr-only">
          Service categories. Showing {items[active]?.title}.
        </p>
        <ul className="absolute inset-0">
          {items.map((item, index) => {
            const Icon = offeringIcons.find((offering) => offering.title === item.title)?.icon;
            const place = offset(index, active, total);
            const before = offset(index, tracked.previous, total);
            const jump = Math.abs(place - before) > 1;
            const featured = place === 0;
            const visible = Math.abs(place) <= reach;
            const scale = featured ? 1.08 : Math.abs(place) === 1 ? 0.88 : 0.8;
            const shift = wide ? place * step : place * 78;

            return (
              <li
                key={item.title}
                aria-hidden={!featured}
                className="absolute top-1/2 left-1/2 w-[min(78vw,250px)] md:w-[270px]"
                style={{
                  transform: wide
                    ? `translate(-50%, -50%) translateX(${shift}px) translateY(${featured ? -12 : 10}px) scale(${scale})`
                    : `translate(-50%, -50%) translateX(${shift}vw) scale(${featured ? 1 : 0.86})`,
                  zIndex: featured ? 30 : 20 - Math.abs(place),
                  opacity: visible ? (featured ? 1 : 0.72) : 0,
                  transition: reduce || jump ? "none" : "transform 700ms cubic-bezier(0.22, 1, 0.36, 1), opacity 700ms ease",
                  pointerEvents: visible ? "auto" : "none",
                }}
              >
                <button
                  type="button"
                  tabIndex={featured ? 0 : -1}
                  onClick={() => setActive(index)}
                  className={cn(
                    "flex h-[250px] w-full flex-col rounded-[var(--radius-card)] border bg-white p-6 text-left md:h-[270px] md:p-7",
                    featured
                      ? "border-white shadow-[0_28px_60px_-28px_rgb(16_24_32/0.45)]"
                      : "border-line shadow-[0_10px_30px_-24px_rgb(16_24_32/0.35)]",
                  )}
                >
                  {Icon && (
                    <span
                      className={cn(
                        "flex size-10 items-center justify-center rounded-lg",
                        featured ? "bg-brand text-ink" : "bg-white text-brand ring-1 ring-line",
                      )}
                    >
                      <Icon aria-hidden className="size-[1.1rem]" />
                    </span>
                  )}
                  <span className="mt-5 text-[1.08rem] font-semibold text-ink">{item.title}</span>
                  <span className="mt-2 text-[0.95rem] leading-relaxed text-muted">{item.description}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
