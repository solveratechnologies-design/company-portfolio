# Solvera Technologies — Portfolio QA Audit

**Audit date:** 27 October 2026  
**Auditor role:** Read-only QA, SEO, security, accessibility, and performance review  
**Application code modified:** No. This file is the only project file created by the audit.  
**Overall status:** Not production-ready. Two high-severity launch blockers were confirmed: canonical and sitemap URLs point at `http://localhost:3000`, and the contact form cannot deliver an inquiry.

> **Update 27 October 2026:** fixes were applied and retested after this audit. Sections A–L below are the **original, unchanged audit** (they describe the code as it was when audited, and "Application code modified: No" refers to that audit pass only). The results of the fixes are in **[Section R. Retest after fixes](#r-retest-after-fixes)** at the end of this file and in [`portfolio-qa-fix-report.md`](./portfolio-qa-fix-report.md).

This report distinguishes three kinds of evidence:

- **Static:** source, configuration, and dependency inspection.
- **Local production:** `npm run build`, then `npx next start -p 3456`, then HTTP and browser checks against `http://localhost:3456`.
- **Production:** not performed. No live domain, DNS, TLS, or hosting configuration was available in the project.

---

## A. Executive Summary

The site is a substantial Next.js marketing application with unique titles and descriptions, one H1 per public route, a real HTTP 404 page, and a contact form that refuses to pretend a message was sent. Those foundations held up under local production checks.

The current environment cannot be launched as the public site. `NEXT_PUBLIC_SITE_URL` is unset, so canonical URLs, Open Graph URLs, JSON-LD, `robots.txt`, and `sitemap.xml` all advertise `http://localhost:3000`. The contact delivery provider is also unset, so a valid inquiry returns HTTP 503 and the interface correctly says the message was not sent. Security response headers are absent from the application. Brand-orange text fails WCAG contrast. Legal pages are indexable templates with unfinished placeholders.

| Status | Count |
| --- | ---: |
| Checks in section C | 48 |
| PASS | 19 |
| FAIL | 15 |
| PARTIAL | 5 |
| BLOCKED | 2 |
| NOT TESTED | 6 |
| NOT APPLICABLE | 1 |

### Most important findings

1. **SEO-001 (HIGH).** Every indexable URL in metadata, the sitemap, and `robots.txt` uses `http://localhost:3000`, including while the site was being served on port 3456.
2. **QA-001 (HIGH).** A valid local inquiry is not delivered. The API returns `503 not_configured`, and the page does not show a success message.
3. **SEC-001 (MEDIUM).** The local production responses omit Content-Security-Policy, HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, and frame protection.
4. **SEO-005 (MEDIUM).** Thirty of 31 public pages declare a large Twitter card and have no `og:image` or `twitter:image`.
5. **A11Y-001 (MEDIUM).** Brand orange used as text color is about 2.7:1 on the page background. Normal text needs 4.5:1.
6. **QA-003 (MEDIUM).** Privacy, terms, and cookie pages are indexable templates with bracketed placeholders.
7. **QA-011 (MEDIUM).** `npm run lint` fails with 3 errors, so `npm run check` cannot pass.

### Major limitations

- No production or staging hostname was configured, so HTTPS, certificate status, HTTP-to-HTTPS redirects, and www canonicalization were not tested.
- Firefox, Safari, and Playwright WebKit were not executed. The installed Playwright browser builds do not match the installed Playwright package, and new browsers were not downloaded.
- Lighthouse was not installed and was not run. A warm-cache localhost timing was captured and is **not** reported as a Core Web Vitals result.
- Unit tests did not start because the Rolldown native binding is missing from `node_modules`. Packages were not reinstalled.
- The repository’s Playwright end-to-end suite was not run.
- No screen reader, axe scan, or forced `prefers-reduced-motion` browser session was run.
- Automated contrast ratios were calculated from the CSS tokens, not sampled with a color picker on rendered pixels.

---

## B. Project Overview

| Item | Verified value |
| --- | --- |
| Framework | Next.js 16.4.2 (App Router, Cache Components). Confirmed in `package.json` and in the build log: `Next.js 16.4.2 (Turbopack)`. |
| UI | React 19.3.0, React DOM 19.3.0 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Package manager | npm 10.8.2, lockfile `package-lock.json` |
| Runtime used | Node.js v20.18.0 on Windows 10 (build 26100) |
| Entry | `src/app/layout.tsx`, `src/app/page.tsx` |
| Request gate | `src/proxy.ts` is active. The build lists it as `ƒ Proxy (Middleware)`. |
| Content mode during this audit | Static. Unknown project and article slugs returned the custom 404, which the proxy does only when `CONTENT_MODE` is not `dynamic`. |

### Routes inspected

**Static pages (14):** `/`, `/about`, `/services`, `/solutions`, `/industries`, `/work`, `/process`, `/insights`, `/contact`, `/faq`, `/careers`, `/privacy-policy`, `/terms`, `/cookie-policy`.

**Service pages (4):** `/services/web-development`, `/services/ai-solutions`, `/services/business-automation`, `/services/digital-marketing`.

**Case studies (7):** `/work/clinic-intake-automation`, `/work/knowledge-base-ai-assistant`, `/work/storefront-performance-rebuild`, `/work/field-service-operations-portal`, `/work/local-growth-measurement-framework`, `/work/real-estate-lead-qualification`, `/work/invoice-data-extraction`.

**Articles (6):** `/insights/which-business-processes-to-automate`, `/insights/before-building-a-business-website`, `/insights/introducing-ai-into-everyday-workflows`, `/insights/conversion-tracking-before-ad-spend`, `/insights/choosing-between-no-code-and-custom-automation`, `/insights/planning-a-custom-dashboard`.

**Other routes exercised:** `/robots.txt`, `/sitemap.xml`, `/icon.svg`, `/opengraph-image`, `/api/contact`, `/this-does-not-exist`, `/work/nope`, `/insights/nope`, `/work/nope/extra`, `/about/`, `/contact?service=AI%20Solutions`, `/work?category=AI+Solutions`.

Query parameters used by the app: `category` on `/work`, and `service` on `/contact`. Industry sections use hash links such as `/industries#real-estate`.

### Tools and commands actually run

| Command or tool | Result |
| --- | --- |
| `npm run lint` | Fail. 3 ESLint errors. |
| `npm run typecheck` | Pass. |
| `npm test` | Did not start. Missing Rolldown native binding. |
| `npm audit` | Pass. 0 info, low, moderate, high, and critical advisories. |
| `npm run build` | Pass. Next.js 16.4.2 generated the static routes above. |
| `npx next start -p 3456` | Local production server. Stopped after the audit. |
| HTTP fetches against that server | Status codes, headers, metadata, sitemap, robots, 404s, and contact API. |
| Playwright driving system Google Chrome 156 (headless) | 7 pages × 6 viewports, plus skip link, mobile menu, contact form, and a warm-cache timing. |
| Playwright driving system Microsoft Edge 156 (headless) | Homepage at 1440×900 and contact at 390×844. |
| `npm run test:e2e` | Not run. |
| Lighthouse | Not run. |

`npm run build` wrote gitignored output under `.next`. No application source, dependency, or environment file was edited.

### Static analysis versus live verification

Static analysis covered routing, metadata helpers, forms, headers configuration, legal copy, contrast tokens, image `alt` usage, environment key names, and git ignore rules. Live verification covered the local production server only. Production hosting behavior is unverified.

---

## C. Detailed Results

Severity on a PASS row is recorded as “—” because no defect was confirmed. Severity on a FAIL or PARTIAL row is explained in section D.

| ID | Category | Test | Status | Severity | Evidence | Recommended Action |
| --- | --- | --- | --- | --- | --- | --- |
| SEO-001 | Canonical URLs | Production origin used by canonical, Open Graph, JSON-LD, robots, and sitemap | FAIL | HIGH | Every canonical on the 31 public pages was `http://localhost:3000…` while the server under test was `http://localhost:3456`. `src/config/site.ts` line 29 defaults the site URL to `http://localhost:3000`. `.env.local` does not set `NEXT_PUBLIC_SITE_URL`. | Set `NEXT_PUBLIC_SITE_URL` to the final `https://` origin before the production build, then rebuild. |
| SEO-002 | Page titles | Each public page has one unique, non-empty title | PASS | — | HTTP HTML for all 31 routes. No duplicates. | Keep the title template. |
| SEO-003 | Page titles | Titles are concise enough to display without heavy truncation | FAIL | LOW | Homepage title is 74 characters after decoding `&amp;`. Six article titles are 74–82 characters with the `\| Solvera Technologies` suffix. Several case-study titles are 70–83 characters. | Shorten the longest titles, especially articles and the homepage, while keeping them unique. |
| SEO-004 | Meta descriptions | Each public page has one unique, non-empty description | PASS | — | All 31 pages. No duplicates. Lengths are mostly 140–165 characters. Four are 171–179 (`/`, `/services/ai-solutions`, `/industries`, `/work`). Character count is guidance only. | Optional trim of those four. |
| SEO-005 | Open Graph / Twitter | `og:image` and Twitter image on indexable pages | FAIL | MEDIUM | Homepage HTML includes `og:image` and `twitter:image` at 1200×630. The other 30 pages have `twitter:card=summary_large_image` and no image tags. `pageMetadata()` in `src/lib/seo.ts` lines 29–42 sets Open Graph and Twitter text without images. | Add the shared image to `pageMetadata()`, or stop replacing the metadata object that currently carries the file-based image. |
| SEO-006 | Open Graph | Homepage social title and description match the page | FAIL | MEDIUM | Document title is the long homepage title. `og:title` and `twitter:title` are only `Solvera Technologies`. Social descriptions use `siteConfig.description`, which is a different sentence from the homepage meta description. `src/app/page.tsx` lines 17–22 do not set `openGraph`; `src/app/layout.tsx` lines 22–28 do. | Set homepage `openGraph` and `twitter` title and description to the same copy as the document title and meta description. |
| SEO-007 | Canonical URLs | Trailing slash and query-parameter canonicals | PASS | — | `GET /about/` returned 308 to `/about`. `/contact?service=AI%20Solutions` canonicalized to `/contact`. `/work?category=AI+Solutions` canonicalized to `/work`. The host on those canonicals is still the SEO-001 defect. | Keep this behavior after the production origin is set. |
| SEO-008 | robots.txt | Syntax, public access, and sitemap reference | PARTIAL | MEDIUM | `GET /robots.txt` returned 200 `text/plain`: `User-Agent: *`, `Allow: /`, `Disallow: /api/`, `Host: http://localhost:3000`, `Sitemap: http://localhost:3000/sitemap.xml`. Public pages are not blocked. The sitemap target is the SEO-001 origin. `Host` is a full URL; the directive expects a hostname and is obsolete for Google. | Point `sitemap` at the production HTTPS sitemap. Drop `host`, or set it to the bare hostname. |
| SEO-009 | sitemap.xml | Valid sitemap of indexable canonical URLs | PARTIAL | HIGH | `GET /sitemap.xml` returned 200 `application/xml`. 31 `<loc>` entries, 0 duplicates, all `http://localhost:3000…`, 0 `https://` URLs. The 31 entries match the 31 public routes, including services, case studies, articles, and legal pages. | Regenerate after `NEXT_PUBLIC_SITE_URL` is the production HTTPS origin. Confirm the live `Content-Type` on the host. |
| SEO-010 | Structured data | JSON-LD parses and matches page type | PASS | — | Homepage emits Organization and WebSite. About emits BreadcrumbList. Service pages emit Service, BreadcrumbList, and FAQPage. The sampled article emits Article and BreadcrumbList. Contact and FAQ emit FAQPage. JSON parsed. URLs inside the data use the localhost origin from SEO-001. | Recheck the absolute URLs after the site origin is fixed. |
| SEO-011 | Structured data | Article schema includes publication data | FAIL | LOW | Rendered Article JSON-LD keys were `@context`, `@type`, `headline`, `description`, `url`, `mainEntityOfPage`, `author`, `publisher`. No `datePublished` or image. `src/data/articles.ts` lines 4–6 leave `publishedAt` unset on purpose. | Add real publication dates when the articles are published. The schema already prints `datePublished` when that field exists. |
| SEO-012 | Indexability | Public pages are indexable and the 404 is not | PASS | — | None of the 31 public pages emitted a robots meta tag. `GET /this-does-not-exist`, `/work/nope`, and `/insights/nope` returned `noindex` with HTTP 404. | Keep legal pages out of the index until the template text is replaced, or accept that they will be indexed. |
| SEO-013 | Headings | One H1 on every public route | PASS | — | HTML of all 31 routes contained exactly one H1. Chrome confirmed the same count on the sampled pages. | No change for H1 count. A full heading-outline review is still manual. |
| SEC-001 | Security headers | CSP, HSTS, nosniff, referrer, permissions, and framing | FAIL | MEDIUM | Homepage, about, article, service, and 404 responses included `content-type`, `x-powered-by`, `cache-control`, and `content-encoding: gzip`. They did not include Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, or X-Frame-Options. `next.config.ts` defines no `headers()`. | Add headers at the host and, where useful, in Next.js. HSTS belongs on the HTTPS terminator. Do not deploy a strict CSP until the font, image, and form origins are listed. |
| SEC-002 | HTTPS and redirects | Production TLS, HTTP to HTTPS, and www | BLOCKED | — | No production hostname is configured. The local server is plain HTTP by design. | Test the real domain: certificate, HTTP→HTTPS, and one chosen www or apex host. |
| SEC-003 | Secrets | Tracked files and client bundles do not contain server secrets | PASS | — | Git tracks `.env.example` only. `.gitignore` ignores `.env*` except `.env.example`. `.env.example` contains empty placeholders. `.env.local` exists, is untracked, and does not contain a populated API key, token, or webhook secret. Server delivery code imports `server-only`. A requested client source map returned HTTP 404. | Keep `.env.local` untracked. Rotate any credential later if it is ever committed or pasted into a client bundle. |
| SEC-004 | Forms | Server validation, origin check, and honest failure | PASS | — | `POST /api/contact` with `Origin: http://localhost:3456` and an empty body returned 422 with field errors. `Origin: https://evil.example` returned 403. A valid test payload returned 503 `not_configured` and `Cache-Control: no-store`. Chrome showed that 503 text and zero success messages. `GET /api/contact` returned 405 with `Allow: POST`. | Configure a delivery provider in a non-production environment and repeat one test submission there. |
| SEC-005 | Forms | Rate limiting holds across instances and cannot be spoofed | FAIL | MEDIUM | `src/lib/contact.ts` lines 104–116 keep hits in a process-local `Map` (5 requests / 10 minutes). `src/app/api/contact/route.ts` lines 12–14 trust the first `X-Forwarded-For` value. The README already documents the multi-instance gap. This audit did not flood the endpoint. | Before a multi-instance or serverless launch, move the limiter to a shared store and use the platform’s trusted client IP. |
| SEC-006 | Secrets | Production source maps are not publicly served | PASS | — | `GET /_next/static/chunks/1s37vwjm584j-.js.map` returned 404. The 484 `.map` files found under `.next` are build output, and `.next/` is gitignored. | Keep `productionBrowserSourceMaps` off unless maps are access-controlled. |
| SEC-007 | Security headers | Technology disclosure | FAIL | LOW | HTML responses include `X-Powered-By: Next.js`. | Remove the header at the application or the host if fingerprinting matters. This is not an exposure of data. |
| A11Y-001 | Accessibility | Text contrast of brand orange | FAIL | MEDIUM | Tokens in `src/app/globals.css` lines 7–15. Calculated sRGB contrast: `#f27222` on `#fff6f0` is 2.73:1; `#f27222` on `#ffffff` is 2.91:1; `#d35a12` on `#ffffff` is 4.01:1. Normal text needs 4.5:1. Used for links and labels in `ContactForm.tsx`, `LegalPage.tsx`, `ArticleCard.tsx`, `ServiceCard.tsx`, `IconLink.tsx`, and `ServicesDropdown.tsx`. Primary buttons use `#101820` on `#f27222` (6.14:1) and pass. Muted body text `#667085` on `#fff6f0` is 4.67:1 and passes. | Darken the orange used for text and links. Keep the current orange for large fills and icons if a darker text color sits on them. |
| A11Y-002 | Accessibility | Auto-updating carousel can be paused | FAIL | MEDIUM | `ServiceOverviewCarousel` advances every 2 seconds (`INTERVAL = 2000`, lines 14 and 143–147). Pause is bound to mouse enter and focus. There is no pause control. Reduced motion disables the timer. | Add a Pause/Play button that persists, including for touch users. |
| A11Y-003 | Accessibility | Language, skip link, and form labeling | PASS | — | `<html lang="en">` on fetched pages. First Tab on the homepage focused “Skip to content” (`href="#main"`). Empty submit announced “Please correct the 5 highlighted fields below.” Inputs use `<label for>`. | Continue with a screen-reader pass. |
| A11Y-004 | Accessibility | Mobile menu keyboard behavior | PASS | — | Chrome at 390×844: Open menu, dialog visible, `document.body.style.overflow` was `hidden`. After Escape and a short wait, `aria-expanded` was `false` and the dialog was hidden. An immediate check without waiting was a race and was discarded. | Re-check focus return in a screen reader. |
| A11Y-005 | Accessibility | Reduced motion | PARTIAL | LOW | `src/app/globals.css` lines 239–251 and several components check `prefers-reduced-motion`. This audit did not emulate that setting in the browser. | Turn the OS or browser setting on and confirm carousels, reveals, and sticky industry motion stop. |
| A11Y-006 | Accessibility | Image alternative text | PASS | — | Chrome found no `img` missing `alt` on `/`, `/contact`, `/services`, `/work`, `/industries`, one article, and `/privacy-policy` across six viewports. Source `next/image` uses have descriptive `alt`. Decorative marks use `aria-hidden`. Industry photos are hidden below the `md` breakpoint and use real alt text when shown. | No blanket alt change. |
| A11Y-007 | Accessibility | Full WCAG 2.2 AA conformance | NOT TESTED | — | No axe run and no screen reader. Automated absence of errors would not establish conformance even if it had been run. | Manual keyboard, zoom, and screen-reader checklist in section K. |
| QA-001 | Forms / CTA | Inquiry delivery | FAIL | HIGH | `.env.local` has no Resend key, recipient, or webhook URL. Valid test payload returned HTTP 503 `{"ok":false,"code":"not_configured",...}`. Chrome displayed “Our inquiry form is temporarily unavailable, and your message was not sent.” Success text count was 0. No customer message was sent. Public email, phone, and social links are also unset, so the footer shows only the inquiry link. | Configure one delivery provider and verified contact details, then submit one staging test. |
| QA-002 | Custom 404 | Status, message, and way home | PASS | — | Unknown paths and unknown slugs returned HTTP 404, `noindex`, H1 “This page took a different path.”, and a link to `/`. Cache-Control was `private, no-cache, no-store`. They were not redirected to the homepage. | Keep the proxy check so streamed dynamic pages cannot return 200 for unknown slugs. |
| QA-003 | Privacy / legal | Policy pages exist and match the product | FAIL | MEDIUM | `/privacy-policy`, `/terms`, and `/cookie-policy` return 200, are linked from the footer, and are in the sitemap. `LegalPage.tsx` lines 45–51 render a template notice. Privacy copy still contains “[to be completed before publication]”, “[to be completed]”, “[to be confirmed]”, and “[effective date to be added]”. Terms still contain “[jurisdiction to be completed]”. This is not a legal opinion. | Complete the pages with counsel before indexing them. The data-collection description of the inquiry form and the absence of analytics match the current code. |
| QA-004 | Internal links | Public routes respond | PASS | — | All 31 routes returned HTTP 200. Navigation and footer hrefs in `src/data/navigation.ts` point at those routes. No empty `href` or `javascript:` href was found in `src`. Every in-content link was not clicked. | Click through footer and article links during the manual pass. |
| QA-005 | Responsive | Page-level horizontal overflow at the required viewports | PASS | — | Chrome 156, pages `/`, `/contact`, `/services`, `/work`, `/industries`, one article, and `/privacy-policy`, at 320×568, 375×812, 390×844, 768×1024, 1024×768, and 1440×900. Settled `scrollWidth - clientWidth` was 0. A single 8px homepage reading at 1024×768 did not reproduce. `/work` filter chips extend outside the viewport inside `overflow-x-auto`; the page itself does not grow. At 320×568 the visible “Web Development” carousel card sat between x=35 and x=285. | Manually confirm the filter row is obviously scrollable, because `scrollbar-width: none` hides the bar. |
| QA-006 | Browser | Google Chrome rendering and console | PASS | — | Chrome 156 headless. 42 page loads (7 routes × 6 viewports): all HTTP 200, one H1, no page errors, no console errors, no broken images. | Repeat on a full Chrome window, not only headless. |
| QA-007 | Browser | Microsoft Edge | PARTIAL | — | Edge 156 headless (`Edg/156.0.0.0`). Homepage 1440×900 returned 200, one H1, no console errors. Contact at 390×844 had overflow 0 and one H1. Menus, forms, and the other routes were not repeated in Edge. | Spot-check the mobile menu and contact form in Edge. |
| QA-008 | Browser | Mozilla Firefox | NOT TESTED | — | Firefox is not installed. Playwright looked for `firefox-1495` and that build is not in the local browser cache. | Install Firefox or the matching Playwright browser, then rerun. |
| QA-009 | Browser | Safari | NOT TESTED | — | This machine is Windows. Safari was not available. | Use a Mac or an iOS device. |
| QA-010 | Performance | Core Web Vitals and Lighthouse | NOT TESTED | — | Lighthouse is not a project dependency and was not installed. A Chrome timing after other navigations showed a warm cache (`transferSize` 300 bytes for the document) and did not record LCP. Those numbers are omitted as performance scores. | Run Lighthouse mobile and desktop against the production URL, and review field data in Search Console. |
| PERF-001 | Performance | Hero image optimization | FAIL | MEDIUM | `HeroVisual.tsx` lines 14–19 set `unoptimized` and `priority`. `GET /images/hero/workspace.jpg` returned 200 `image/jpeg`, 198,452 bytes. Industry source files are 178–274 KB; their delivered `/_next/image` sizes were not measured. | Serve the hero through `next/image` without `unoptimized`, at an appropriate width and modern format. |
| QA-011 | Quality | ESLint | FAIL | MEDIUM | `npm run lint` exited 1. `Header.tsx:19` and `ServiceOverviewCarousel.tsx:128` call `setState` in an effect. `ServiceCategoryCarousel.tsx:105` reads a ref during render. `npm run check` includes lint, so the project check command fails. | Fix the three React hook errors, then rerun lint. |
| QA-012 | Quality | TypeScript | PASS | — | `npm run typecheck` (`tsc --noEmit`) exited 0. The production build also finished its TypeScript step. | Keep it in the pre-launch check. |
| QA-013 | Quality | Unit and component tests | BLOCKED | — | `npm test` failed at startup: Vitest/Rolldown could not load `@rolldown/binding-win32-x64-msvc`. The lockfile lists that package; it is not present under `node_modules`. Packages were not reinstalled, per the audit rules. | Restore `node_modules` with a normal install, then run `npm test`. |
| QA-014 | Quality | Production build | PASS | — | `npm run build` exited 0 in about 108 seconds. Routes listed in section B were generated. | Rebuild after the production site URL and delivery environment are set. |
| QA-015 | Dependencies | npm audit | PASS | — | `npm audit` reported 0 vulnerabilities across all severities. Audit date 27 October 2026. Dependencies were not updated. | Re-run before launch. A clean audit is not a full application security test. |
| QA-016 | Quality | Repository Playwright suite | NOT TESTED | — | `npm run test:e2e` was not run. Playwright expected Chromium build `chromium_headless_shell-1194`, Firefox `1495`, and WebKit `2215`. Those builds are not installed. System Chrome was used instead for the checks in QA-005 and QA-006. | Install the matching Playwright browsers, then run `npm run test:e2e`. |
| QA-017 | Calls to action | CTA clarity and destination | PARTIAL | HIGH | Homepage CTAs “Start a Project” (`/contact`) and “Explore Our Services” (`/services`) are specific. Header and final CTA repeat “Start a Project”. Destinations exist. The contact destination cannot deliver an inquiry (QA-001). | Keep the labels. Make the destination able to send. |
| QA-018 | Cookies / tracking | Consent banner | NOT APPLICABLE | — | No analytics, tag manager, or advertising script was found in `src`. No `Set-Cookie` was observed on page or API responses. The cookie policy already says analytics cookies are not set in the current configuration. A banner is not required for the current implementation. | Add consent before any future analytics tag. |
| QA-019 | Assets | Unused files publicly served | FAIL | LOW | `GET /file.svg` and `GET /vercel.svg` returned 200. `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, and `window.svg` are not referenced by application source. `public/images/industries/collaboration.jpg` and `industries-collaboration.jpg` are byte-identical; the second name is not referenced. | Remove the starter SVGs and the duplicate photograph from `public`. |
| QA-020 | Browser | Playwright WebKit | NOT TESTED | — | Launch failed because `webkit-2215` is not installed. This would not have been Safari even if it had launched. | See QA-009. |

---

## D. Detailed Issue Descriptions

### SEO-001 — Canonical origin is localhost

- **What is wrong.** The site’s absolute public origin is the code default `http://localhost:3000`.
- **Where.** `src/config/site.ts` line 29. Consumed by `src/lib/seo.ts`, `src/app/robots.ts`, `src/app/sitemap.ts`, and `metadataBase` in `src/app/layout.tsx` line 15. `.env.local` does not define `NEXT_PUBLIC_SITE_URL`.
- **Reproduction.** Build and open any page. View source. The canonical link is `http://localhost:3000` plus the path. This remained true when the server was on port 3456, so the value does not follow the request host.
- **Expected.** Canonical, sitemap, robots, Open Graph, and JSON-LD use the production `https://` origin.
- **Actual.** All of those URLs use `http://localhost:3000`.
- **Evidence.** Fetched HTML, `/robots.txt`, and `/sitemap.xml` from the local production server.
- **Fix.** Set `NEXT_PUBLIC_SITE_URL` in the production environment and rebuild. `NEXT_PUBLIC_*` values are fixed at build time.
- **Confirmed.** Yes.

### SEO-003 — Titles are longer than a typical result display

- **What is wrong.** Several titles will be truncated in search results. They are still unique and descriptive, so this is low severity.
- **Examples.** Homepage, 74 characters: “Solvera Technologies — Web Development, AI, Automation & Digital Marketing”. Article “How to Identify the Right Business Processes to Automate | Solvera Technologies”, 79 characters. “Choosing Between No-Code Automation and Custom Integrations | Solvera Technologies”, 82 characters.
- **Expected.** Unique titles that identify the page and the business, short enough that the distinctive words remain visible.
- **Actual.** The suffix ` | Solvera Technologies` pushes otherwise reasonable article titles past 70 characters.
- **Fix.** Keep the brand on the homepage. On articles, use a shorter title or a shorter brand suffix.
- **Confirmed.** Yes, from rendered `<title>` text.

### SEO-005 — Interior pages have no share image

- **What is wrong.** A large social card is declared, and the image is missing, on every page except the homepage.
- **Where.** `src/lib/seo.ts` lines 29–42. The image file `src/app/opengraph-image.tsx` is 1200×630 and is attached only when a page does not replace Open Graph metadata.
- **Reproduction.** View source of `/about` or any article. `og:title` and `og:description` are present. `og:image` and `twitter:image` are absent. `twitter:card` is `summary_large_image`.
- **Expected.** Each indexable page has an absolute HTTPS image URL that returns an image of shareable size.
- **Actual.** Only `/` has `http://localhost:3000/opengraph-image?2fb16abf0848c6d0`. That image itself returned 200 `image/png`, 1200×630, 113,577 bytes, when requested on the test server.
- **Fix.** Include `images` in `pageMetadata()` so child pages keep the generated image. Social preview tools were not used; this finding is about the tags, not a rendered Facebook or X card.
- **Confirmed.** Yes, from HTML.

### SEO-006 — Homepage social text does not match the page

- **What is wrong.** The homepage document title and meta description differ from `og:title`, `og:description`, `twitter:title`, and `twitter:description`.
- **Actual social title.** `Solvera Technologies`.
- **Actual document title.** `Solvera Technologies — Web Development, AI, Automation & Digital Marketing`.
- **Expected.** The share title and description describe the same page as the HTML title and meta description.
- **Confirmed.** Yes, from homepage HTML.

### SEO-008 and SEO-009 — robots and sitemap are structurally fine and point at localhost

- **robots.** Allows `/`, disallows `/api/` only, and references a sitemap on localhost over HTTP. `Host: http://localhost:3000` is a full URL.
- **sitemap.** Well-formed urlset, 31 unique locs, correct path coverage, no error URLs, and every URL is HTTP on localhost. Legal template pages are included, which is a problem only while QA-003 remains.
- **Expected.** Absolute HTTPS URLs on the production host.
- **Confirmed.** Yes. Production response headers for these files were not tested (SEC-002).

### SEO-011 — Articles have no publication date in schema

- **What is wrong.** Article JSON-LD has no `datePublished` or image because `publishedAt` is unset.
- **Expected.** Published articles expose the real date in both the page and the schema.
- **Actual.** The omission is intentional in source comments, and the rendered schema matches that choice.
- **Confirmed.** Yes. Severity is low because the pages can still be indexed.

### SEC-001 — Security headers are missing

- **What is wrong.** The application does not set the common hardening headers, and nothing else in this local stack adds them.
- **Missing on sampled HTML responses.** Content-Security-Policy, Strict-Transport-Security, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, X-Frame-Options, and CSP `frame-ancestors`.
- **Present.** `X-Powered-By: Next.js` (SEC-007). HTML was gzip-compressed. Public HTML used `s-maxage=86400, stale-while-revalidate=518400`. The 404 used `private, no-cache, no-store`. Contact `POST` used `no-store`.
- **Expected.** Nosniff, a referrer policy, and framing control at the application or CDN. HSTS on the HTTPS edge. A CSP that allows this site’s own scripts, styles, fonts, and images without blocking the contact form.
- **Why not high.** There is no authenticated session and no `Set-Cookie` was observed. Framing a public marketing page has limited impact. HSTS cannot be judged on local HTTP.
- **Where to configure.** HSTS, HTTP redirects, and TLS: hosting, CDN, or reverse proxy. Nosniff, referrer policy, permissions policy, and frame control: Next.js `headers()` and/or the host. CSP: application layer, after a report-only trial, because a copied strict policy can break Next.js scripts and the contact `fetch`.
- **Confirmed.** Yes, for the local production server. Host configuration is unverified.

### SEC-005 — Rate limit will not hold on more than one server

- **What is wrong.** The limiter and the duplicate-submission memory live in the Node process. The client key prefers the first forwarded IP, which a client can set if the platform does not overwrite it.
- **Expected.** A shared limit keyed by a trusted client IP, plus the existing honeypot, minimum fill time, and body size cap.
- **Actual.** Those other controls exist in code. The shared-store gap is documented in the README and is still the implementation.
- **Confirmed as a code defect.** Yes. Not demonstrated with a bypass attack.

### SEC-007 — `X-Powered-By` is exposed

- **Actual.** `X-Powered-By: Next.js` on HTML responses.
- **Expected.** No framework fingerprint header, if that is the deployment standard.
- **Severity.** Low. It does not reveal a secret.

### A11Y-001 — Orange text fails contrast

- **What is wrong.** `#f27222` (`--color-brand`) is used as text and link color on the light page background.
- **Examples.** Privacy-policy link inside the consent label; “View all services”; article category labels; “Learn More” on service cards.
- **Expected.** Normal text at least 4.5:1. Large text at least 3:1.
- **Actual.** 2.73:1 for brand orange on the canvas color. The large homepage phrase “Grow Further.” uses `#d35a12` on the flat hero color `#f3e0d0`, which calculates to 3.13:1 and meets the large-text threshold against that flat color. It was not measured on top of the gradient.
- **Fix.** Use a darker orange for text, or use ink text with an orange underline or icon.
- **Confirmed.** Calculated from the tokens that the stylesheet applies. A pixel sampler was not used.

### A11Y-002 — Services carousel auto-advances without a pause button

- **What is wrong.** The homepage services carousel moves to the next card every 2 seconds. Mouse hover and keyboard focus pause it. Touch users have previous/next buttons, and those buttons do not stop the timer.
- **Expected.** WCAG 2.2.2: a way to pause motion that continues longer than five seconds alongside other content.
- **Actual.** `prefers-reduced-motion: reduce` does stop it. That preference was not switched on during the browser session (A11Y-005).
- **Confirmed.** Yes, from `src/components/sections/ServiceOverviewCarousel.tsx`. The two-second interval was not timed with a stopwatch in the browser.

### A11Y-005 — Reduced motion is implemented and was not executed

- **What was verified.** CSS and component code honor reduced motion.
- **What was not verified.** A browser session with the preference forced on.
- **Expected.** Animations, the auto-carousel, and the tall industry scroller settle immediately.

### QA-001 and QA-017 — The primary conversion path cannot send

- **What is wrong.** The business goal of the site is a project inquiry. The form UI is wired, and delivery is not.
- **Reproduction.** Open `/contact`. Submit empty: the alert says to correct 5 fields. Fill name `QA Audit`, email `qa-audit@example.com`, service `AI Solutions`, a message longer than 20 characters, and the consent box. Wait for the minimum fill time. Submit.
- **Expected.** A configured environment accepts the inquiry only after the provider accepts it, then shows success.
- **Actual.** HTTP 503 `not_configured`. The alert says the form is temporarily unavailable and the message was not sent. The test payload used an example.com address and was not delivered, because no provider is configured.
- **Also true.** The same page does not invent a success state. That part passed (SEC-004).
- **Confirmed.** Yes.

### QA-003 — Legal pages are unfinished and indexable

- **What is wrong.** The privacy, terms, and cookie pages tell the reader they are templates and still contain bracketed blanks for the legal entity, providers, retention, effective date, and jurisdiction. They are linked in the footer, return 200, and appear in the sitemap without `noindex`.
- **Comparison with the code.** The privacy page’s description of the inquiry fields, consent, IP-based rate limiting, and optional future analytics matches the implementation. No analytics cookies are set today, which matches the cookie page. The page does not name the email or webhook provider because none is configured. It also says technical storage “may” be used; no cookie or `localStorage` usage was found. That sentence is broader than the current code.
- **This audit does not certify legal compliance.** A lawyer needs to review jurisdiction, bases, retention, and the finished business identity.
- **Confirmed.** Yes, from the rendered template notice and the source copy.

### QA-007 — Edge was only spot-checked

- **Verified.** Homepage and the contact page render, with one H1 and no console errors on those two loads.
- **Not verified in Edge.** Mobile menu, form submission, and the rest of the routes.

### QA-011 — Lint fails

- **Reproduction.** `npm run lint`.
- **Actual.** Exit code 1. Errors at `src/components/layout/Header.tsx:19`, `src/components/sections/ServiceOverviewCarousel.tsx:128`, and `src/components/services/ServiceCategoryCarousel.tsx:105`.
- **Expected.** `npm run lint` exits 0, matching the project’s `check` script.
- **Confirmed.** Yes. These are hook-rule violations. A user-facing crash was not observed in Chrome.

### PERF-001 — Hero image is sent at full size

- **What is wrong.** The likely largest above-the-fold image opts out of Next.js image optimization.
- **Evidence.** `unoptimized` and `priority` on `/images/hero/workspace.jpg`. Direct response: 198,452 bytes.
- **Expected.** A sized, compressed response appropriate to the viewport.
- **Confirmed.** Yes, for the file that the page references. A throttled LCP number was not measured (QA-010).

### QA-019 — Starter and duplicate files are public

- **Actual.** Unreferenced `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, and `window.svg` are served. Two industry JPEGs are identical and one filename is unused.
- **Expected.** `public` contains only files the site uses.
- **Confirmed.** Yes. This is cleanup, not a vulnerability.

---

## E. SEO Summary

Alt text was checked in Chrome on seven routes and by source review elsewhere. “None recorded” means no missing or empty `alt` was found in that review, not that every decorative image was judged in a screen reader.

Sitemap inclusion is “Yes” for all 31 routes. Every canonical below is on `http://localhost:3000` (SEO-001).

| Route | Title | Meta description | Canonical | H1 | Robots | Open Graph | Image alt issues | Sitemap |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| / | Solvera Technologies — Web Development, AI, Automation & Digital Marketing | Solvera Technologies helps growing businesses build high-performance websites and software, apply practical AI, automate workflows, and grow with measurable digital marketing. | http://localhost:3000 | Build Smarter. Work Faster. Grow Further. | Indexable (no robots meta) | Has og:image. og:title is "Solvera Technologies" | None recorded | Yes |
| /about | About Us \| Solvera Technologies | Solvera Technologies is a digital solutions partner bringing web development, AI, automation and digital marketing together to solve practical business problems. | http://localhost:3000/about | A Technology Partner for Your Next Stage of Growth. | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /services | Services \| Solvera Technologies | Explore Solvera's connected services: web development and custom software, AI solutions, business automation, and digital marketing — individually or combined. | http://localhost:3000/services | Connected capabilities for building, automating and growing. | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /services/web-development | Web Development & Custom Software \| Solvera Technologies | Fast, accessible business websites, e-commerce, web applications, dashboards and API integrations — built for performance, usability and long-term maintainability. | http://localhost:3000/services/web-development | Digital Experiences Built for Performance and Growth. | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /services/ai-solutions | AI Solutions & AI Agents \| Solvera Technologies | Practical AI assistants, conversational agents, retrieval-augmented generation and document processing — evaluated against your real examples and integrated with clear safeguards. | http://localhost:3000/services/ai-solutions | Turn AI Into a Practical Business Advantage. | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /services/business-automation | Business Automation & Workflow Integration \| Solvera Technologies | Automate CRM workflows, lead management, invoicing reminders, appointments, reporting and data sync — with documented workflows, testing and error handling. | http://localhost:3000/services/business-automation | Less Manual Work. More Connected Operations. | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /services/digital-marketing | Digital Marketing, SEO & Paid Campaigns \| Solvera Technologies | Technical and local SEO, Google Business Profile, Google and Meta Ads, content strategy and analytics — connected into one measurable growth system. | http://localhost:3000/services/digital-marketing | Build a Stronger Digital Presence. Generate Better Opportunities. | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /solutions | Custom Software Solutions \| Solvera Technologies | Know the problem but not the service? Solvera designs custom dashboards, portals, internal tools and integrations around the way your business works. | http://localhost:3000/solutions | Tailored solutions for the way your business works. | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /industries | Industries \| Solvera Technologies | How web development, AI, automation and digital marketing apply to e-commerce, hospitality, professional services, real estate, healthcare, education, SaaS and financial services. | http://localhost:3000/industries | Technology Designed Around the Way Your Business Works. | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /work | Work & Case Studies \| Solvera Technologies | Concept projects and internal prototypes across web development, custom software, AI, automation and digital marketing — each showing the problem, approach and technology. | http://localhost:3000/work | Selected Work and Digital Experiments. | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /work/clinic-intake-automation | Clinic Booking & Intake Automation — Business Automation \| Solvera Technologies | A connected booking flow that confirms appointments, collects intake forms before the visit, and keeps the front desk's schedule current. | http://localhost:3000/work/clinic-intake-automation | Clinic Booking & Intake Automation | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /work/knowledge-base-ai-assistant | Knowledge-Base AI Support Assistant — AI Solutions \| Solvera Technologies | An internal prototype of a support assistant that answers questions from approved help articles, cites its sources, and hands over to a person when unsure. | http://localhost:3000/work/knowledge-base-ai-assistant | Knowledge-Base AI Support Assistant | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /work/storefront-performance-rebuild | Performance-First E-commerce Storefront — Web Development \| Solvera Technologies | A headless storefront concept focused on fast product discovery, a simplified checkout, and clean analytics from day one. | http://localhost:3000/work/storefront-performance-rebuild | Performance-First E-commerce Storefront | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /work/field-service-operations-portal | Field Service Operations Portal — Custom Software \| Solvera Technologies | A custom portal concept for scheduling jobs, tracking technician progress, and giving customers live status updates. | http://localhost:3000/work/field-service-operations-portal | Field Service Operations Portal | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /work/local-growth-measurement-framework | Local Growth & Measurement Framework — Digital Marketing \| Solvera Technologies | A concept marketing framework for multi-location service businesses, combining local SEO, paid search and call tracking in one report. | http://localhost:3000/work/local-growth-measurement-framework | Local Growth & Measurement Framework | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /work/real-estate-lead-qualification | Real Estate Lead Qualification Workflow — AI Solutions \| Solvera Technologies | An internal prototype that classifies incoming property enquiries, asks follow-up questions, and routes qualified leads to the right agent. | http://localhost:3000/work/real-estate-lead-qualification | Real Estate Lead Qualification Workflow | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /work/invoice-data-extraction | Invoice Data Extraction Pipeline — AI Solutions \| Solvera Technologies | An internal prototype that extracts supplier, totals and line items from PDF invoices into structured data for review. | http://localhost:3000/work/invoice-data-extraction | Invoice Data Extraction Pipeline | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /process | Our Process \| Solvera Technologies | How Solvera delivers projects: discovery, planning, design and prototyping, development and integration, then testing, launch and ongoing improvement. | http://localhost:3000/process | A Clear Process. A Better Outcome. | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /insights | Insights \| Solvera Technologies | Practical guides on websites, AI, automation and digital marketing — helping business owners and teams make better technology decisions. | http://localhost:3000/insights | Practical thinking for better digital decisions. | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /insights/which-business-processes-to-automate | How to Identify the Right Business Processes to Automate \| Solvera Technologies | Not every task should be automated. A simple way to find the processes where automation saves real time — and avoid the ones where it creates new problems. | http://localhost:3000/insights/which-business-processes-to-automate | How to Identify the Right Business Processes to Automate | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /insights/before-building-a-business-website | What to Consider Before Building a Business Website \| Solvera Technologies | Before choosing a design or a platform, get clear on these decisions. They shape the cost, timeline and long-term usefulness of your website. | http://localhost:3000/insights/before-building-a-business-website | What to Consider Before Building a Business Website | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /insights/introducing-ai-into-everyday-workflows | Practical Ways to Introduce AI Into Everyday Workflows \| Solvera Technologies | Start small, keep people in the loop, and measure what changes. A grounded approach to adopting AI in a growing business. | http://localhost:3000/insights/introducing-ai-into-everyday-workflows | Practical Ways to Introduce AI Into Everyday Workflows | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /insights/conversion-tracking-before-ad-spend | Why Conversion Tracking Should Come Before Ad Spend \| Solvera Technologies | Increasing an ad budget without reliable tracking makes it harder, not easier, to grow. Here is what to set up first. | http://localhost:3000/insights/conversion-tracking-before-ad-spend | Why Conversion Tracking Should Come Before Ad Spend | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /insights/choosing-between-no-code-and-custom-automation | Choosing Between No-Code Automation and Custom Integrations \| Solvera Technologies | No-code platforms are fast and flexible, but they are not always the right fit. How to decide which approach suits each workflow. | http://localhost:3000/insights/choosing-between-no-code-and-custom-automation | Choosing Between No-Code Automation and Custom Integrations | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /insights/planning-a-custom-dashboard | Planning a Custom Dashboard Your Team Will Actually Use \| Solvera Technologies | Dashboards fail when they show everything. Start from the decisions people make, and design around those. | http://localhost:3000/insights/planning-a-custom-dashboard | Planning a Custom Dashboard Your Team Will Actually Use | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /contact | Contact — Start a Project \| Solvera Technologies | Tell Solvera Technologies about your project. Share your goals and we'll reply with questions, initial thoughts and a suggested next step. | http://localhost:3000/contact | Tell Us What You're Building. | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /faq | Frequently Asked Questions \| Solvera Technologies | Answers about working with Solvera, web development timelines and handover, AI privacy and accuracy, automation tools, and digital marketing measurement. | http://localhost:3000/faq | Questions, answered clearly. | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /careers | Careers \| Solvera Technologies | How we work at Solvera Technologies, our working principles, and how to express interest in future opportunities. | http://localhost:3000/careers | Collaborative work, practical problems, lasting craft. | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /privacy-policy | Privacy Policy \| Solvera Technologies | How Solvera Technologies collects, uses and protects personal information submitted through this website. | http://localhost:3000/privacy-policy | Privacy Policy | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /terms | Terms of Service \| Solvera Technologies | Terms governing the use of the Solvera Technologies website and its content. | http://localhost:3000/terms | Terms of Service | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |
| /cookie-policy | Cookie Policy \| Solvera Technologies | Information about cookies and similar technologies used on the Solvera Technologies website. | http://localhost:3000/cookie-policy | Cookie Policy | Indexable (no robots meta) | og:title and og:description present; og:image and twitter:image absent | None recorded | Yes |

Favicon: `GET /icon.svg` returned 200 `image/svg+xml`. The homepage also requested a fingerprinted icon URL. No separate apple-touch icon file was found. `themeColor` is set to `#f27222` in `src/app/layout.tsx`; the meta tag was not scraped separately.

Portfolio labeling is consistent: case studies are marked Concept Project or Internal Prototype in the data and on the work page. Testimonials are an empty list, and the homepage is written to show an expectation statement instead. Careers has an empty openings list. Those are content choices, not broken routes.

---

## F. Security Summary

### Headers verified on the local production server

| Header | Homepage and sampled HTML | Contact POST | 404 |
| --- | --- | --- | --- |
| Content-Security-Policy | Absent | Absent | Absent |
| Strict-Transport-Security | Absent (HTTP localhost; HSTS belongs on HTTPS) | Absent | Absent |
| X-Content-Type-Options | Absent | Absent | Absent |
| Referrer-Policy | Absent | Absent | Absent |
| Permissions-Policy | Absent | Absent | Absent |
| X-Frame-Options or CSP frame-ancestors | Absent | Absent | Absent |
| X-Powered-By | `Next.js` | Not recorded on the JSON response sample | `Next.js` |
| Cache-Control | `s-maxage=86400, stale-while-revalidate=518400` | `no-store` on POST | `private, no-cache, no-store, max-age=0, must-revalidate` |
| Set-Cookie | Absent | Absent | Absent |
| Content-Encoding | gzip | — | gzip |

`GET /api/contact` returns 405 `Allow: POST` and did not send `Cache-Control`.

### HTTPS and redirects

Not tested on a public host (SEC-002). Locally, `/about/` returns 308 to `/about`. No mixed-content `http://` asset hosts were found in application source. The canonical URLs themselves are `http://localhost:3000`.

### Secrets

No populated server secret was found in git. `.env.example` is placeholders. `.env.local` is untracked. Public environment variables are limited to the `NEXT_PUBLIC_` names in `src/config/site.ts`. `CONTENT_API_TOKEN`, `RESEND_API_KEY`, and `CONTACT_WEBHOOK_SECRET` are read only on the server and are empty in the local env file. Secret values are omitted from this report. Client source maps were not served.

### Forms

Controls present in code and partly exercised locally: Zod validation on the server (422 confirmed), JSON content type, 20 KB body limit, same-origin check (403 confirmed for a foreign origin), honeypot, minimum fill time, per-process rate limit, and duplicate `submissionId` memory. Personal data is not written to the success log; delivery failures log the provider name only. Webhook and Resend URLs are operator configuration, not user input.

The rate-limit store will reset on every serverless instance (SEC-005). No CAPTCHA is present. That is acceptable only behind a shared limiter or another abuse control.

### Infrastructure not verified

CDN or host headers, TLS certificate, HTTP-to-HTTPS, www versus apex, WAF, backup, and any platform-added headers. A clean `npm audit` does not cover those.

---

## G. Responsive and Browser Matrix

“Executed” means a real browser loaded the page. “Inferred” is not used as a pass.

### Viewports in Chrome 156 headless

Pages: `/`, `/contact`, `/services`, `/work`, `/industries`, `/insights/which-business-processes-to-automate`, `/privacy-policy`.

| Viewport | Executed | Page-level horizontal overflow | Console errors | Notes |
| --- | --- | --- | --- | --- |
| 320×568 | Yes | 0 after layout settled | None | Visible service card fitted inside the viewport on a second measurement. |
| 375×812 | Yes | 0 | None | Work filters scroll inside their own row. |
| 390×844 | Yes | 0 | None | Mobile menu open, scroll lock, and Escape close verified. |
| 768×1024 | Yes | 0 | None | |
| 1024×768 | Yes | 0 on repeat | None | One earlier homepage sample reported 8px and did not reproduce. Decorative blurs and off-stage carousel cards extend outside the viewport and are clipped. |
| 1440×900 | Yes | 0 | None | Skip link verified here. |

This was an overflow, console, image, and H1 check. It was not a full visual design review of spacing, typography, or every tap target. Primary buttons use a 44px height (`h-11`) or larger (`h-13`). Footer links are smaller text links.

### Browsers

| Browser | Status | What was executed |
| --- | --- | --- |
| Google Chrome 156 | Executed | Matrix above, contact validation, contact 503 message, skip link. |
| Microsoft Edge 156 | Partially executed | Homepage at 1440×900 and contact at 390×844 only. |
| Mozilla Firefox | Not tested | Browser binary unavailable. |
| Safari | Not tested | No macOS or iOS environment. |
| Playwright WebKit | Not tested | Matching browser build not installed. WebKit would not equal Safari. |

---

## H. Performance Results

No Core Web Vitals score is claimed.

| Measurement | Result |
| --- | --- |
| Lighthouse | Not run. |
| Field data (CrUX or Search Console) | Not available. |
| Lab device | Local Windows desktop, system Chrome 156 headless, no CPU or network throttle. |
| URL | `http://localhost:3456/` after earlier navigations. |
| Why timings are discarded | Document `transferSize` was 300 bytes, which is a warm cache. LCP entries were not captured because the observer was not registered before paint. Publishing those milliseconds would be misleading. |
| Hero image | 198 KB JPEG, explicitly unoptimized, `priority`. This is the concrete optimization defect (PERF-001). |
| Largest built JS chunk on disk | 224.2 KB uncompressed (` .next/static/chunks/1s37vwjm584j-.js`). CSS chunk 82.5 KB. Gzip of those files was not measured individually. HTML responses were gzip-encoded. |
| Fonts | Geist Sans and Geist Mono via `next/font` (`geist` package). No Google Fonts request was found in source. |
| Third-party scripts | None found in `src`. The captured same-origin resource list showed no analytics host. The list was incomplete because of cache. |
| Render-blocking risk | Not measured with a cold throttled run. |

Reference thresholds, for a future production run only: LCP good at 2.5 s or less, INP good at 200 ms or less, CLS good at 0.1 or less. A Lighthouse lab run is still not field data. INP was not measured.

---

## I. Accessibility Findings

Confirmed:

- **A11Y-001.** Brand orange text and links are below 4.5:1.
- **A11Y-002.** The homepage services carousel auto-advances without a persistent pause control.

Passed in the checks that were run:

- `lang="en"`, one H1, skip link, labeled contact fields, error summary on submit, mobile dialog name, Escape closes the menu, body scroll locks while it is open, visible `:focus-visible` styles exist in CSS, image `alt` on the sampled pages, primary button contrast.

Still required before any WCAG conformance statement:

- Screen reader on header, mobile dialog, services dropdown, carousel, accordion, and the contact errors.
- Full keyboard path through the desktop services menu, filter chips, and article table of contents.
- 200% and 400% zoom reflow.
- Forced reduced motion.
- A contrast check on rendered gradients, not only flat tokens.
- Focus appearance on orange buttons, where the outline color is the same orange as the button and sits on the page background.

Automated scans cannot establish WCAG 2.2 AA conformance. None was run.

---

## J. Recommended Fix Order

### 1. Immediate security and data-exposure risks

No leaked secret was confirmed. Before any public deploy:

- Set the production site URL and rebuild (SEO-001 also prevents localhost URLs from being indexed).
- Add nosniff, referrer policy, and framing protection; plan HSTS on the HTTPS host (SEC-001, SEC-002).
- Replace the in-memory rate limit if the host runs more than one instance (SEC-005).

### 2. Critical functionality and broken conversion paths

- Configure Resend or the webhook, plus a real inbox, and prove one staging submission (QA-001).
- Add a public email only if it is a monitored address. The UI already hides empty contact details.

### 3. SEO and indexability

- Rebuild sitemap, robots, canonicals, and JSON-LD against the HTTPS origin (SEO-001, SEO-008, SEO-009).
- Attach the Open Graph image to every page and align the homepage social text (SEO-005, SEO-006).
- Finish or `noindex` the legal templates before they are crawled (QA-003).
- Shorten the longest titles when convenient (SEO-003).
- Add article dates when those articles are actually published (SEO-011).

### 4. Accessibility and responsive defects

- Darken text orange (A11Y-001).
- Add a carousel pause control (A11Y-002).
- Manually verify reduced motion, zoom, and the scrollable work filters.

### 5. Performance

- Optimize the hero image (PERF-001).
- Run Lighthouse on the production host before treating speed as done (QA-010).

### 6. Minor polish and maintainability

- Fix the three ESLint errors (QA-011).
- Restore `node_modules` and run unit tests and Playwright (QA-013, QA-016).
- Remove unused public SVGs and the duplicate industry image (QA-019).
- Remove `X-Powered-By` if desired (SEC-007).

---

## K. Manual Testing Checklist

Record PASS or FAIL in the last column. Use the production or staging site for rows that say so. Use test data only. Do not submit a real customer lead to a live inbox unless you intend to receive it.

| # | Steps | Expected | Result |
| --- | --- | --- | --- |
| 1 | Open the production `https://` homepage. Click the padlock. | Certificate is valid and names the site. | |
| 2 | Open `http://` and the www and non-www hosts. | One host is canonical. The others redirect once to it over HTTPS. No loop. | |
| 3 | View source on `/`, `/contact`, and one article. | Canonical, `og:url`, and `og:image` use that HTTPS origin. The image URL returns an image. | |
| 4 | Open `/robots.txt` and `/sitemap.xml`. | 200. Sitemap locs are HTTPS, unique, and match the public pages. `/api/` is disallowed. Important pages are allowed. | |
| 5 | In Chrome devtools, inspect the document response headers. | Nosniff, referrer policy, and framing control are present. HSTS is present on HTTPS. | |
| 6 | Share debugger or “view source” social tags for `/services/ai-solutions`. | Title, description, and image are present and match the page. | |
| 7 | On staging, submit the contact form with a test identity you control. | Success appears only after the provider accepts it. The message arrives once. | |
| 8 | Submit the form with an empty required field, then with `not-an-email`. | Errors name the fields. Focus moves to the first invalid field. Values stay so you can correct them. | |
| 9 | Turn off the network and submit a valid form. | An error is shown. Success is not shown. | |
| 10 | Visit `/does-not-exist` and `/work/not-a-real-project`. | HTTP 404, the custom page, and a working home link. | |
| 11 | Read the privacy page against the live tags and the form. | Business identity, provider names, and dates are filled in. No analytics tag exists unless the policy lists it. Counsel has reviewed it. | |
| 12 | At 320, 390, 768, and 1440 pixels wide, check home, services, work, and contact. | No sideways page scroll. Header, hero, menu, form, and footer are usable. | |
| 13 | On a phone, open the menu, tab or swipe through it, press Escape or the close control, and follow “Start a Project”. | Menu locks the page, closes, and the contact page opens. | |
| 14 | On `/work`, scroll the category chips and activate one with the keyboard. | The chip is reachable, results update, and the URL can be copied. | |
| 15 | Repeat home and contact in Firefox and, on a Mac or iPhone, Safari. | Layout, menu, and form match Chrome. Console has no errors. | |
| 16 | Run Lighthouse mobile against the production homepage. | Record LCP, CLS, and TBT. Compare with Search Console field data later. | |
| 17 | Enable “reduce motion” and reload the homepage. | The services carousel does not auto-advance. Sections do not fade in from invisible. | |
| 18 | Zoom to 200% and then 400% on `/contact`. | Text reflows. The form can be completed. Content is not clipped by `overflow-x`. | |
| 19 | Tab from the top of the homepage through the header, carousel, and footer. | Skip link appears, focus is visible, and no focus is trapped. | |
| 20 | With a screen reader, submit an invalid contact form. | The error summary and the field errors are announced. | |

---

## L. Final Conclusion

The local production build of this Next.js 16 site renders 31 public routes with unique titles, unique descriptions, one H1, a real 404, and a contact form that will not show success when delivery is unavailable. Lint does not pass. Unit tests and the repository’s end-to-end suite were not executed in this environment. Firefox, Safari, Lighthouse, and the public hostname were not tested.

The site is not ready to launch until the production HTTPS origin is baked into the build, a contact provider is proven with a staging message, legal templates are finished or removed from the index, and the missing response headers are confirmed on the real host.

Recommended next step: fix nothing in bulk yet. Approve a first change set for SEO-001 and QA-001, then repeat the canonical, sitemap, and contact checks against staging.


---

## R. Retest after fixes

**Retest date:** 27 October 2026. **Evidence:** local production build and server, built with the verification-only origin `https://qa.example.test` (reserved `.test` TLD; not a real domain). Full detail, commands and exit codes: [`portfolio-qa-fix-report.md`](./portfolio-qa-fix-report.md). Sections A–L above are not edited and describe the pre-fix state.

**Status after fixes: ready for staging, not ready for production.**

| Finding | Original status | Retest status | One-line evidence |
| --- | --- | --- | --- |
| SEO-001 | FAIL (HIGH) | PASS (local) | Production build fails without an https `NEXT_PUBLIC_SITE_URL`; with one, 31/31 routes use it and 0 `localhost` remain in HTML. |
| SEO-003 | FAIL (LOW) | PASS | Titles are 30–62 characters (home 55). |
| SEO-005 | FAIL (MEDIUM) | PASS | `og:image`/`twitter:image` (1200×630) on 31/31 routes. |
| SEO-006 | FAIL (MEDIUM) | PASS | Homepage `<title>`, `og:title`, `twitter:title` and descriptions are identical. |
| SEO-008 | PARTIAL (MEDIUM) | PASS | `Host` directive removed; `Sitemap:` on the configured origin. |
| SEO-009 | PARTIAL (HIGH) | PASS (local) | 28 unique absolute URLs on the origin; unfinished legal pages excluded. |
| SEO-011 | FAIL (LOW) | PARTIAL | Article `image` added; `datePublished` still absent because no real dates exist. |
| SEC-001 | FAIL (MEDIUM) | PASS (app layer) | CSP, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options, COOP present; no CSP errors in Chromium on 31 routes. HSTS is a host-level item, unverified. |
| SEC-005 | FAIL (MEDIUM) | PARTIAL | Spoofed `X-Forwarded-For` no longer bypasses limits; shared-store interface added; no shared store provisioned. |
| SEC-007 | FAIL (LOW) | PASS | `X-Powered-By` absent. |
| A11Y-001 | FAIL (MEDIUM) | PASS (sampled) | `#a03d06` text orange; 0 of 1,965 sampled text nodes below AA. Two extra contrast defects (muted grey, white on orange) found and fixed. |
| A11Y-002 | FAIL (MEDIUM) | PASS | Persistent keyboard-operable Pause/Play on both carousels. |
| A11Y-005 | PARTIAL (LOW) | PARTIAL | Carousel verified with emulated reduced motion; remainder by code review; manual steps supplied. |
| QA-001 | FAIL (HIGH) | PARTIAL | Delivery hardened and exercised against a loopback mock; no real provider configured, so the live form still cannot deliver. |
| QA-003 | FAIL (MEDIUM) | PARTIAL | Legal pages are `noindex`, out of the sitemap and still templates until the owner supplies facts. |
| QA-011 | FAIL (MEDIUM) | PASS | `npm run lint` exit 0, no suppressions. |
| QA-013 | BLOCKED | PASS on Node 22; BLOCKED on Node 20.18 | 51 tests pass on Node 22; the system Node 20.18.0 is below the toolchain minimum (20.19). |
| QA-016 | NOT TESTED | PASS (Chromium) | 150 passed, 0 failed, 68 skipped by design. |
| QA-017 | PARTIAL (HIGH) | PARTIAL | Same dependency as QA-001. |
| QA-019 | FAIL (LOW) | PASS | Seven unused files removed; they now return 404. |
| PERF-001 | FAIL (MEDIUM) | PASS (measured locally) | Hero served via the optimizer: 17–80 KB at common widths vs 198 KB. No Lighthouse run. |

Final gate on the fixed tree: `npm run check` exit 0 (lint, typecheck, 51 unit tests, production build). Not retested and therefore unchanged from the audit: SEC-002 (production TLS/redirects), QA-007 to QA-010 and QA-020 (other browsers, Lighthouse), A11Y-007 (full WCAG conformance), QA-015 (`npm audit`; dependencies unchanged).
