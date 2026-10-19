import type { CSSProperties, ReactNode } from "react";
import { Check } from "lucide-react";
import type { ServiceItem, ServiceSlug } from "@/types/service";
import { getProjectsByService } from "@/data/projects";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";
import { ButtonLink } from "@/components/ui/Button";

/** Overview: heading + body on the left, use cases on the right. */
export function ServiceOverviewBlock({
  eyebrow = "Overview",
  title,
  children,
  useCases,
  useCasesTitle = "This is a good fit if you want to…",
}: {
  eyebrow?: string;
  title: string;
  children: ReactNode;
  useCases: string[];
  useCasesTitle?: string;
}) {
  return (
    <Section id="overview" labelledBy="overview-title">
      <Container className="grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:gap-20">
        <div className="flex flex-col gap-6">
          <SectionHeading eyebrow={eyebrow} id="overview-title" title={title} />
          <div data-reveal className="flex flex-col gap-4 text-lead leading-relaxed text-ink/80">
            {children}
          </div>
        </div>
        <div data-reveal className="h-fit rounded-[var(--radius-card)] border border-line bg-paper p-7 md:p-8">
          <h3 className="font-semibold">{useCasesTitle}</h3>
          <ul className="mt-5 flex flex-col gap-3.5">
            {useCases.map((u) => (
              <li key={u} className="flex gap-3 text-ink/80">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-mint-50">
                  <Check aria-hidden className="size-3 text-[#1f7a58]" strokeWidth={3} />
                </span>
                {u}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </Section>
  );
}

/** Numbered process steps — horizontal grid on desktop, stacked on mobile. */
export function ProcessSteps({
  steps,
  eyebrow = "Process",
  title,
  description,
  id = "process",
  tone = "paper",
}: {
  steps: ServiceItem[];
  eyebrow?: string;
  title: string;
  description?: string;
  id?: string;
  tone?: "white" | "paper";
}) {
  const cols = steps.length >= 6 ? "lg:grid-cols-3" : steps.length === 5 ? "lg:grid-cols-5" : "lg:grid-cols-4";
  return (
    <Section id={id} tone={tone} labelledBy={`${id}-title`}>
      <Container>
        <SectionHeading eyebrow={eyebrow} id={`${id}-title`} title={title} description={description} />
        <ol className={`mt-14 grid gap-4 sm:grid-cols-2 ${cols}`}>
          {steps.map((s, i) => (
            <li key={s.title} data-reveal style={{ "--i": i % 5 } as CSSProperties} className="relative flex flex-col rounded-[var(--radius-card)] border border-line bg-white p-6">
              <div className="flex items-center gap-3">
                <span className="flex size-9 items-center justify-center rounded-full bg-brand font-mono text-xs font-medium text-white">{String(i + 1).padStart(2, "0")}</span>
                <span aria-hidden className="h-px flex-1 bg-gradient-to-r from-brand/40 to-transparent" />
              </div>
              <h3 className="mt-5 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{s.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </Section>
  );
}

export function RelatedProjectsBlock({ service, title = "Featured projects", tone = "white" }: { service: ServiceSlug; title?: string; tone?: "white" | "paper" }) {
  const projects = getProjectsByService(service, 3);
  if (!projects.length) return null;
  return (
    <Section tone={tone} labelledBy="related-projects-title">
      <Container>
        <SectionHeading
          eyebrow="Work"
          id="related-projects-title"
          title={title}
          description="Concept projects and internal prototypes, clearly labeled — showing how we approach this kind of problem."
          action={
            <ButtonLink href="/work" variant="secondary" arrow>
              View all work
            </ButtonLink>
          }
        />
        <div className="mt-14">
          <ProjectGrid projects={projects} columns={3} />
        </div>
      </Container>
    </Section>
  );
}
