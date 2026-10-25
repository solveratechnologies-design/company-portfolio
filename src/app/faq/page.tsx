import { pageMetadata, faqJsonLd } from "@/lib/seo";
import { getContent } from "@/content";
import { ShowSection } from "@/components/ui/ShowSection";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { Accordion } from "@/components/ui/Accordion";
import { JsonLd } from "@/components/ui/JsonLd";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata = pageMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers about working with Solvera, web development timelines and handover, AI privacy and accuracy, automation tools, and digital marketing measurement.",
  path: "/faq",
});

export default async function FAQPage() {
  const { faqGroups } = await getContent();
  return (
    <>
      <JsonLd data={faqJsonLd(faqGroups.flatMap((g) => g.items))} />
      <ShowSection page="faq" section="hero">
      <PageHero
        breadcrumbs={[{ label: "FAQ", href: "/faq" }]}
        eyebrow="FAQ"
        title="Questions, answered clearly."
        description="If you don't find what you're looking for, ask us directly — we're happy to help."
        size="compact"
      >
        <nav aria-label="FAQ categories" className="flex flex-wrap gap-2">
          {faqGroups.map((g) => (
            <a key={g.id} href={`#${g.id}`} className="rounded-full border border-ink/15 bg-white/50 px-3.5 py-1.5 text-sm text-ink/75 transition-colors hover:border-brand/40 hover:text-brand-600">
              {g.title}
            </a>
          ))}
        </nav>
      </PageHero>
      </ShowSection>
      <ShowSection page="faq" section="list">
      {faqGroups.map((g, i) => (
        <Section key={g.id} id={g.id} tone={i % 2 === 0 ? "white" : "paper"} labelledBy={`${g.id}-title`} className="py-10! md:py-20!">
          <Container className="grid gap-10 lg:grid-cols-[1fr_1.8fr]">
            <div data-reveal>
              <p className="font-mono text-xs text-muted">0{i + 1}</p>
              <h2 id={`${g.id}-title`} className="mt-3 text-[1.9rem] font-semibold tracking-tight">
                {g.title}
              </h2>
              <p className="mt-2 text-muted">{g.description}</p>
            </div>
            <Accordion items={g.items} />
          </Container>
        </Section>
      ))}
      </ShowSection>
      <ShowSection page="faq" section="cta">
      <FinalCTA title="Still have a question?" description="Send us a short message and we'll get back to you." primary={{ label: "Contact us", href: "/contact" }} secondary={{ label: "Our process", href: "/process" }} />
      </ShowSection>
    </>
  );
}
