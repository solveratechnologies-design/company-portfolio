import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * robots.txt is a crawling hint, not an access-control or de-indexing tool.
 * Use `noindex` metadata (see pageMetadata) to keep pages out of search results.
 * The obsolete `Host` directive is intentionally not emitted.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
