import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconLink } from "@/components/ui/IconLink";
import { ServiceOverviewCarousel } from "./ServiceOverviewCarousel";

export function ServicesOverview() {
  return (
    <Section tone="paper" labelledBy="services-overview-title">
      <Container>
        <SectionHeading
          eyebrow="Services"
          id="services-overview-title"
          title="Everything You Need to Build, Automate, and Grow."
          description="Four connected capabilities. Use one, or combine them into a single solution."
          action={<IconLink href="/services">All services</IconLink>}
        />
        <ServiceOverviewCarousel />
      </Container>
    </Section>
  );
}
