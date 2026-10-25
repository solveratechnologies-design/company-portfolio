import type { CSSProperties } from "react";
import Link from "next/link";
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
import { cn } from "@/lib/utils";

export const metadata = pageMetadata({
  title: "Industries",
  description:
    "How web development, AI, automation and digital marketing apply to e-commerce, hospitality, professional services, real estate, healthcare, education, SaaS and financial services.",
  path: "/industries",
});

function IndustryDetail({ industry, tone = "white", serviceMap }: { industry: Industry; tone?: "white" | "paper"; serviceMap: Record<ServiceSlug, Service> }) {
  const Icon = industry.icon;
  return (
    <article id={industry.slug} className={cn("industry-card scroll-mt-28 rounded-[1.5rem] border border-line p-6 transition-[border-color,box-shadow] md:p-9", tone === "paper" ? "bg-white" : "bg-paper/60")}>
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
        <div>
          <h4 className="text-sm font-semibold">Possible solutions</h4>
          <ul className="mt-3 grid gap-3 sm:grid-cols-2">
            {industry.solutions.map((s) => (
              <li key={s.title}>
                <Link href={serviceMap[s.service].href} className="group flex h-full flex-col rounded-2xl border border-line bg-white p-5 transition-colors hover:border-brand/30">
                  <span className="font-medium group-hover:text-brand">{s.title}</span>
                  <span className="mt-1.5 text-sm leading-relaxed text-muted">{s.description}</span>
                  <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-medium text-brand">
                    {serviceMap[s.service].title}
                    <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </article>
  );
}

function IndustryGroup({ id, eyebrow, title, slugs, tone, bySlug, serviceMap }: { id: string; eyebrow: string; title: string; slugs: string[]; tone: "white" | "paper"; bySlug: Map<string, Industry>; serviceMap: Record<ServiceSlug, Service> }) {
  return (
    <Section tone={tone} labelledBy={`${id}-title`}>
      <Container>
        <SectionHeading eyebrow={eyebrow} id={`${id}-title`} title={title} />
        <div className="mt-12 flex flex-col gap-6">
          {slugs.map((slug) => {
            const ind = bySlug.get(slug);
            return ind ? <IndustryDetail key={slug} industry={ind} tone={tone} serviceMap={serviceMap} /> : null;
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
      />
      </ShowSection>
      <ShowSection page="industries" section="list">
      <Section labelledBy="grid-title">
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
          <p className="mt-6 text-sm text-muted">These are target sectors and capability areas — not a list of past clients.</p>
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
