import "server-only";

import { cache } from "react";
import { articles as staticArticles, articleCategories, getRelatedArticles as relateArticles, getTableOfContents, readingTime } from "@/data/articles";
import { contactFaqs as staticContactFaqs, faqGroups as staticFaqGroups } from "@/data/faqs";
import { industries as staticIndustries, type Industry } from "@/data/industries";
import { detailedPhases as staticDetailedPhases, processPhases as staticProcessPhases, type DetailedPhase, type ProcessPhase } from "@/data/process";
import { projects as staticProjects } from "@/data/projects";
import { services as staticServices } from "@/data/services";
import { testimonials as staticTestimonials, type Testimonial } from "@/data/testimonials";
import type { Article } from "@/types/article";
import type { Project } from "@/types/project";
import type { FAQItem, Service, ServiceSlug } from "@/types/service";

export type SiteContent = {
  services: Service[];
  projects: Project[];
  articles: Article[];
  industries: Industry[];
  testimonials: Testimonial[];
  processPhases: ProcessPhase[];
  detailedPhases: DetailedPhase[];
  faqGroups: typeof staticFaqGroups;
  contactFaqs: FAQItem[];
};

export function contentMode(): "static" | "dynamic" {
  return process.env.CONTENT_MODE === "dynamic" ? "dynamic" : "static";
}

function staticContent(): SiteContent {
  return {
    services: staticServices,
    projects: staticProjects,
    articles: staticArticles,
    industries: staticIndustries,
    testimonials: staticTestimonials,
    processPhases: staticProcessPhases,
    detailedPhases: staticDetailedPhases,
    faqGroups: staticFaqGroups,
    contactFaqs: staticContactFaqs,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeServices(remote: unknown, local: Service[]): Service[] {
  if (!Array.isArray(remote)) return local;
  const bySlug = new Map(local.map((service) => [service.slug, service]));
  const merged = remote.flatMap((item) => {
    if (!isRecord(item) || typeof item.slug !== "string") return [];
    const base = bySlug.get(item.slug as ServiceSlug);
    if (!base) return [];
    const offerings = Array.isArray(item.offerings)
      ? item.offerings.flatMap((offering) => {
          if (!isRecord(offering) || typeof offering.title !== "string") return [];
          const match = base.offerings.find((entry) => entry.title === offering.title);
          return [{ ...(match ?? {}), ...offering, icon: match?.icon }];
        })
      : base.offerings;
    const benefits = Array.isArray(item.benefits)
      ? item.benefits.flatMap((benefit) => {
          if (!isRecord(benefit) || typeof benefit.title !== "string") return [];
          const match = base.benefits.find((entry) => entry.title === benefit.title);
          return [{ ...(match ?? {}), ...benefit, icon: match?.icon }];
        })
      : base.benefits;
    return [{ ...base, ...item, icon: base.icon, href: base.href, offerings, benefits, faqs: Array.isArray(item.faqs) ? (item.faqs as FAQItem[]) : base.faqs }];
  });
  return merged.length ? (merged as Service[]) : local;
}

function mergeIndustries(remote: unknown, local: Industry[]): Industry[] {
  if (!Array.isArray(remote)) return local;
  const bySlug = new Map(local.map((industry) => [industry.slug, industry]));
  const merged = remote.flatMap((item) => {
    if (!isRecord(item) || typeof item.slug !== "string") return [];
    const base = bySlug.get(item.slug);
    if (!base) return [];
    return [{ ...base, ...item, icon: base.icon, challenges: Array.isArray(item.challenges) ? (item.challenges as string[]) : base.challenges, solutions: Array.isArray(item.solutions) ? (item.solutions as Industry["solutions"]) : base.solutions }];
  });
  return merged.length ? merged : local;
}

function replaceList<T extends { slug: string }>(remote: unknown, local: T[]): T[] {
  if (!Array.isArray(remote)) return local;
  const rows = remote.filter((item): item is T => isRecord(item) && typeof item.slug === "string");
  return rows.length ? rows : local;
}

function replaceFaqs(remote: unknown, local: FAQItem[]): FAQItem[] {
  if (!Array.isArray(remote)) return local;
  const rows = remote.filter((item): item is FAQItem => isRecord(item) && typeof item.question === "string" && typeof item.answer === "string");
  return rows.length ? rows : local;
}

async function loadDynamic(): Promise<SiteContent> {
  const endpoint = process.env.CONTENT_API_URL?.trim();
  if (!endpoint) throw new Error("CONTENT_MODE is dynamic, but CONTENT_API_URL is empty.");
  const headers = new Headers({ accept: "application/json" });
  const token = process.env.CONTENT_API_TOKEN?.trim();
  if (token) headers.set("authorization", `Bearer ${token}`);
  const response = await fetch(endpoint, { headers, next: { revalidate: 120, tags: ["content"] } });
  if (!response.ok) throw new Error(`Content API responded with ${response.status}.`);
  const payload: unknown = await response.json();
  const data = isRecord(payload) ? payload : {};
  const base = staticContent();
  return {
    services: mergeServices(data.services, base.services),
    projects: replaceList(data.projects, base.projects),
    articles: replaceList(data.articles, base.articles),
    industries: mergeIndustries(data.industries, base.industries),
    testimonials: Array.isArray(data.testimonials) ? (data.testimonials as Testimonial[]) : base.testimonials,
    processPhases: Array.isArray(data.processPhases) ? (data.processPhases as ProcessPhase[]) : base.processPhases,
    detailedPhases: Array.isArray(data.detailedPhases) ? (data.detailedPhases as DetailedPhase[]) : base.detailedPhases,
    faqGroups: Array.isArray(data.faqGroups) ? (data.faqGroups as SiteContent["faqGroups"]) : base.faqGroups,
    contactFaqs: replaceFaqs(data.contactFaqs, base.contactFaqs),
  };
}

/** One read per request. Static mode uses the files in src/data. Dynamic mode reads CONTENT_API_URL. */
export const getContent = cache(async (): Promise<SiteContent> => {
  if (contentMode() === "dynamic") return loadDynamic();
  return staticContent();
});

export async function getService(slug: ServiceSlug) {
  const { services } = await getContent();
  const service = services.find((item) => item.slug === slug);
  if (!service) throw new Error(`Unknown service: ${slug}`);
  return service;
}

export async function getServiceMap() {
  const { services } = await getContent();
  return Object.fromEntries(services.map((service) => [service.slug, service])) as Record<ServiceSlug, Service>;
}

export { articleCategories, getTableOfContents, readingTime, relateArticles };
