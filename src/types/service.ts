import type { LucideIcon } from "lucide-react";

export type ServiceSlug =
  | "web-development"
  | "ai-solutions"
  | "business-automation"
  | "digital-marketing";

export interface ServiceItem {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Service {
  slug: ServiceSlug;
  title: string;
  href: `/services/${ServiceSlug}`;
  icon: LucideIcon;
  /** One line, used in menus. */
  menuDescription: string;
  /** Card-length description. */
  summary: string;
  /** Longer overview paragraph. */
  overview: string;
  useCases: string[];
  offerings: ServiceItem[];
  benefits: ServiceItem[];
  process: ServiceItem[];
  faqs: FAQItem[];
  accent: "brand" | "mint";
}
