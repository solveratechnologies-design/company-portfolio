import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import { industries } from "@/data/industries";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function IndustriesGrid() {
  return (
    <Section tone="paper" labelledBy="industries-title">
      <Container>
        <SectionHeading
          eyebrow="Industries"
          id="industries-title"
          title="Industries We Support"
          description="Sectors we design solutions for — each with its own workflows, customers and priorities."
        />
        <ul className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {industries.map((ind, i) => {
            const Icon = ind.icon;
            return (
              <li key={ind.slug}>
                <Link
                  href={`/industries#${ind.slug}`}
                  data-reveal
                  style={{ "--i": i % 4 } as CSSProperties}
                  className="group flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-6 transition-[border-color,box-shadow,translate] duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_20px_40px_-28px_rgb(16_24_32/0.4)]"
                >
                  <div className="flex items-center justify-between">
                    <Icon aria-hidden className="size-6 text-brand" />
                    <ArrowUpRight aria-hidden className="size-4 text-ink/25 transition-colors group-hover:text-brand" />
                  </div>
                  <h3 className="mt-6 font-semibold">{ind.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{ind.summary}</p>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
