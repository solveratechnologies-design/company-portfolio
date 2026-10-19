import { BarChart3, Brain, ClipboardList, MessageSquareText, Users } from "lucide-react";
import { WorkflowDiagram, type WorkflowStep } from "@/components/visuals/WorkflowDiagram";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";

const steps: WorkflowStep[] = [
  { title: "Form Submission", description: "A prospect submits an inquiry on your website.", icon: ClipboardList, kind: "trigger" },
  { title: "AI Classification", description: "The request is categorized by service, urgency and fit.", icon: Brain, kind: "ai" },
  { title: "CRM Update", description: "A contact and deal are created and assigned to the right person.", icon: Users, kind: "action" },
  { title: "Follow-up Message", description: "A tailored acknowledgment is sent, with a booking link.", icon: MessageSquareText, kind: "action" },
  { title: "Reporting Dashboard", description: "Volumes, sources and response times update automatically.", icon: BarChart3, kind: "action" },
];

export function AutomationSpotlight() {
  return (
    <Section tone="ink" labelledBy="automation-spotlight-title" className="overflow-hidden">
      <div aria-hidden className="bg-grid-dark mask-radial absolute inset-0" />
      <div aria-hidden className="absolute -left-40 top-1/3 size-[520px] rounded-full bg-brand/20 blur-[140px]" />
      <Container className="relative">
        <SectionHeading
          tone="dark"
          eyebrow="AI & automation"
          id="automation-spotlight-title"
          title="One inquiry. Five connected steps. No manual handoffs."
          description="An example of how an intelligent workflow connects the systems you already use — with people stepping in where judgement is needed."
        />
        <div className="mt-16 rounded-[1.75rem] border border-white/10 bg-white/[0.02] p-6 md:p-10">
          <WorkflowDiagram steps={steps} label="Example workflow from form submission to reporting" />
        </div>
        <div data-reveal className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <p className="text-sm font-medium text-white/70">Explore AI &amp; Automation:</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/services/ai-solutions" arrow>
              AI Solutions
            </ButtonLink>
            <ButtonLink href="/services/business-automation" variant="outline-light" arrow>
              Business Automation
            </ButtonLink>
          </div>
        </div>
      </Container>
    </Section>
  );
}
