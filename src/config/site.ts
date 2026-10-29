import { resolveSiteUrl } from "./site-url";

/**
 * Central site configuration.
 *
 * Contact details and social profiles are intentionally empty until verified
 * values are supplied through environment variables. Components only render
 * them when present — nothing here is invented.
 *
 * `url` is the single authoritative public origin (see ./site-url.ts). In a
 * production build it must be provided through NEXT_PUBLIC_SITE_URL.
 */
function clean(value: string | undefined) {
  const v = value?.trim();
  return v ? v : undefined;
}

function parseSocial(raw: string | undefined) {
  // Format: "LinkedIn|https://linkedin.com/company/x,GitHub|https://github.com/x"
  if (!raw) return [];
  return raw
    .split(",")
    .map((pair) => pair.split("|").map((s) => s.trim()))
    .filter(([label, href]) => label && href?.startsWith("https://"))
    .map(([label, href]) => ({ label, href }));
}

export const siteConfig = {
  name: "Solvera Technologies",
  shortName: "Solvera",
  tagline: "Building Smarter Digital Experiences. Automating Business Growth.",
  description:
    "Solvera Technologies builds high-performance websites, custom software, practical AI solutions, business automation, and conversion-focused digital marketing for growing businesses.",
  // Must be a direct `process.env.NEXT_PUBLIC_*` reference so Next.js can inline it at build time.
  url: resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL, process.env.NODE_ENV),
  locale: "en_US",
  contact: {
    email: clean(process.env.NEXT_PUBLIC_CONTACT_EMAIL),
    phone: clean(process.env.NEXT_PUBLIC_CONTACT_PHONE),
    address: clean(process.env.NEXT_PUBLIC_CONTACT_ADDRESS),
  },
  social: parseSocial(process.env.NEXT_PUBLIC_SOCIAL_LINKS),
} as const;

export type SiteConfig = typeof siteConfig;
