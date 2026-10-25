import type { CSSProperties } from "react";
import { getService } from "@/content";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";
import { JsonLd } from "@/components/ui/JsonLd";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceFeatureGrid } from "@/components/services/ServiceFeatureGrid";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { ProcessSteps, ServiceOverviewBlock } from "@/components/services/ServiceBlocks";
import { UIMockup } from "@/components/visuals/UIMockup";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Badge } from "@/components/ui/Badge";

export const metadata = pageMetadata({
  title: "Digital Marketing, SEO & Paid Campaigns",
  description:
    "Technical and local SEO, Google Business Profile, Google and Meta Ads, content strategy and analytics — connected into one measurable growth system.",
  path: "/services/digital-marketing",
});

const strategy = [
  { title: "Research", description: "Your market, competitors, search demand and current performance." },
  { title: "Positioning", description: "What makes your offer the right choice — and how to say it clearly." },
  { title: "Audience definition", description: "Who you want to reach, what they search for, and where they spend time." },
  { title: "Campaign planning", description: "Channels, budgets, messages and landing pages aligned to goals." },
  { title: "Measurement", description: "Conversion tracking and reporting agreed before spend increases." },
];

const funnel = [
  { label: "Visibility", sub: "Search & ads impressions", w: "100%" },
  { label: "Traffic", sub: "Visitors to relevant pages", w: "78%" },
  { label: "Conversion", sub: "Enquiries, bookings, sales", w: "52%" },
  { label: "Growth", sub: "Customers & repeat business", w: "34%" },
];

export default async function DigitalMarketingPage() {
  const service = await getService("digital-marketing");
  return (
    <>
      <JsonLd data={serviceJsonLd(service)} />
      {/* 1 */}
      <ServiceHero
        service={service}
        title="Build a Stronger Digital Presence. Generate Better Opportunities."
        description="Search, campaigns, content and analytics connected into one measurable system — so you know where enquiries come from and what to improve next."
        ctaLabel="Discuss your goals"
        aside={<UIMockup kind="analytics" label="Illustrative marketing report showing enquiries by channel (sample data)" className="aspect-[4/3] rounded-[1.75rem] border border-white/10" />}
      />
      {/* 2 */}
      <ServiceOverviewBlock title="Visibility → traffic → conversion → growth." useCases={service.useCases} useCasesTitle="We can help you…">
        <p>{service.overview}</p>
        <div aria-label="Marketing funnel" role="list" className="mt-2 flex flex-col gap-2">
          {funnel.map((f) => (
            <div role="listitem" key={f.label} className="flex items-center gap-4">
              <div className="h-10 rounded-lg bg-gradient-to-r from-brand to-mint/80" style={{ width: f.w, maxWidth: "60%" }} />
              <div className="text-base">
                <span className="font-semibold text-ink">{f.label}</span>
                <span className="block text-sm text-muted">{f.sub}</span>
              </div>
            </div>
          ))}
        </div>
      </ServiceOverviewBlock>
      {/* 3 */}
      <Section tone="paper" labelledBy="categories-title">
        <Container>
          <SectionHeading eyebrow="Service categories" id="categories-title" title="Channels and capabilities" />
          <div className="mt-14">
            <ServiceFeatureGrid items={service.offerings} columns={3} tone="paper" />
          </div>
        </Container>
      </Section>
      {/* 4 */}
      <ProcessSteps id="strategy" steps={strategy} eyebrow="Marketing strategy" title="Strategy before spend." description="Every campaign starts with the same groundwork, scaled to your size and budget." tone="white" />
      {/* 5 */}
      <Section tone="ink" labelledBy="visuals-title" className="overflow-hidden">
        <div aria-hidden className="bg-grid-dark mask-radial absolute inset-0" />
        <Container className="relative">
          <SectionHeading
            tone="dark"
            eyebrow="Campaign & analytics"
            id="visuals-title"
            title="Reporting you can act on."
            description="Example report layouts. All figures shown are illustrative sample data, not client results."
          />
          <div className="mt-14 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <figure data-reveal className="overflow-hidden rounded-[1.5rem] border border-white/10">
              <UIMockup kind="analytics" label="Sample enquiries-by-channel chart (illustrative data)" className="aspect-[16/10]" />
              <figcaption className="flex items-center justify-between gap-3 bg-white/[0.03] px-5 py-3 text-sm text-white/65">
                Enquiries by channel <Badge tone="dark">Sample data</Badge>
              </figcaption>
            </figure>
            <figure data-reveal style={{ "--i": 1 } as CSSProperties} className="flex flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-6">
              <figcaption className="flex items-center justify-between gap-3 text-sm text-white/65">
                Monthly summary <Badge tone="dark">Sample data</Badge>
              </figcaption>
              <dl className="mt-6 grid flex-1 grid-cols-2 gap-3">
                {[
                  ["Qualified enquiries", "—"],
                  ["Cost per enquiry", "—"],
                  ["Conversion rate", "—"],
                  ["Top channel", "—"],
                ].map(([k]) => (
                  <div key={k} className="rounded-xl border border-white/10 p-4">
                    <dt className="text-xs text-white/55">{k}</dt>
                    <dd className="mt-3 h-2 w-2/3 rounded-full bg-white/15" aria-label="Placeholder value" />
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-sm leading-relaxed text-white/60">Each report closes with what we learned and the next three actions — not just numbers.</p>
            </figure>
          </div>
        </Container>
      </Section>
      {/* 6 */}
      <ProcessSteps id="optimization" steps={service.process} eyebrow="Optimization" title="A continuous improvement loop." description="Research, launch, monitor, analyze, improve — then repeat with better information." />
      {/* 7 */}
      <ServiceFAQ items={service.faqs} title="Marketing questions" description="Deliverables, measurement, reporting — and the factors that affect results." />
      {/* 8 */}
      <FinalCTA
        eyebrow="Digital marketing"
        title="Discuss Your Marketing Goals."
        description="Tell us where you want to grow and how you currently measure results. We'll suggest a practical starting point."
        primary={{ label: "Start a conversation", href: "/contact?service=Digital%20Marketing" }}
        secondary={{ label: "Read: tracking before ad spend", href: "/insights/conversion-tracking-before-ad-spend" }}
      />
    </>
  );
}
