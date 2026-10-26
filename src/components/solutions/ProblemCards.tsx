"use client";

import Link from "next/link";
import { ArrowRight, ClipboardList, FileSpreadsheet, SearchX, Timer, Unplug, Users, type LucideIcon } from "lucide-react";
import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useZoomCards } from "./useZoomCards";

export type ProblemCard = {
  icon: "spreadsheet" | "timer" | "search" | "users" | "clipboard" | "unplug";
  problem: string;
  direction: string;
  services: { href: string; title: string }[];
};

const icons: Record<ProblemCard["icon"], LucideIcon> = {
  spreadsheet: FileSpreadsheet,
  timer: Timer,
  search: SearchX,
  users: Users,
  clipboard: ClipboardList,
  unplug: Unplug,
};

/** Zooms one business-problem card at a time as the section is scrolled. */
export function ProblemCards({ cards }: { cards: ProblemCard[] }) {
  const trackRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  useZoomCards(trackRef, listRef, "[data-problem-card]", { mobile: "center" });

  return (
    <section ref={trackRef} id="problems" data-zoom-track aria-labelledby="problems-title">
      <div data-zoom-sticky className="z-20 bg-canvas lg:sticky lg:top-[4.5rem] motion-reduce:static">
        <Container className="py-6 lg:py-4">
          <SectionHeading
            eyebrow="Business problems"
            id="problems-title"
            title="Sound familiar?"
            description="Common situations we help with — and the kind of solution that usually fits."
          />
          <ul ref={listRef} className="mt-8 grid gap-4 md:grid-cols-2 lg:mt-10 lg:grid-cols-3">
            {cards.map((card, index) => {
              const Icon = icons[card.icon];
              const active = index === 0;
              return (
                <li
                  key={card.problem}
                  data-problem-card
                  aria-current={active ? "true" : "false"}
                  className="flex origin-center flex-col rounded-[var(--radius-card)] border border-line bg-white p-6 transition-[transform,opacity,box-shadow,border-color] duration-500 ease-out motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:shadow-none"
                  style={{
                    transform: active ? "scale(1.07)" : "scale(0.94)",
                    opacity: active ? 1 : 0.55,
                    zIndex: active ? 2 : 1,
                    borderColor: active ? "rgb(242 114 34 / 0.45)" : undefined,
                    boxShadow: active ? "0 28px 50px -24px rgb(242 114 34 / 0.45)" : "none",
                  }}
                >
                  <Icon aria-hidden className="size-5 text-brand" />
                  <p className="mt-5 text-[1.05rem] font-semibold leading-snug">{card.problem}</p>
                  <p className="mt-3 flex gap-2 text-muted">
                    <ArrowRight aria-hidden className="mt-1 size-4 shrink-0 text-mint" />
                    {card.direction}
                  </p>
                  <ul className="mt-auto flex flex-wrap gap-1.5 pt-5" aria-label="Related services">
                    {card.services.map((service) => (
                      <li key={service.href}>
                        <Link href={service.href} className="inline-flex rounded-full border border-line px-2.5 py-1 text-xs text-ink/75 transition-colors hover:border-brand/40 hover:text-brand">
                          {service.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ul>
        </Container>
      </div>
      <div data-zoom-runway aria-hidden className="hidden h-[70vh] lg:block motion-reduce:hidden" />
    </section>
  );
}
