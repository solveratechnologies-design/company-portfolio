"use client";

import { Boxes, LayoutDashboard, PanelsTopLeft, Workflow, type LucideIcon } from "lucide-react";
import { useRef, type ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useZoomCards } from "./useZoomCards";

export type BuildCard = {
  icon: "dashboard" | "portal" | "tools" | "workflow";
  title: string;
  description: string;
};

const icons: Record<BuildCard["icon"], LucideIcon> = {
  dashboard: LayoutDashboard,
  portal: PanelsTopLeft,
  tools: Boxes,
  workflow: Workflow,
};

const zoomed = {
  transform: "scale(1.07)",
  opacity: 1,
  zIndex: 2,
  borderColor: "rgb(242 114 34 / 0.45)",
  boxShadow: "0 28px 50px -24px rgb(242 114 34 / 0.45)",
};

const resting = {
  transform: "scale(0.94)",
  opacity: 0.55,
  zIndex: 1,
  boxShadow: "none",
};

/** Zooms one “what we build” card at a time as the section is scrolled. */
export function BuildCards({ cards, children }: { cards: BuildCard[]; children?: ReactNode }) {
  const trackRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  useZoomCards(trackRef, listRef, "[data-build-card]");

  return (
    <section ref={trackRef} id="builds" data-zoom-track aria-labelledby="builds-title">
      <div data-zoom-sticky className="z-10 bg-canvas lg:sticky lg:top-[4.5rem] motion-reduce:static">
        <Container className="py-6 lg:pt-4 lg:pb-24">
          <SectionHeading eyebrow="What we build" id="builds-title" title="Dashboards, portals, internal tools and workflow systems." />
          <ul ref={listRef} className="mt-8 grid gap-4 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4">
            {cards.map((card, index) => {
              const Icon = icons[card.icon];
              const active = index === 0;
              return (
                <li
                  key={card.title}
                  data-build-card
                  aria-current={active ? "true" : "false"}
                  className="flex origin-center flex-col rounded-[var(--radius-card)] border border-line bg-white p-6 transition-[transform,opacity,box-shadow,border-color] duration-500 ease-out md:p-7 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:shadow-none"
                  style={active ? zoomed : resting}
                >
                  <span className="flex size-10 items-center justify-center rounded-lg bg-white text-brand ring-1 ring-line">
                    <Icon aria-hidden className="size-[1.1rem]" />
                  </span>
                  <h3 className="mt-5 text-[1.08rem] font-semibold text-ink">{card.title}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{card.description}</p>
                </li>
              );
            })}
          </ul>
        </Container>
        {children}
      </div>
      <div data-zoom-runway aria-hidden className="hidden h-[50vh] lg:block motion-reduce:hidden" />
    </section>
  );
}
