import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getContent } from "@/content";
import { staticRoutes } from "@/lib/routes";


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { services, projects, articles } = await getContent();
  const url = (path: string) => `${siteConfig.url}${path === "/" ? "" : path}`;
  const priority = (path: string) => (path === "/" ? 1 : ["/privacy-policy", "/terms", "/cookie-policy"].includes(path) ? 0.3 : 0.8);

  return [
    ...staticRoutes.map((path) => ({ url: url(path), changeFrequency: "monthly" as const, priority: priority(path) })),
    ...services.map((s) => ({ url: url(s.href), changeFrequency: "monthly" as const, priority: 0.9 })),
    ...projects.map((p) => ({ url: url(`/work/${p.slug}`), changeFrequency: "yearly" as const, priority: 0.6 })),
    ...articles.map((a) => ({
      url: url(`/insights/${a.slug}`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
      ...(a.updatedAt || a.publishedAt ? { lastModified: new Date((a.updatedAt ?? a.publishedAt)!) } : {}),
    })),
  ];
}
