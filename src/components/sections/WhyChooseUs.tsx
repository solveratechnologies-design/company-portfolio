import { Briefcase, Network, PencilRuler, ShieldCheck } from "lucide-react";
import { ServiceFeatureGrid } from "@/components/services/ServiceFeatureGrid";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const values = [
  { icon: Briefcase, title: "Business-First Thinking", description: "We start with the outcome you need — more enquiries, less admin, clearer data — and choose technology to serve it. If a simpler option will do the job, we'll recommend it." },
  { icon: PencilRuler, title: "Tailored Solutions", description: "Every business works differently. We design around your processes, customers and constraints instead of forcing a one-size-fits-all package." },
  { icon: Network, title: "Connected Systems", description: "Websites, CRMs, AI tools and analytics should share information. We plan integrations from the start so your tools work as one system." },
  { icon: ShieldCheck, title: "Long-Term Maintainability", description: "Clean code, documented workflows and full handover of access mean you're never locked in — and your solution stays easy to improve." },
];

export function WhyChooseUs() {
  return (
    <Section labelledBy="why-title">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.5fr] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading
            eyebrow="Why Solvera"
            id="why-title"
            title="A Better Way to Build Digital Solutions."
            description="Practical thinking, clear communication and work that's built to last."
          />
        </div>
        <ServiceFeatureGrid items={values} columns={2} numbered />
      </Container>
    </Section>
  );
}
