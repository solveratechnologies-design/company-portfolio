import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import type { Article } from "@/types/article";
import type { Service } from "@/types/service";

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path === "/" ? "" : path}`;
}

/**
 * Shared social-preview image: the generated 1200×630 PNG from
 * `src/app/opengraph-image.tsx`. Next.js shallow-merges metadata, so any page
 * that defines `openGraph` or `twitter` replaces the layout's values entirely.
 * Every page therefore gets this image from `pageMetadata()` explicitly.
 * Relative URLs resolve against `metadataBase` (the configured site origin).
 */
export const socialImage = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${siteConfig.name} — Build smarter. Work faster. Grow further.`,
} as const;

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
  /** Exclude from search engines (e.g. not-found, unfinished legal pages). */
  noIndex?: boolean;
  /** Use `title` exactly as written instead of the "%s | Solvera Technologies" template. */
  absoluteTitle?: boolean;
}

/**
 * Builds consistent, unique page metadata. The root layout supplies the
 * title template ("%s | Solvera Technologies"); the social image is shared.
 */
export function pageMetadata({ title, description, path, type = "website", publishedTime, noIndex, absoluteTitle }: PageMetaInput): Metadata {
  const socialTitle = absoluteTitle ? title : `${title} | ${siteConfig.name}`;
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      title: socialTitle,
      description,
      url: path,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      images: [socialImage],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: socialTitle,
      description,
      images: [socialImage.url],
    },
    ...(noIndex ? { robots: { index: false, follow: true } } : {}),
  };
}

export function organizationJsonLd() {
  const sameAs = siteConfig.social.map((s) => s.href);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/icon.svg"),
    description: siteConfig.description,
    ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
    ...(siteConfig.contact.phone ? { telephone: siteConfig.contact.phone } : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    publisher: { "@id": `${siteConfig.url}/#organization` },
  };
}

export function breadcrumbJsonLd(items: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

export function serviceJsonLd(service: Service) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: service.summary,
    url: absoluteUrl(service.href),
    provider: { "@id": `${siteConfig.url}/#organization` },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: `${service.title} services`,
      itemListElement: service.offerings.map((o) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: o.title, description: o.description },
      })),
    },
  };
}

export function articleJsonLd(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    // Shared brand image; articles have no individual photograph. datePublished is only
    // emitted when a real publication date is set in the article data.
    image: absoluteUrl(socialImage.url),
    url: absoluteUrl(`/insights/${article.slug}`),
    mainEntityOfPage: absoluteUrl(`/insights/${article.slug}`),
    author: { "@type": "Organization", name: article.author },
    publisher: { "@id": `${siteConfig.url}/#organization` },
    ...(article.publishedAt ? { datePublished: article.publishedAt } : {}),
    ...(article.updatedAt ? { dateModified: article.updatedAt } : {}),
  };
}

export function faqJsonLd(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: { "@type": "Answer", text: i.answer },
    })),
  };
}
