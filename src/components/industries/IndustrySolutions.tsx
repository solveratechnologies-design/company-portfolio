"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { useZoomCards } from "@/components/solutions/useZoomCards";

export type IndustrySolutionItem = {
  title: string;
  description: string;
  href: string;
  service: string;
};

/** Zooms one solution card at a time. No extra scroll space is added around the list. */
export function IndustrySolutions({ items }: { items: IndustrySolutionItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  useZoomCards(trackRef, listRef, "[data-solution-card]", { mobile: "stacked-center", progress: "view" });

  return (
    <div ref={trackRef}>
      <h4 className="text-sm font-semibold">Possible solutions</h4>
      <ul ref={listRef} className="mt-3 grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          return (
            <li key={item.title} className="relative">
              <Link
                href={item.href}
                data-solution-card
                className="group relative flex h-full origin-center flex-col rounded-2xl border border-line bg-white p-5 transition-[transform,opacity,box-shadow,border-color,color] duration-500 ease-out hover:border-brand/30 motion-reduce:scale-100 motion-reduce:opacity-100 motion-reduce:shadow-none"
              >
                <span className="font-medium group-hover:text-brand-ink">{item.title}</span>
                <span className="mt-1.5 text-sm leading-relaxed text-muted">{item.description}</span>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-medium text-brand-ink">
                  {item.service}
                  <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
