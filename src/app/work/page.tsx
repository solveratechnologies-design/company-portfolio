import type { CSSProperties } from "react";
import { Info } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { getContent } from "@/content";
import { techStack } from "@/data/services";
import { ShowSection } from "@/components/ui/ShowSection";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectFilters } from "@/components/portfolio/ProjectFilters";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata = pageMetadata({
  title: "Work & Case Studies",
  description:
    "Concept projects and internal prototypes across web development, custom software, AI, automation and digital marketing — each showing the problem, approach and technology.",
  path: "/work",
});

export default async function WorkPage() {
  const { projects } = await getContent();
  return (
    <>
      <ShowSection page="work" section="hero">
      <PageHero
        breadcrumbs={[{ label: "Work", href: "/work" }]}
        eyebrow="Portfolio"
        title="Selected Work and Digital Experiments."
        description="A collection of concept projects and internal prototypes that show how we think through problems, design solutions and choose technology."
      >
        <p className="enter mt-2 flex max-w-2xl items-start gap-3 rounded-2xl border border-line bg-white/70 p-4 text-sm text-ink/70" style={{ "--i": 4 } as CSSProperties}>
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-brand" />
          Every project is labeled. “Concept Project” and “Internal Prototype” items are not commissioned client work and include no client results.
        </p>
      </PageHero>
      </ShowSection>
      <ShowSection page="work" section="portfolio">
      <Section reveal={false} className="pt-0! md:pt-0!" labelledBy="portfolio-title">
        <Container>
          <h2 id="portfolio-title" className="sr-only">
            Projects
          </h2>
          <ProjectFilters projects={projects} />
        </Container>
      </Section>
      </ShowSection>
      <ShowSection page="work" section="stack">
      <Section tone="paper" labelledBy="capabilities-title">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
          <SectionHeading
            eyebrow="Capabilities"
            id="capabilities-title"
            title="Development capabilities and technologies."
            description="We choose tools for maintainability and fit, not novelty. These are the technologies we most often work with."
          />
          <dl className="grid gap-4 sm:grid-cols-2">
            {techStack.map((g, i) => (
              <div key={g.label} data-reveal style={{ "--i": i % 2 } as CSSProperties} className="rounded-[var(--radius-card)] border border-line bg-white p-6">
                <dt className="font-mono text-xs uppercase tracking-[0.14em] text-muted">{g.label}</dt>
                <dd className="mt-4 flex flex-wrap gap-2">
                  {g.items.map((t) => (
                    <span key={t} className="rounded-lg bg-paper px-3 py-1.5 text-sm font-medium text-ink/80 ring-1 ring-line">
                      {t}
                    </span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </Section>
      </ShowSection>
      <ShowSection page="work" section="cta">
      <FinalCTA title="Have a project like these in mind?" description="Tell us about the problem you're solving. We'll share how we would approach it." secondary={{ label: "Our process", href: "/process" }} />
      </ShowSection>
    </>
  );
}
