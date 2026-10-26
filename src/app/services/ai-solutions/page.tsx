import type { CSSProperties } from "react";
import { BookOpenCheck, Brain, Database, FileSearch, MessageSquare, MessagesSquare, ShieldAlert, UserCheck, Users } from "lucide-react";
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
import { WorkflowDiagram, type WorkflowStep } from "@/components/visuals/WorkflowDiagram";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata = pageMetadata({
  title: "AI Solutions & AI Agents",
  description:
    "Practical AI assistants, conversational agents, retrieval-augmented generation and document processing — evaluated against your real examples and integrated with clear safeguards.",
  path: "/services/ai-solutions",
});

const useCases = [
  { title: "Customer support", description: "Answer common questions from your help content and hand complex or sensitive issues to a person.", icon: MessagesSquare },
  { title: "Lead qualification", description: "Classify incoming enquiries, ask for missing details, and route qualified leads with a summary.", icon: UserCheck },
  { title: "Internal knowledge search", description: "Let staff ask questions in plain language and get answers with links to the source documents.", icon: BookOpenCheck },
  { title: "Document extraction", description: "Turn invoices, forms and PDFs into structured data, with low-confidence fields flagged for review.", icon: FileSearch },
  { title: "Reporting assistance", description: "Draft summaries of activity, tickets or sales data for a person to check and share.", icon: MessageSquare },
];

const integrations = [
  { name: "CRM", detail: "Create and update contacts, deals and notes." },
  { name: "Databases", detail: "Read approved data with scoped, read-only access where possible." },
  { name: "Communication platforms", detail: "Email, chat widgets, Slack and messaging apps." },
  { name: "Business applications", detail: "Helpdesks, document storage and internal tools via APIs." },
];

const demo: WorkflowStep[] = [
  { title: "Customer request", description: "“Can I change the delivery date on my order?” arrives via chat.", icon: MessageSquare, kind: "trigger" },
  { title: "Classification", description: "Intent identified as an order change; no sensitive data involved.", icon: Brain, kind: "ai" },
  { title: "Retrieve & draft", description: "Relevant policy passages retrieved; an answer is drafted with sources.", icon: Database, kind: "ai" },
  { title: "Check boundaries", description: "Refunds, complaints or low confidence are routed to a person instead.", icon: ShieldAlert, kind: "action" },
  { title: "Respond or hand over", description: "The customer gets a cited answer — or a team member picks up with full context.", icon: Users, kind: "human" },
];

export default async function AISolutionsPage() {
  const service = await getService("ai-solutions");
  return (
    <>
      <JsonLd data={serviceJsonLd(service)} />
      {/* 1 */}
      <ServiceHero
        service={service}
        title="Turn AI Into a Practical Business Advantage."
        description="AI assistants, agents and document processing designed around specific tasks — grounded in your content, tested on your examples, and built with human oversight where it matters."
        ctaLabel="Explore an AI solution"
        aside={<UIMockup kind="chat" label="Illustration of an AI assistant answering with cited sources and handing over to a person" className="aspect-[4/3] rounded-[1.75rem] border border-white/10" />}
      />
      {/* 2 */}
      <ServiceOverviewBlock eyebrow="AI capabilities" title="Useful AI, with clear boundaries." useCases={service.useCases} useCasesTitle="Where AI typically helps">
        <p>{service.overview}</p>
        <p className="text-muted">
          We are explicit about the difference between <strong className="font-medium text-ink">AI-assisted</strong> work — where
          AI drafts, suggests or classifies and a person decides — and <strong className="font-medium text-ink">automated actions</strong>,
          which we reserve for low-risk tasks with a proven track record.
        </p>
      </ServiceOverviewBlock>
      <Section tone="paper" labelledBy="capabilities-title" spacing="snug" className="pt-0! md:pt-0!">
        <Container>
          <h2 id="capabilities-title" className="sr-only">
            AI capabilities
          </h2>
          <ServiceFeatureGrid items={service.offerings} columns={3} tone="paper" />
        </Container>
      </Section>
      {/* 3 */}
      <Section labelledBy="usecases-title" spacing="snug">
        <Container>
          <SectionHeading eyebrow="Business use cases" id="usecases-title" title="Start with a task, not a technology." description="Each of these begins as a specific, measurable problem — and stays scoped to it." />
          <div className="mt-14">
            <ServiceFeatureGrid items={useCases} columns={3} numbered />
          </div>
        </Container>
      </Section>
      {/* 4 */}
      <Section tone="paper" labelledBy="fit-title" spacing="snug">
        <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading
            eyebrow="Integration"
            id="fit-title"
            title="How AI fits into your existing systems."
            description="AI is most useful when it works inside the tools your team already uses — with access limited to what each task requires."
          />
          <ul className="grid gap-3 sm:grid-cols-2">
            {integrations.map((it, i) => (
              <li key={it.name} data-reveal style={{ "--i": i } as CSSProperties} className="rounded-2xl border border-line bg-white p-5">
                <p className="font-semibold">{it.name}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{it.detail}</p>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
      {/* 5 */}
      <Section tone="ink" labelledBy="demo-title" spacing="snug" className="overflow-hidden">
        <div aria-hidden className="bg-grid-dark mask-radial absolute inset-0" />
        <Container className="relative">
          <SectionHeading
            tone="dark"
            eyebrow="Workflow demonstration"
            id="demo-title"
            title="Following one request through an AI assistant."
            description="An illustrative example. Each stage is labeled as AI-assisted, automated, or handled by a person."
          />
          <div className="mt-14 rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-6 md:p-10">
            <WorkflowDiagram steps={demo} label="AI request handling example" />
          </div>
        </Container>
      </Section>
      {/* 6 */}
      <ProcessSteps steps={service.process} eyebrow="Implementation" title="Our implementation approach" description="From choosing the right problem to monitoring quality after launch." tone="white" spacing="snug" />
      {/* 7 */}
      <ServiceFAQ tone="paper" items={service.faqs} title="AI questions, answered plainly" description="Privacy, accuracy, integrations, cost factors and maintenance." />
      {/* 8 */}
      <FinalCTA
        eyebrow="AI solutions"
        title="Explore an AI Solution for Your Business."
        description="Tell us about a repetitive task or a question your team answers every day. We'll help you judge whether AI is a good fit."
        primary={{ label: "Start a conversation", href: "/contact?service=AI%20Solutions" }}
        secondary={{ label: "Read: AI in everyday workflows", href: "/insights/introducing-ai-into-everyday-workflows" }}
      />
    </>
  );
}
