import { getContent } from "@/content";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconLink } from "@/components/ui/IconLink";
import { ServiceOverviewCarousel } from "./ServiceOverviewCarousel";

export async function ServicesOverview() {
  const { services } = await getContent();
  return (
    <Section tone="paper" labelledBy="services-overview-title" spacing="compact">
      <Container>
        <SectionHeading
          eyebrow="Services"
          id="services-overview-title"
          title="Everything You Need to Build, Automate, and Grow."
          description="Four connected capabilities. Use one, or combine them into a single solution."
          action={<IconLink href="/services">All services</IconLink>}
        />
        <ServiceOverviewCarousel
          services={services.map(({ slug, title, href, summary, accent, offerings }) => ({
            slug,
            title,
            href,
            summary,
            accent,
            offerings: offerings.map((offering) => ({ title: offering.title })),
          }))}
        />
      </Container>
    </Section>
  );
}
