import {
  Building2,
  Briefcase,
  GraduationCap,
  HeartPulse,
  Landmark,
  Rocket,
  ShoppingCart,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import type { ServiceSlug } from "@/types/service";

export interface Industry {
  slug: string;
  name: string;
  icon: LucideIcon;
  summary: string;
  challenges: string[];
  solutions: { title: string; description: string; service: ServiceSlug }[];
}

/**
 * Target industries and capability areas — NOT a list of past clients.
 */
export const industries: Industry[] = [
  {
    slug: "ecommerce-retail",
    name: "E-commerce & Retail",
    icon: ShoppingCart,
    summary: "Faster storefronts, connected inventory and marketing you can measure.",
    challenges: ["Slow product pages and checkout drop-off", "Inventory and orders spread across tools", "Unclear which campaigns drive sales"],
    solutions: [
      { title: "Performance-focused storefronts", description: "Product discovery and checkout designed for mobile shoppers.", service: "web-development" },
      { title: "Order & inventory sync", description: "Orders, stock and fulfilment kept consistent across systems.", service: "business-automation" },
      { title: "E-commerce tracking", description: "Reliable purchase data for Google and Meta campaigns.", service: "digital-marketing" },
      { title: "Product Q&A assistant", description: "Answers to sizing, shipping and returns questions from your policies.", service: "ai-solutions" },
    ],
  },
  {
    slug: "restaurants-hospitality",
    name: "Restaurants & Hospitality",
    icon: UtensilsCrossed,
    summary: "Bookings, reviews, local visibility and guest communication in one flow.",
    challenges: ["Reservations and enquiries across many channels", "Inconsistent local listings", "Manual guest follow-up"],
    solutions: [
      { title: "Booking & menu websites", description: "Fast mobile sites with reservations and up-to-date menus.", service: "web-development" },
      { title: "Local SEO", description: "Google Business Profile and location pages for nearby searches.", service: "digital-marketing" },
      { title: "Guest messaging", description: "Confirmations, reminders and post-visit review requests.", service: "business-automation" },
    ],
  },
  {
    slug: "professional-services",
    name: "Professional Services",
    icon: Briefcase,
    summary: "Credible websites, client intake and less administrative overhead.",
    challenges: ["Time spent on intake and scheduling", "Documents exchanged by email", "Difficult to show expertise online"],
    solutions: [
      { title: "Client intake workflows", description: "Forms, scheduling and onboarding steps that run consistently.", service: "business-automation" },
      { title: "Client portals", description: "Secure document exchange and project status in one place.", service: "web-development" },
      { title: "Document assistants", description: "Summaries and data extraction for review by your team.", service: "ai-solutions" },
    ],
  },
  {
    slug: "real-estate",
    name: "Real Estate",
    icon: Building2,
    summary: "Lead capture, qualification and follow-up that keeps pace with enquiries.",
    challenges: ["Enquiries from many portals in different formats", "Slow follow-up on new leads", "Listings managed in several places"],
    solutions: [
      { title: "Lead qualification", description: "Enquiries classified and routed to the right agent with a summary.", service: "ai-solutions" },
      { title: "CRM automation", description: "Follow-up sequences and viewing reminders managed automatically.", service: "business-automation" },
      { title: "Listing websites", description: "Searchable listings with clear enquiry paths.", service: "web-development" },
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    icon: HeartPulse,
    summary: "Patient-friendly booking and intake, designed around privacy requirements.",
    challenges: ["Phone-heavy booking", "Paper intake forms", "Strict data-handling obligations"],
    solutions: [
      { title: "Online booking & reminders", description: "Appointment flows that reduce manual calls.", service: "business-automation" },
      { title: "Accessible clinic websites", description: "Clear information on services, locations and preparation.", service: "web-development" },
      { title: "Local visibility", description: "Accurate listings and location pages for patients nearby.", service: "digital-marketing" },
    ],
  },
  {
    slug: "education",
    name: "Education",
    icon: GraduationCap,
    summary: "Enrolment journeys, learner communication and internal knowledge search.",
    challenges: ["Repetitive admissions questions", "Manual enrolment steps", "Information scattered across documents"],
    solutions: [
      { title: "Admissions assistant", description: "Answers to common questions from approved program information.", service: "ai-solutions" },
      { title: "Enrolment workflows", description: "Applications, reminders and document collection automated.", service: "business-automation" },
      { title: "Program websites", description: "Course pages that are easy to navigate and update.", service: "web-development" },
    ],
  },
  {
    slug: "startups-saas",
    name: "Startups & SaaS",
    icon: Rocket,
    summary: "MVPs, marketing sites and the internal tooling that helps teams scale.",
    challenges: ["Need to validate quickly", "Marketing site and product drifting apart", "Manual onboarding and ops"],
    solutions: [
      { title: "MVP development", description: "Focused first versions built on maintainable foundations.", service: "web-development" },
      { title: "Product AI features", description: "Practical AI features with evaluation and guardrails.", service: "ai-solutions" },
      { title: "Growth analytics", description: "Acquisition and activation tracking from day one.", service: "digital-marketing" },
    ],
  },
  {
    slug: "financial-services",
    name: "Financial Services",
    icon: Landmark,
    summary: "Secure portals, document processing and compliant client communication.",
    challenges: ["High volumes of documents", "Manual data entry into systems", "Strict security expectations"],
    solutions: [
      { title: "Document extraction", description: "Structured data from statements and forms, with human review.", service: "ai-solutions" },
      { title: "Client portals", description: "Secure access to documents and requests.", service: "web-development" },
      { title: "Process automation", description: "Onboarding and reporting steps with full audit trails.", service: "business-automation" },
    ],
  },
];

export function getIndustry(slug: string) {
  return industries.find((i) => i.slug === slug);
}
