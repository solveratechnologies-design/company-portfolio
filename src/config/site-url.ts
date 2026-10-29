/**
 * Single source of truth for the public site origin.
 *
 * Every canonical URL, Open Graph URL, JSON-LD URL, robots.txt and sitemap.xml
 * entry is built from `siteConfig.url`, which is resolved here.
 *
 * Rules
 * - Development and tests (NODE_ENV !== "production"): when NEXT_PUBLIC_SITE_URL
 *   is not set, fall back to http://localhost:3000 so `npm run dev` just works.
 * - Production builds (`next build`): NEXT_PUBLIC_SITE_URL is REQUIRED. There is
 *   no fallback, so a build can never silently emit localhost SEO URLs.
 * - The value must be an absolute origin. https is required; plain http is only
 *   accepted for loopback hosts (localhost, 127.0.0.1, [::1]) so a production
 *   build can be exercised locally by setting the variable explicitly.
 * - Paths, queries and fragments are rejected so the origin stays unambiguous.
 *
 * NEXT_PUBLIC_* values are inlined at build time. Set the variable in the
 * environment of the build, not only of the running server.
 */

export const DEV_SITE_URL = "http://localhost:3000";

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

export class SiteUrlError extends Error {
  constructor(message: string) {
    super(`[site-url] ${message}`);
    this.name = "SiteUrlError";
  }
}

export function resolveSiteUrl(raw: string | undefined, nodeEnv: string | undefined): string {
  const value = raw?.trim();

  if (!value) {
    if (nodeEnv === "production") {
      throw new SiteUrlError(
        "NEXT_PUBLIC_SITE_URL is not set. Production builds require the public https origin " +
          "(for example https://www.your-domain.com). Set it in the build environment and rebuild.",
      );
    }
    return DEV_SITE_URL;
  }

  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new SiteUrlError(`NEXT_PUBLIC_SITE_URL must be an absolute URL such as https://www.your-domain.com (received an invalid value).`);
  }

  const loopback = LOOPBACK_HOSTS.has(url.hostname);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && loopback)) {
    throw new SiteUrlError("NEXT_PUBLIC_SITE_URL must use https. Plain http is only accepted for localhost/127.0.0.1.");
  }
  if ((url.pathname !== "/" && url.pathname !== "") || url.search || url.hash) {
    throw new SiteUrlError("NEXT_PUBLIC_SITE_URL must be an origin only (no path, query or fragment).");
  }
  if (url.username || url.password) {
    throw new SiteUrlError("NEXT_PUBLIC_SITE_URL must not contain credentials.");
  }

  return url.origin;
}