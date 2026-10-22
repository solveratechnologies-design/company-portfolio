import type { CSSProperties } from "react";
import { ArrowDownRight, Handshake, PackageCheck, Workflow } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { detailedPhases, type DetailedPhase } from "@/data/process";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Our Process",
  description:
    "How Solvera delivers projects: discovery, planning, design and prototyping, development and integration, then testing, launch and ongoing improvement.",
  path: "/process",
});

function Phase({ phase, index, total }: { phase: DetailedPhase; index: number; total: number }) {
  const columns = [
    { title: "What happens", icon: Workflow, items: phase.whatHappens },
    { title: "What you contribute", icon: Handshake, items: phase.clientContributes },
    { title: "What Solvera delivers", icon: PackageCheck, items: phase.solveraDelivers },
  ];
  return (
    <Section id={phase.id} tone={index % 2 === 0 ? "white" : "paper"} labelledBy={`${phase.id}-title`} className="py-16! md:py-24!">
      <Container className="grid gap-10 lg:grid-cols-[300px_1fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start" data-reveal>
          <div className="flex items-center gap-3">
            <span className="flex size-12 items-center justify-center rounded-full bg-brand font-mono text-sm font-medium text-ink">{phase.number}</span>
            <span className="font-mono text-xs text-muted">
              Phase {index + 1} of {total}
            </span>
          </div>
          <h2 id={`${phase.id}-title`} className="mt-6 text-heading font-semibold">
            {phase.title}
          </h2>
          <p className="mt-3 text-lead text-muted">{phase.intro}</p>
          <div className="mt-6 h-1 overflow-hidden rounded-full bg-line" role="progressbar" aria-label="Process progress" aria-valuemin={0} aria-valuemax={total} aria-valuenow={index + 1}>
            <div className="h-full rounded-full bg-gradient-to-r from-brand to-mint" style={{ width: `${((index + 1) / total) * 100}%` }} />
          </div>
        </div>
        <div>
          <div className="grid gap-4 md:grid-cols-3">
            {columns.map(({ title, icon: Icon, items }, i) => (
              <div key={title} data-reveal style={{ "--i": i } as CSSProperties} className={cn("rounded-[var(--radius-card)] border border-line p-6", index % 2 === 0 ? "bg-paper/60" : "bg-white")}>
                <Icon aria-hidden className="size-5 text-brand" />
                <h3 className="mt-4 font-semibold">{title}</h3>
                <ul className="mt-3 flex flex-col gap-2.5 text-[0.95rem] leading-relaxed text-muted">
                  {items.map((it) => (
                    <li key={it} className="flex gap-2">
                      <span aria-hidden className="mt-2.5 size-1 shrink-0 rounded-full bg-ink/40" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p data-reveal className="mt-5 flex items-start gap-3 rounded-2xl border border-mint/30 bg-mint-50 p-4 text-[0.95rem] text-ink/80">
            <ArrowDownRight aria-hidden className="mt-0.5 size-4 shrink-0 text-[#1f7a58]" />
            <span>
              <span className="font-semibold text-ink">Next step: </span>
              {phase.nextStep}
            </span>
          </p>
        </div>
      </Container>
    </Section>
  );
}

export default function ProcessPage() {
  return (
    <>
      {/* 1 */}
      <PageHero
        breadcrumbs={[{ label: "Process", href: "/process" }]}
        eyebrow="Our process"
        title="A Clear Process. A Better Outcome."
        description="Five phases, each with clear activities, responsibilities and deliverables — so you always know where a project stands and what happens next."
        actions={
          <ButtonLink href="/contact" size="lg" arrow>
            Start with discovery
          </ButtonLink>
        }
      >
        <nav aria-label="Process phases" className="mt-4">
          <ol className="flex flex-wrap gap-2">
            {detailedPhases.map((p) => (
              <li key={p.id}>
                <a href={`#${p.id}`} className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/50 px-3.5 py-1.5 text-sm text-ink/75 transition-colors hover:border-brand/40 hover:text-brand-600">
                  <span className="font-mono text-xs text-brand">{p.number}</span>
                  {p.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </PageHero>
      {/* 2–6 */}
      {detailedPhases.map((p, i) => (
        <Phase key={p.id} phase={p} index={i} total={detailedPhases.length} />
      ))}
      {/* 7 */}
      <FinalCTA title="Ready to start with a conversation?" description="The first step is a short discussion about your goals. No commitment — just clarity on what could help." secondary={{ label: "Read the FAQ", href: "/faq" }} />
    </>
  );
}
