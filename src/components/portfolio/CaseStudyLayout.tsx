import type { CSSProperties } from "react";
import { AlertTriangle, CheckCircle2, Lightbulb, Target } from "lucide-react";
import type { Project } from "@/types/project";
import { statusLabel, getRelatedProjects } from "@/data/projects";
import { serviceMap } from "@/data/services";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { IconLink } from "@/components/ui/IconLink";
import { ProjectVisual } from "@/components/visuals/UIMockup";
import { ProjectGrid } from "./ProjectGrid";
import { FinalCTA } from "@/components/sections/FinalCTA";

function Block({ id, title, children, index = 0 }: { id: string; title: string; children: React.ReactNode; index?: number }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} data-reveal style={{ "--i": index } as CSSProperties} className="grid gap-4 border-t border-line py-12 md:grid-cols-[220px_1fr] md:gap-12">
      <h2 id={`${id}-title`} className="font-mono text-xs uppercase tracking-[0.16em] text-muted md:pt-1.5">
        {title}
      </h2>
      <div className="text-[1.05rem] leading-relaxed text-ink/80">{children}</div>
    </section>
  );
}

export function CaseStudyLayout({ project }: { project: Project }) {
  const related = getRelatedProjects(project.slug, 2);
  const isClient = project.status === "client";

  return (
    <>
      {/* Overview */}
      <PageHero
        breadcrumbs={[
          { label: "Work", href: "/work" },
          { label: project.title, href: `/work/${project.slug}` },
        ]}
        eyebrow={project.category}
        title={project.title}
        description={project.summary}
        size="compact"
      >
        <div className="flex flex-wrap gap-2">
          <Badge tone="brand">{project.category}</Badge>
          <Badge tone={isClient ? "mint" : "warning"}>{statusLabel[project.status]}</Badge>
          {project.services.map((s) => (
            <Badge key={s} tone="neutral">
              {serviceMap[s].title}
            </Badge>
          ))}
        </div>
      </PageHero>

      <Section className="pt-12! md:pt-16!">
        <Container>
          <figure data-reveal className="overflow-hidden rounded-[1.75rem] border border-line">
            <ProjectVisual spec={project.cover} priority className="aspect-[16/9] md:aspect-[21/9]" sizes="100vw" />
            <figcaption id="cover-caption" className="border-t border-line bg-paper px-5 py-3 text-sm text-muted">
              {project.cover.caption}
            </figcaption>
          </figure>

          {!isClient && (
            <p className="mt-8 flex items-start gap-3 rounded-2xl border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-900">
              <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" />
              This is {project.status === "concept" ? "a concept project" : "an internal prototype"}, not commissioned client work. It illustrates our approach; it does not report client outcomes.
            </p>
          )}

          <div className="mt-12">
            <Block id="problem" title="Business problem">
              <p>{project.problem}</p>
            </Block>
            <Block id="goals" title="Goals & constraints">
              <div className="grid gap-8 sm:grid-cols-2">
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-ink">
                    <Target aria-hidden className="size-4 text-brand" /> Goals
                  </h3>
                  <ul className="mt-3 flex flex-col gap-2 text-base">
                    {project.goals.map((g) => (
                      <li key={g} className="flex gap-2.5">
                        <CheckCircle2 aria-hidden className="mt-1 size-4 shrink-0 text-mint" />
                        {g}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="flex items-center gap-2 font-semibold text-ink">
                    <AlertTriangle aria-hidden className="size-4 text-amber-500" /> Constraints
                  </h3>
                  <ul className="mt-3 flex flex-col gap-2 text-base">
                    {project.constraints.map((c) => (
                      <li key={c} className="flex gap-2.5">
                        <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-amber-400" />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Block>
            <Block id="solution" title="Proposed solution">
              <p>{project.solution}</p>
            </Block>
            <Block id="approach" title="Design & implementation">
              <ol className="grid gap-4 sm:grid-cols-2">
                {project.approach.map((a, i) => (
                  <li key={a.title} className="rounded-2xl border border-line bg-paper/60 p-5">
                    <span className="font-mono text-xs text-brand">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="mt-2 font-semibold text-ink">{a.title}</h3>
                    <p className="mt-1.5 text-[0.95rem] text-muted">{a.description}</p>
                  </li>
                ))}
              </ol>
            </Block>
            <Block id="technologies" title="Technologies">
              <ul className="flex flex-wrap gap-2">
                {project.technologies.map((t) => (
                  <li key={t} className="rounded-lg bg-paper px-3 py-1.5 font-mono text-sm text-ink/80 ring-1 ring-line">
                    {t}
                  </li>
                ))}
              </ul>
            </Block>
            <Block id="visuals" title="Product visuals">
              <div className="grid gap-5 sm:grid-cols-2">
                {project.gallery.map((g) => (
                  <figure key={g.caption} className="overflow-hidden rounded-2xl border border-line">
                    <ProjectVisual spec={g} className="aspect-[4/3]" sizes="(min-width: 768px) 40vw, 100vw" />
                    <figcaption className="border-t border-line bg-paper px-4 py-2.5 text-sm text-muted">{g.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </Block>
            {isClient && project.results && project.results.length > 0 && (
              <Block id="results" title="Results">
                <ul className="flex flex-col gap-2">
                  {project.results.map((r) => (
                    <li key={r} className="flex gap-2.5">
                      <CheckCircle2 aria-hidden className="mt-1 size-4 shrink-0 text-mint" />
                      {r}
                    </li>
                  ))}
                </ul>
              </Block>
            )}
            <Block id="lessons" title="Lessons & next steps">
              <ul className="flex flex-col gap-3">
                {project.lessons.map((l) => (
                  <li key={l} className="flex gap-3">
                    <Lightbulb aria-hidden className="mt-1 size-4 shrink-0 text-brand" />
                    {l}
                  </li>
                ))}
              </ul>
            </Block>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8">
            <IconLink href="/work">Back to all work</IconLink>
            <ButtonLink href={serviceMap[project.services[0]].href} variant="secondary" arrow>
              About {serviceMap[project.services[0]].title}
            </ButtonLink>
          </div>
        </Container>
      </Section>

      {related.length > 0 && (
        <Section tone="paper" labelledBy="related-title">
          <Container>
            <h2 id="related-title" className="text-heading font-semibold">
              Related projects
            </h2>
            <div className="mt-10">
              <ProjectGrid projects={related} columns={2} />
            </div>
          </Container>
        </Section>
      )}

      <FinalCTA title="Facing a similar challenge?" description="Tell us about your situation and we'll share how we'd approach it." />
    </>
  );
}
