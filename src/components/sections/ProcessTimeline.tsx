import type { CSSProperties } from "react";
import { processPhases } from "@/data/process";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";

/** Horizontal timeline on desktop, vertical on mobile. */
export function ProcessTimeline() {
  return (
    <Section labelledBy="process-title">
      <Container>
        <SectionHeading
          eyebrow="Our process"
          id="process-title"
          title="From First Conversation to Continuous Improvement."
          description="A structured, transparent process — so you always know what is happening, what we need from you, and what comes next."
          action={
            <ButtonLink href="/process" variant="secondary" arrow>
              See How We Work
            </ButtonLink>
          }
        />
        <ol data-animate="" className="relative mt-16 grid gap-0 lg:grid-cols-4 lg:gap-6">
          <svg aria-hidden className="absolute left-0 right-0 top-[1.4rem] hidden h-px w-full lg:block" preserveAspectRatio="none" viewBox="0 0 100 1">
            <line x1="0" y1="0.5" x2="100" y2="0.5" stroke="#eadfd4" strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <line x1="0" y1="0.5" x2="100" y2="0.5" pathLength={1} className="draw-line" stroke="#f27222" strokeWidth="1.5" />
          </svg>
          {processPhases.map((phase, i) => (
            <li key={phase.number} data-reveal style={{ "--i": i } as CSSProperties} className="relative flex gap-5 pb-10 lg:flex-col lg:gap-0 lg:pb-0">
              {i < processPhases.length - 1 && <span aria-hidden className="absolute bottom-0 left-[1.4rem] top-12 w-px bg-line lg:hidden" />}
              <span className="relative z-10 flex size-11 shrink-0 items-center justify-center rounded-full border border-brand/30 bg-white font-mono text-sm font-medium text-brand shadow-[0_0_0_6px_var(--color-canvas)]">
                {phase.number}
              </span>
              <div className="lg:mt-7">
                <h3 className="text-card font-semibold">{phase.title}</h3>
                <p className="mt-2 leading-relaxed text-muted">{phase.summary}</p>
                <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={`${phase.title} deliverables`}>
                  {phase.deliverables.map((d) => (
                    <li key={d} className="rounded-full bg-paper px-2.5 py-1 text-xs text-ink/75 ring-1 ring-line">
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}
