import Link from "next/link";
import type { CSSProperties } from "react";
import { Check } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { getContent } from "@/content";
import { ShowSection } from "@/components/ui/ShowSection";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";
import { UIMockup } from "@/components/visuals/UIMockup";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { cn } from "@/lib/utils";
import type { VisualKind } from "@/types/project";

export const metadata = pageMetadata({
  title: "Services",
  description:
    "Explore Solvera's connected services: web development and custom software, AI solutions, business automation, and digital marketing — individually or combined.",
  path: "/services",
});

const visuals: Record<string, { kind: VisualKind; label: string }> = {
  "web-development": { kind: "storefront", label: "Illustration of a responsive storefront interface" },
  "ai-solutions": { kind: "chat", label: "Illustration of an AI assistant answering with cited sources" },
  "business-automation": { kind: "workflow", label: "Illustration of an automated booking workflow" },
  "digital-marketing": { kind: "analytics", label: "Illustration of a marketing report with sample data" },
};

export default async function ServicesPage() {
  const { services } = await getContent();
  return (
    <>
      <ShowSection page="services" section="hero">
      <PageHero
        breadcrumbs={[{ label: "Services", href: "/services" }]}
        eyebrow="Services"
        title="Connected capabilities for building, automating and growing."
        description="Choose a single service or combine several. Either way, we plan with the whole system in mind — so your website, tools and marketing work together."
        size="compact"
        actions={
          <ButtonLink href="/contact" size="lg" arrow>
            Discuss your project
          </ButtonLink>
        }
      >
        <nav aria-label="Jump to a service" className="enter mt-4 flex flex-wrap gap-2" style={{ "--i": 5 } as CSSProperties}>
          {services.map((s) => (
            <a key={s.slug} href={`#${s.slug}`} className="rounded-full border border-ink/15 bg-white/50 px-3.5 py-1.5 text-sm text-ink/75 transition-colors hover:border-brand/40 hover:text-brand-600">
              {s.title}
            </a>
          ))}
        </nav>
      </PageHero>
      </ShowSection>

      <ShowSection page="services" section="list">
      {services.map((s, i) => {
        const Icon = s.icon;
        const reversed = i % 2 === 1;
        return (
          <Section key={s.slug} id={s.slug} tone={i % 2 === 0 ? "white" : "paper"} labelledBy={`${s.slug}-title`} spacing="snug">
            <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
              <div className={cn("flex flex-col gap-6", reversed && "lg:order-2")}>
                <div data-reveal className="flex items-center gap-3">
                  <span className={cn("flex size-11 items-center justify-center rounded-xl", s.accent === "mint" ? "bg-mint-50 text-[#1f7a58]" : "bg-brand-50 text-brand")}>
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <span className="font-mono text-xs text-muted">0{i + 1} / 04</span>
                </div>
                <h2 id={`${s.slug}-title`} data-reveal className="text-heading font-semibold">
                  {s.title}
                </h2>
                <p data-reveal className="text-lead leading-relaxed text-muted">
                  {s.overview}
                </p>
                <div data-reveal>
                  <h3 className="text-sm font-semibold">Common use cases</h3>
                  <ul className="mt-3 grid gap-2.5">
                    {s.useCases.slice(0, 4).map((u) => (
                      <li key={u} className="flex gap-2.5 text-ink/80">
                        <Check aria-hidden className="mt-1 size-4 shrink-0 text-mint" />
                        {u}
                      </li>
                    ))}
                  </ul>
                </div>
                <div data-reveal className="flex flex-wrap gap-3 pt-2">
                  <ButtonLink href={s.href} arrow>
                    Explore {s.title}
                  </ButtonLink>
                </div>
              </div>
              <div data-reveal className={cn(reversed && "lg:order-1")}>
                <UIMockup kind={visuals[s.slug].kind} label={visuals[s.slug].label} className="aspect-[4/3] rounded-[1.75rem] border border-line" />
              </div>
            </Container>
          </Section>
        );
      })}

      {/* 6. How the services work together */}
      <Section tone="ink" labelledBy="together-title" spacing="snug" className="overflow-hidden">
        <div aria-hidden className="bg-grid-dark mask-radial absolute inset-0" />
        <Container className="relative">
          <SectionHeading
            tone="dark"
            eyebrow="Better together"
            id="together-title"
            title="How the services work together."
            description="A typical journey: a visitor finds you, makes contact, and becomes a customer — each step supported by a different capability."
          />
          <ol className="mt-14 grid gap-4 md:grid-cols-4">
            {[
              { s: "Digital Marketing", t: "Attract", d: "Search and campaigns bring qualified visitors to the right page." },
              { s: "Web Development", t: "Convert", d: "A fast, clear website turns interest into an inquiry or purchase." },
              { s: "AI Solutions", t: "Understand", d: "AI classifies requests and drafts helpful first responses." },
              { s: "Business Automation", t: "Follow through", d: "Workflows update the CRM, schedule follow-ups and report results." },
            ].map((step, i) => (
              <li key={step.t} data-reveal style={{ "--i": i } as CSSProperties} className="relative rounded-[var(--radius-card)] border border-white/10 bg-white/[0.03] p-6">
                <span className="font-mono text-xs text-brand-300">{step.s}</span>
                <h3 className="mt-4 text-card font-semibold text-white">{step.t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{step.d}</p>
                {i < 3 && <span aria-hidden className="absolute -right-3 top-1/2 hidden size-6 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-ink text-xs text-white/60 md:flex">→</span>}
              </li>
            ))}
          </ol>
          <p data-reveal className="mt-10 max-w-2xl text-white/65">
            Not sure where to start? Our{" "}
            <Link href="/solutions" className="font-medium text-white underline decoration-brand/70 underline-offset-4 hover:decoration-brand">
              custom solutions
            </Link>{" "}
            page starts from the business problem instead of the service category.
          </p>
        </Container>
      </Section>

      </ShowSection>
      <ShowSection page="services" section="cta">
      <FinalCTA title="Tell us what you need — we'll recommend the right mix." secondary={{ label: "See custom solutions", href: "/solutions" }} />
      </ShowSection>
    </>
  );
}
