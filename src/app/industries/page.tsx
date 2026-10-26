import type { CSSProperties } from "react";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import type { Industry } from "@/data/industries";
import { getContent, getServiceMap } from "@/content";
import { ShowSection } from "@/components/ui/ShowSection";
import type { Service, ServiceSlug } from "@/types/service";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { IndustrySolutions } from "@/components/industries/IndustrySolutions";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Industries",
  description:
    "How web development, AI, automation and digital marketing apply to e-commerce, hospitality, professional services, real estate, healthcare, education, SaaS and financial services.",
  path: "/industries",
});

function IndustryDetail({ industry, tone = "white", serviceMap, index = 0 }: { industry: Industry; tone?: "white" | "paper"; serviceMap: Record<ServiceSlug, Service>; index?: number }) {
  const Icon = industry.icon;
  return (
    <article id={industry.slug} data-reveal style={{ "--i": index } as CSSProperties} className={cn("industry-card scroll-mt-28 rounded-[1.5rem] border border-line p-6 transition-[border-color,box-shadow] md:p-9", tone === "paper" ? "bg-white" : "bg-paper/60")}>
      <div className="grid gap-8 lg:grid-cols-[1fr_1.6fr] lg:gap-12">
        <div>
          <span className="flex size-12 items-center justify-center rounded-xl bg-brand-50 text-brand">
            <Icon aria-hidden className="size-6" />
          </span>
          <h3 className="mt-5 text-[1.5rem] font-semibold tracking-tight">{industry.name}</h3>
          <p className="mt-2 leading-relaxed text-muted">{industry.summary}</p>
          <h4 className="mt-6 text-sm font-semibold">Common challenges</h4>
          <ul className="mt-3 flex flex-col gap-2 text-sm text-ink/75">
            {industry.challenges.map((c) => (
              <li key={c} className="flex gap-2">
                <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-amber-400" />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <IndustrySolutions
          items={industry.solutions.map((s) => ({
            title: s.title,
            description: s.description,
            href: serviceMap[s.service].href,
            service: serviceMap[s.service].title,
          }))}
        />
      </div>
    </article>
  );
}

function IndustryGroup({ id, eyebrow, title, slugs, tone, bySlug, serviceMap }: { id: string; eyebrow: string; title: string; slugs: string[]; tone: "white" | "paper"; bySlug: Map<string, Industry>; serviceMap: Record<ServiceSlug, Service> }) {
  return (
    <Section tone={tone} labelledBy={`${id}-title`} spacing="tight">
      <Container>
        <SectionHeading eyebrow={eyebrow} id={`${id}-title`} title={title} />
        <div className="mt-8 flex flex-col gap-5">
          {slugs.map((slug, i) => {
            const ind = bySlug.get(slug);
            return ind ? <IndustryDetail key={slug} industry={ind} tone={tone} serviceMap={serviceMap} index={i} /> : null;
          })}
        </div>
      </Container>
    </Section>
  );
}

export default async function IndustriesPage() {
  const [{ industries }, serviceMap] = await Promise.all([getContent(), getServiceMap()]);
  const bySlug = new Map(industries.map((industry) => [industry.slug, industry]));
  return (
    <>
      <ShowSection page="industries" section="hero">
      <PageHero
        breadcrumbs={[{ label: "Industries", href: "/industries" }]}
        eyebrow="Industries"
        title="Technology Designed Around the Way Your Business Works."
        description="Every sector has its own customers, workflows and rules. These are the industries we design solutions for, and the problems we can help address."
        size="tight"
      />
      </ShowSection>
      <ShowSection page="industries" section="list">
      <Section labelledBy="grid-title" spacing="tight">
        <Container>
          <h2 id="grid-title" className="sr-only">
            Industry overview
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {industries.map((ind, i) => {
              const Icon = ind.icon;
              return (
                <li key={ind.slug}>
                  <a href={`#${ind.slug}`} data-reveal style={{ "--i": i % 4 } as CSSProperties} className="group flex h-full items-center gap-4 rounded-2xl border border-line p-5 transition-colors hover:border-brand/30 hover:bg-paper">
                    <Icon aria-hidden className="size-6 shrink-0 text-brand" />
                    <span className="font-medium">{ind.name}</span>
                    <ArrowRight aria-hidden className="ml-auto size-4 rotate-90 text-ink/25 transition-colors group-hover:text-brand" />
                  </a>
                </li>
              );
            })}
          </ul>
          <p data-reveal style={{ "--i": industries.length } as CSSProperties} className="mt-6 text-sm text-muted">These are target sectors and capability areas — not a list of past clients.</p>
        </Container>
      </Section>
      </ShowSection>
      <ShowSection page="industries" section="details">
      <IndustryGroup id="retail" eyebrow="Retail" title="E-commerce and retail" slugs={["ecommerce-retail"]} tone="paper" bySlug={bySlug} serviceMap={serviceMap} />
      {/* 4 */}
      <IndustryGroup id="hospitality" eyebrow="Hospitality" title="Restaurants and hospitality" slugs={["restaurants-hospitality"]} tone="white" bySlug={bySlug} serviceMap={serviceMap} />
      <IndustryGroup id="services" eyebrow="Services & property" title="Professional services and real estate" slugs={["professional-services", "real-estate"]} tone="paper" bySlug={bySlug} serviceMap={serviceMap} />
      <IndustryGroup id="regulated" eyebrow="Specialist sectors" title="Healthcare, education, financial services and startups" slugs={["healthcare", "education", "financial-services", "startups-saas"]} tone="white" bySlug={bySlug} serviceMap={serviceMap} />
      </ShowSection>
      <ShowSection page="industries" section="cta">
      <FinalCTA
        title="Tell us about the challenge in your industry."
        description="Describe how your business works today and where it gets stuck. We'll suggest where technology can help — and where it can't."
        primary={{ label: "Describe your challenge", href: "/contact" }}
        secondary={{ label: "See custom solutions", href: "/solutions" }}
      />
      </ShowSection>
    </>
  );
}
