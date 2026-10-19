import type { FAQItem } from "@/types/service";
import { serviceMap } from "./services";

export interface FAQGroup {
  id: string;
  title: string;
  description: string;
  items: FAQItem[];
}

export const generalFaqs: FAQItem[] = [
  { question: "What kinds of businesses do you work with?", answer: "We work with startups, small and medium-sized businesses, and growing companies that want to improve how they attract customers, serve them, or run their operations. Projects range from a single website or workflow to connected systems across several tools." },
  { question: "Do you work with international clients?", answer: "Yes. We work remotely, communicate in English, and plan meetings across time zones. Most collaboration happens through scheduled calls, shared project boards and written updates." },
  { question: "How do projects usually start?", answer: "With a short conversation about what you are trying to achieve. If there is a good fit, we run a discovery step to understand the details, then share a written scope, timeline and estimate for your approval." },
  { question: "How do you price projects?", answer: "Most projects are priced against an agreed scope. Ongoing work such as maintenance, marketing or support is usually a monthly arrangement. We explain what drives cost and agree everything in writing before work begins." },
  { question: "Can you work with our existing team or vendors?", answer: "Yes. We regularly work alongside in-house teams and other providers, and agree responsibilities early so there is no confusion about who does what." },
];

export const contactFaqs: FAQItem[] = [
  { question: "What should I include in my inquiry?", answer: "A short description of what you want to achieve, any tools or systems involved, and your preferred timeline. If you are not sure which service you need, choose “Not sure yet” — we will help you work it out." },
  { question: "Is the first conversation a sales call?", answer: "It is a working conversation. We ask questions to understand the problem and share initial thoughts on approach. If we are not the right fit, we will say so." },
  { question: "How soon can a project start?", answer: "It depends on scope and current commitments. We confirm a realistic start date when we share the proposal." },
  { question: "Do you sign NDAs?", answer: "Yes. If you need to share confidential information before we discuss details, we can sign a mutual NDA." },
];

export const faqGroups: FAQGroup[] = [
  { id: "general", title: "General", description: "Working with Solvera, pricing and getting started.", items: generalFaqs },
  { id: "web-development", title: "Web Development", description: "Timelines, scope, revisions and handover.", items: serviceMap["web-development"].faqs },
  {
    id: "ai-automation",
    title: "AI & Automation",
    description: "Data privacy, accuracy, tools and maintenance.",
    items: [...serviceMap["ai-solutions"].faqs, ...serviceMap["business-automation"].faqs],
  },
  { id: "digital-marketing", title: "Digital Marketing", description: "Deliverables, measurement and results.", items: serviceMap["digital-marketing"].faqs },
];
