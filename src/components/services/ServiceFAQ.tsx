import type { FAQItem } from "@/types/service";
import { Accordion } from "@/components/ui/Accordion";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { JsonLd } from "@/components/ui/JsonLd";
import { faqJsonLd } from "@/lib/seo";
import { IconLink } from "@/components/ui/IconLink";

export function ServiceFAQ({ items, title = "Frequently asked questions", description, id = "faq", tone = "white" }: { items: FAQItem[]; title?: string; description?: string; id?: string; tone?: "white" | "paper" }) {
  return (
    <Section id={id} tone={tone} labelledBy={`${id}-title`} spacing="snug">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div className="flex flex-col gap-6">
          <SectionHeading eyebrow="FAQ" id={`${id}-title`} title={title} description={description} />
          <IconLink href="/faq">See all FAQs</IconLink>
        </div>
        <Accordion items={items} />
      </Container>
      <JsonLd data={faqJsonLd(items)} />
    </Section>
  );
}
