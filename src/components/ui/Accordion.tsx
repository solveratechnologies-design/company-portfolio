"use client";

import { useId, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FAQItem } from "@/types/service";

/**
 * Accessible accordion (WAI-ARIA disclosure pattern).
 * Each header is a real <button> with aria-expanded / aria-controls,
 * and each panel is a labelled region.
 */
export function Accordion({
  items,
  allowMultiple = false,
  headingLevel = 3,
  className,
}: {
  items: FAQItem[];
  allowMultiple?: boolean;
  headingLevel?: 2 | 3 | 4;
  className?: string;
}) {
  const baseId = useId();
  const [open, setOpen] = useState<Set<number>>(new Set());
  const Heading = `h${headingLevel}` as "h2" | "h3" | "h4";

  function toggle(index: number) {
    setOpen((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  }

  return (
    <div data-reveal className={cn("divide-y divide-line border-y border-line", className)}>
      {items.map((item, i) => {
        const isOpen = open.has(i);
        const buttonId = `${baseId}-q-${i}`;
        const panelId = `${baseId}-a-${i}`;
        return (
          <div key={item.question}>
            <Heading className="m-0">
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(i)}
                className="group flex w-full items-start justify-between gap-6 py-5 text-left text-[1.05rem] font-medium text-ink transition-colors hover:text-brand md:py-6"
              >
                <span>{item.question}</span>
                <span
                  aria-hidden
                  className={cn(
                    "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border transition-[translate,transform,background-color,border-color,color] duration-300",
                    isOpen ? "rotate-45 border-brand bg-brand text-ink" : "border-line text-ink group-hover:border-brand/40",
                  )}
                >
                  <Plus className="size-4" />
                </span>
                <span className="sr-only">{isOpen ? "Collapse" : "Expand"}</span>
              </button>
            </Heading>
            <div className={cn("grid transition-[grid-template-rows] duration-300 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
              <div id={panelId} role="region" aria-labelledby={buttonId} inert={!isOpen} className="overflow-hidden">
                <div className={cn("pr-12 leading-relaxed text-muted", isOpen ? "pb-6" : "pb-0")}>{item.answer}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
