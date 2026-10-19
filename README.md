# Solvera Technologies — Website

Marketing and lead-generation website for **Solvera Technologies**: web development, AI solutions, business automation and digital marketing.

Built with **Next.js 16 (App Router, Cache Components)**, **React 19**, **TypeScript**, **Tailwind CSS v4**, **Lucide** icons and **Zod** validation. No animation library — motion uses CSS (including scroll-driven animations) plus one tiny `IntersectionObserver` component.

---

## Quick start

```bash
# Node.js 20.9+ required
npm install
cp .env.example .env.local   # then fill in values (see Configuration)
npm run dev                  # http://localhost:3000
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript (`tsc --noEmit`) |
| `npm test` | Unit/component tests (Vitest + Testing Library) |
| `npm run test:e2e` | End-to-end tests (Playwright; builds must exist — run `npm run build` first) |
| `npm run check` | Lint + typecheck + unit tests + build |

For Playwright, install a browser once with `npx playwright install chromium`.

---

## Configuration

All variables are documented in [`.env.example`](./.env.example).

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | **Yes, in production** | Canonical URLs, sitemap, Open Graph, JSON-LD. Defaults to `http://localhost:3000`. |
| `NEXT_PUBLIC_CONTACT_EMAIL` / `_PHONE` / `_ADDRESS` | No | Verified contact details. Hidden everywhere when empty. |
| `NEXT_PUBLIC_SOCIAL_LINKS` | No | Verified social profiles, `Label|https://…` pairs. Hidden when empty. |
| `RESEND_API_KEY` + `CONTACT_TO_EMAIL` (+ `CONTACT_FROM_EMAIL`) | One delivery option | Email delivery of inquiries via Resend. |
| `CONTACT_WEBHOOK_URL` (+ `CONTACT_WEBHOOK_SECRET`) | One delivery option | POSTs inquiries as JSON to n8n, Make, Zapier, GoHighLevel or a CRM endpoint. |

### Contact form

`POST /api/contact` (`src/app/api/contact/route.ts`):

- Server-side validation with the same Zod schema the client uses (`src/lib/validation.ts`).
- Same-origin check, 20 KB body limit, honeypot field, minimum fill time, per-IP rate limit (5 per 10 minutes) and duplicate-submission protection via a client-generated `submissionId` (also sent as Resend's `Idempotency-Key`).
- Returns `200` **only** after the provider confirms delivery. With no provider configured it returns `503 not_configured`; the form then shows a development-only setup notice (or a neutral "unavailable" message in production) — **it never shows a fake success**.
- Personal data is not logged.

**Webhook payload** (`CONTACT_WEBHOOK_URL`):

```json
{
  "type": "project_inquiry",
  "receivedAt": "2026-01-01T12:00:00.000Z",
  "fullName": "…", "email": "…", "company": "…", "website": "https://…",
  "service": "AI Solutions", "budget": "…", "timeline": "…",
  "message": "…", "consent": true, "submissionId": "uuid"
}
```

> **Rate limiting is in-memory** (per server instance). For serverless or multi-instance hosting, move `isRateLimited` / `isDuplicateSubmission` in `src/lib/contact.ts` to a shared store such as Upstash Redis, or add a CAPTCHA such as Cloudflare Turnstile.

---

## Routes

**15 primary pages**

| # | Page | Route |
| --- | --- | --- |
| 1 | Home (12 sections) | `/` |
| 2 | About | `/about` |
| 3 | Services overview | `/services` |
| 4 | Web Development | `/services/web-development` |
| 5 | AI Solutions | `/services/ai-solutions` |
| 6 | Business Automation | `/services/business-automation` |
| 7 | Digital Marketing | `/services/digital-marketing` |
| 8 | Custom Software Solutions | `/solutions` |
| 9 | Industries | `/industries` (deep links: `/industries#real-estate`) |
| 10 | Portfolio (with filters) | `/work` (shareable: `/work?category=AI+Solutions`) |
| 11 | Process | `/process` |
| 12 | Insights | `/insights` |
| 13 | Contact | `/contact` (preselect: `/contact?service=AI%20Solutions`) |
| 14 | FAQ | `/faq` |
| 15 | Careers | `/careers` |

**Supporting routes:** `/work/[slug]`, `/insights/[slug]`, `/privacy-policy`, `/terms`, `/cookie-policy`, custom `not-found`, `error`, `loading` states, `/api/contact`, `/sitemap.xml`, `/robots.txt`, `/opengraph-image`, `/icon.svg`.

`src/proxy.ts` returns a true **404** for unknown project/article slugs (streamed pages otherwise commit a `200` status before `notFound()` runs).

---

## Project structure

```
src/
  app/                 Routes (App Router), metadata, sitemap, robots, OG image, API
  components/
    layout/            Header, DesktopNavigation, ServicesDropdown, MobileNavigation, Footer, ScrollToTop
    sections/          Homepage sections + FinalCTA
    services/          ServiceCard, ServiceHero, ServiceFeatureGrid, ServiceFAQ, ServiceBlocks
    portfolio/         ProjectCard, ProjectGrid, ProjectFilters, CaseStudyLayout
    insights/          ArticleCard, ArticleGrid, TableOfContents, RelatedArticles, ShareControls
    forms/             ContactForm, FormField, SelectField, SubmitButton
    ui/                Button, Container, SectionHeading, Badge, Accordion, AnimatedSection, Breadcrumbs, PageHero, …
    visuals/           Original code-drawn mockups, hero composition, workflow diagrams, article covers
  data/                Typed content: services, projects, articles, industries, process, faqs, navigation, testimonials
  lib/                 seo, validation, contact delivery, utils, routes
  types/               Service, Project, Article, Contact types
  hooks/               useScrollProgress
  config/site.ts       Site name, URL, verified contact/social (from env)
tests/                 Vitest unit/component tests
e2e/                   Playwright end-to-end tests
```

Server Components are the default; `"use client"` is limited to the header/navigation, accordion, filters, article grid, table of contents, share controls, contact form, scroll-to-top and `InView`.

---

## Editing content

All content lives in typed files under `src/data/` — no layout changes needed.

- **Projects** (`projects.ts`): every current entry is a labeled **Concept Project** or **Internal Prototype**. To add real client work, use `status: "client"`; only then is the `results` field rendered. Add real screenshots to `public/images/projects/` and set `cover.image` — `next/image` is used automatically.
- **Articles** (`articles.ts`): `publishedAt` is intentionally empty. Set an ISO date when an article is actually published — dates and `datePublished` JSON-LD appear automatically. Reading time is calculated from the content.
- **Testimonials** (`testimonials.ts`): empty, so the homepage shows "What You Can Expect". Add only genuine, client-approved quotes.
- **Careers** (`app/careers/page.tsx` → `openPositions`): empty; the page says no roles are open.
- **Legal pages** are templates with a visible notice — they must be completed and reviewed by counsel.

---

## Design system

Tokens are defined in `src/app/globals.css` (`@theme`): `ink #101820`, `paper #F7F8FA`, `brand #2D6AE3`, `mint #38B98A`, `muted #667085`, `line #E5E7EB`; fluid type scale (`text-display`, `text-title`, `text-heading`, `text-card`, `text-lead`); Geist Sans/Mono (self-hosted via `next/font`).

**Motion**
- Hero entrance: CSS keyframes (`.enter`), no JavaScript required.
- Scroll reveal: CSS scroll-driven animations on `[data-reveal]` (≥768px, supporting browsers). Content is never hidden behind JavaScript; unsupported browsers simply show it.
- Continuous animations (hero connections, workflow nodes) pause off-screen via `InView`.
- `prefers-reduced-motion` disables all of the above.

---

## Quality checks (last run)

- `npm run lint`, `npm run typecheck`: clean
- `npm test`: 34 unit/component tests passing (validation, API handler, filtering, reading time, accordion, filters, contact form)
- `npm run test:e2e`: 81 passing across desktop and mobile — every route renders with one `h1`, no console errors and no horizontal overflow; unique titles/descriptions; real 404s; sitemap/robots; dropdown (mouse, keyboard, Escape, outside click); mobile menu (scroll lock, Escape, close on navigation); filters without reload; contact form validation and no fake success
- Lighthouse (mobile, simulated throttling, local server): Accessibility 96–100, Best Practices 100, SEO 100, Performance ~83–96. Treat these as indicative; measure again on the production host and CDN.

---

## Still to configure before launch

1. `NEXT_PUBLIC_SITE_URL` — the production domain.
2. A contact delivery provider (Resend **or** a webhook).
3. Verified contact details and social links (optional).
4. Shared-store rate limiting / CAPTCHA if hosting on serverless or multiple instances.
5. Legal pages: registered business details, jurisdiction, effective dates, legal review.
6. Real project screenshots, verified client work and approved testimonials, when available.
7. Article publication dates once published.
8. Analytics (GA4/GTM) and a consent banner if required — update the Cookie Policy accordingly.
9. Newsletter signup — intentionally omitted until a real subscription backend exists.
