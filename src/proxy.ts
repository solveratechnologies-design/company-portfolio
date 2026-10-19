import { NextResponse, type NextRequest } from "next/server";
import { projects } from "@/data/projects";
import { articles } from "@/data/articles";

/**
 * Dynamic case-study and article pages stream their HTML, which fixes the
 * HTTP status at 200 before the page can call notFound(). Checking slugs
 * here, before rendering starts, lets unknown URLs return a real 404 with
 * the custom not-found page.
 */
const known = {
  work: new Set(projects.map((p) => p.slug)),
  insights: new Set(articles.map((a) => a.slug)),
};

export function proxy(request: NextRequest) {
  const [, section, slug] = request.nextUrl.pathname.split("/");
  const set = known[section as keyof typeof known];
  if (set && slug && !set.has(decodeURIComponent(slug))) {
    return NextResponse.rewrite(new URL("/_not-found-route", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/work/:slug", "/insights/:slug"],
};
