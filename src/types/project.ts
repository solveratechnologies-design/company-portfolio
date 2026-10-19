import type { ServiceSlug } from "./service";

export type ProjectCategory =
  | "Web Development"
  | "Custom Software"
  | "AI Solutions"
  | "Business Automation"
  | "Digital Marketing";

/**
 * concept   — a designed solution scenario, not commissioned by a client
 * prototype — an internal build used to test an approach
 * client    — verified, commissioned client work (results allowed)
 */
export type ProjectStatus = "concept" | "prototype" | "client";

export type VisualKind =
  | "dashboard"
  | "chat"
  | "storefront"
  | "workflow"
  | "analytics"
  | "pipeline"
  | "document"
  | "portal";

export interface ProjectVisualSpec {
  kind: VisualKind;
  caption: string;
  /** Optional real screenshot in /public/images/projects. Rendered with next/image when present. */
  image?: { src: string; width: number; height: number; alt: string };
}

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  status: ProjectStatus;
  featured: boolean;
  services: ServiceSlug[];
  summary: string;
  problem: string;
  goals: string[];
  constraints: string[];
  solution: string;
  approach: { title: string; description: string }[];
  technologies: string[];
  cover: ProjectVisualSpec;
  gallery: ProjectVisualSpec[];
  /** Only for verified client work. Never populate with estimates. */
  results?: string[];
  lessons: string[];
}
