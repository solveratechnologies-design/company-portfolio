/**
 * Show or hide a section by setting its flag to false.
 * An entry in HIDDEN_SECTIONS (see .env.example) hides it even when the flag is true.
 * Format: page:section  e.g. home:testimonials,about:process
 */
export const sectionVisibility = {
  home: {
    hero: true,
    capabilities: true,
    about: true,
    services: true,
    work: false,
    automation: true,
    why: true,
    industries: true,
    process: true,
    testimonials: false,
    insights: true,
    cta: true,
  },
  services: { hero: true, list: true, cta: true },
  work: { hero: true, portfolio: true, stack: true, cta: true },
  insights: { hero: true, featured: true, list: true, cta: true },
  about: { hero: true, services: true, process: true, cta: true },
  industries: { hero: true, list: true, details: true, cta: true },
  contact: { hero: true, form: true, faq: true },
  faq: { hero: true, list: true, cta: true },
  process: { hero: true, phases: true, cta: true },
  solutions: { hero: true, problems: true, scenarios: false, delivery: false, cta: true },
  "web-development": { work: false },
} as const;

export type PageId = keyof typeof sectionVisibility;
export type SectionId<P extends PageId = PageId> = keyof (typeof sectionVisibility)[P] & string;

function hiddenSet() {
  return new Set(
    (process.env.HIDDEN_SECTIONS ?? "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  );
}

export function isSectionEnabled<P extends PageId>(page: P, section: SectionId<P>) {
  if (hiddenSet().has(`${page}:${section}`)) return false;
  return sectionVisibility[page][section] !== false;
}
