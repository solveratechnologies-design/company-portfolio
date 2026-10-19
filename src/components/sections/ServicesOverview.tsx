import { services } from "@/data/services";
import { ServiceCard } from "@/components/services/ServiceCard";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { IconLink } from "@/components/ui/IconLink";

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
        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {services.map((s, i) => (
            <li key={s.slug}>
              <ServiceCard service={s} index={i} />
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
