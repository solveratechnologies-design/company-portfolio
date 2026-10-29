# Solvera Technologies — Portfolio QA Fix & Retest Report

**Date:** 27 October 2026
**Scope:** Fixes for the confirmed findings in [`portfolio-qa-audit.md`](./portfolio-qa-audit.md), followed by a retest.
**Evidence level:** Local production build (`next build` + `next start`) on `http://localhost:3100`, built with the verification-only origin `https://qa.example.test` (reserved `.test` TLD, **not** a real domain). Nothing was deployed, and no real host, TLS certificate, CDN, email provider or customer was involved.

> Not claimed anywhere in this report: production HTTPS/TLS/HSTS behavior, CDN behavior, live form delivery to a real provider, Lighthouse scores, real-user Core Web Vitals, Firefox/Safari/WebKit/Edge behavior, screen-reader behavior, an axe scan, or legal compliance.

---

## A. Summary

**Result: ready for staging; not ready for production.** Every code-level defect from the audit is fixed or hardened and verified locally. What remains needs facts, credentials or infrastructure that only the owner has (section E).

| Area | Outcome |
| --- | --- |
| Site origin / SEO URLs | One validated origin (`NEXT_PUBLIC_SITE_URL`). Production build **fails** without an https origin. All 31 routes: canonical, `og:url`, JSON-LD, robots and sitemap use it. 0 `localhost` occurrences in rendered HTML. |
| Social metadata | 31/31 pages have a 1200×630 `og:image` and `twitter:image`; titles/descriptions match the document. |
| Security headers | CSP, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options, COOP set; `X-Powered-By` removed. HSTS/redirects are host-level and unverified. |
| Contact form | Hardened and verified against a loopback mock (200 / 500 / 302 / hang / duplicate). **No real provider is configured**, so real delivery is unverified and the form still correctly answers "unavailable". |
| Legal pages | Gated: `noindex`, out of the sitemap, template notice, until the owner supplies the facts. Nothing invented. |
| Accessibility | Accessible orange for text/links, darker muted grey, focus ring, persistent Pause/Play on both carousels, reduced motion respected. Two extra contrast defects found and fixed. |
| Hero image | `unoptimized` removed; served as WebP via the optimizer, 17–80 KB at common widths vs 198 KB. |
| Quality gates | `npm run check` exit 0 (lint, typecheck, 51 unit tests, build). Playwright: 150 passed, 0 failed (Chromium). |

**Environment caveat:** the machine's Node is v20.18.0, below the 20.19 floor of the installed test toolchain, so `npm test` cannot start on it (details in D). Results marked Node 22 were produced with a temporary Node 22 binary (from `npx node@22`, in the npx cache) placed first on `PATH` for the session; the system Node, `package.json` and the lockfile were not changed. The production build itself also succeeded on Node 20.18.0 (row 11), so the site meets its declared `engines` (`>=20.9`); only the test toolchain needs the newer Node.

---

## B. Changes

### Site origin and SEO (SEO-001/007/008/009/010)

- **New** `src/config/site-url.ts`: validates `NEXT_PUBLIC_SITE_URL` (absolute, https only; `http` only for `localhost`/`127.0.0.1`; origin only; no credentials). Production without it throws an explicit error. Development/test fall back to `http://localhost:3000`.
- `src/config/site.ts` uses the resolver; it is the single source for `metadataBase`, canonicals, Open Graph, JSON-LD, robots, sitemap.
- `src/app/robots.ts`: removed the obsolete `host` directive; `Sitemap:` uses the origin.
- `src/app/sitemap.ts`: absolute, unique, public pages only; legal pages included only once complete.
- `.env.example`: `NEXT_PUBLIC_SITE_URL` is now an **empty** documented placeholder (it previously shipped `https://www.example.com`, which could have been copied into production).

### Social metadata and titles (SEO-003/005/006/011)

- `src/lib/seo.ts`: shared `socialImage` (the existing generated 1200×630 PNG) added to every page's Open Graph **and** Twitter metadata, avoiding the shallow-merge loss; `absoluteTitle` option; Article JSON-LD gets `image`.
- `src/app/page.tsx` now uses `pageMetadata()`: title, description, `og:*` and `twitter:*` are identical. Homepage title 74 → 55 characters.
- `src/app/layout.tsx`: fallback social defaults include the image.
- Article `seoTitle` (optional) shortens `<title>` while the visible H1 is unchanged; case-study titles drop the redundant category suffix; one service title shortened. Longest title is now 62 characters (was up to 83).
- No publication dates invented; no duplicate schema (one Organization + one WebSite from the layout).

### Security headers (SEC-001/007)

- `next.config.ts`: `poweredByHeader: false`; headers on all routes: CSP, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy` (camera, microphone, geolocation, payment, usb, browsing-topics denied), `X-Frame-Options: DENY`, `Cross-Origin-Opener-Policy: same-origin`.
- **CSP trade-off (documented in the file and README):** the site is statically prerendered, and nonce-based CSP would force dynamic rendering (Next.js docs: incompatible with the static shell). The policy therefore uses the documented no-nonce form: `script-src 'self' 'unsafe-inline'` and `style-src 'self' 'unsafe-inline'` (needed for Next bootstrap scripts and React inline styles). No `unsafe-eval` in production, no wildcards, no third-party origins, `object-src 'none'`, `base-uri 'self'`, `form-action 'self'`, `frame-ancestors 'none'`. `CSP_REPORT_ONLY=true` ships it report-only.
- Not added on purpose: HSTS, HTTP→HTTPS and www/apex redirects (host layer), `upgrade-insecure-requests` (would break plain-http local testing).

### Contact form (QA-001/017, SEC-004/005)

- `src/lib/contact.ts` / `src/app/api/contact/route.ts` (provider abstraction and Zod, 20 KB, origin, honeypot and min-fill checks preserved):
  - Success only on a provider **2xx**; non-2xx → `502`; redirects are **not followed** (`redirect: "manual"`); 10-second timeout → `502`.
  - Webhook URL must be https (http only for loopback test receivers); an invalid URL is treated as not configured.
  - Logs contain only provider name, status code or error class. Verified that names, emails, message text and the webhook secret never appear.
  - Duplicate protection: already-delivered id is acknowledged without re-sending; a concurrent same-id request gets `409 in_progress`; a failed delivery frees the id for retry. `Idempotency-Key` is sent to the webhook as well as Resend.
  - Client IP: `X-Forwarded-For`/`X-Real-IP` are **no longer trusted**. `CONTACT_CLIENT_IP_HEADER` names the header your proxy sets; the right-most `x-forwarded-for` entry is used. Unset → one shared flood bucket (20/10 min) that cannot be spoofed.
  - `RateLimitStore` interface + `setRateLimitStore()` for a shared store (no mandatory service or dependency). The default is per-instance memory and logs a one-time production warning.
- `ContactForm.tsx`: synchronous `useRef` guard so a fast double-submit cannot send two requests before React state updates.
- `.env.example`: `CONTACT_CLIENT_IP_HEADER`, `CSP_REPORT_ONLY`, webhook notes (all empty placeholders). `.env.local` was not touched.

### Legal pages (QA-003)

- **New** `src/config/legal.ts`: reads `LEGAL_ENTITY_NAME`, `LEGAL_REGISTERED_ADDRESS`, `LEGAL_JURISDICTION`, `LEGAL_EFFECTIVE_DATE`, `LEGAL_RETENTION_PERIOD`, `LEGAL_SERVICE_PROVIDERS` and requires `LEGAL_COUNSEL_REVIEWED=true`. Until all are present the pages are `noindex`, left out of the sitemap, show the template notice and keep visible bracketed placeholders.
- Privacy, terms and cookie pages rewritten to consume those facts. The cookie text now matches the code (no cookies, local storage or session storage in `src`; no analytics). This is a publication gate, **not** legal advice.

### Accessibility (A11Y-001/002/005, plus new A11Y-008)

- Tokens in `src/app/globals.css`: `--color-brand-ink #a03d06` (text/links; ≥ 4.88:1 on white, canvas, hero, nav, paper) and `--color-brand-ink-hover`. ~40 text/link usages moved from `text-brand`/`brand-600`; orange fills, icons and the primary button are unchanged.
- Focus outline and input focus border use `brand-ink` (the bright orange ring was 2.73:1).
- `ServiceOverviewCarousel` and `ServiceCategoryCarousel`: persistent keyboard-operable Pause/Play (hidden under `prefers-reduced-motion`, where nothing auto-rotates); user pause survives hover/focus changes; `aria-live` is `off` while rotating and `polite` when stopped.
- **A11Y-008 (new, found during retest):** `--color-muted` `#667085` → `#535d70` (it was 3.66:1 on the header tint and 3.88:1 on the hero tint, hitting the hero lead, eyebrow and logo tagline on every page); white numerals on orange step badges (`ServiceBlocks.tsx`) → ink (2.91:1 → 6.14:1).
- Reduced motion reviewed: global `prefers-reduced-motion: reduce` CSS neutralizes animation/transition durations, entrance animations only run under `no-preference`, smooth scrolling is turned off, and the JS-driven motion (both carousels, scroll-to-top, zoom cards) checks the media query. No gaps found; manual steps are in section E.

### Hero image (PERF-001)

- `HeroVisual.tsx`: removed `unoptimized`; uses `preload` (Next 16's replacement for the deprecated `priority`) because the hero is the LCP image at every viewport.

### ESLint and tests (QA-011/013/016)

- `Header.tsx`: scroll-derived state now read with `useSyncExternalStore` (no setState in an effect).
- `ServiceOverviewCarousel.tsx`: wrap-around computed as shortest circular distance, so the effect that called `setInstant(true)` and the extra `instant` state are gone.
- `ServiceCategoryCarousel.tsx`: previous slide tracked in state, not a ref read during render.
- No lint rule, TypeScript check or test was disabled or skipped to get green.
- Tests: `tests/contact-api.test.ts` (+8 tests: spoofed header, trusted header, timeout without PII in logs, redirect not followed, non-https webhook, loopback allowed, concurrent duplicate, retry after failure), new `tests/site-config.test.ts` (9 tests), `e2e/site.spec.ts` (sitemap/robots against the configured origin; per-route social metadata and low-contrast-orange guard; legal noindex; headers; carousel Pause/Play and reduced motion).
- Two test corrections, with reasons: `Accordion` unit test asserted `toBeVisible()` for a panel hidden with CSS that jsdom (`css: false`) never evaluates, so it now asserts the `inert` mechanism and the real collapsed height was confirmed in Chromium; the "homepage service cards" e2e depended on auto-rotation while the pointer rested on the carousel, so it now steps with the "Next service" button.

### Unused assets (QA-019)

- Removed after grep and hash check (no references; `industries-collaboration.jpg` is byte-identical to `collaboration.jpg`): `public/file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`, `images/brand/solvera-mark.svg`, `images/industries/industries-collaboration.jpg`. Recoverable from git.

### Documentation

- `README.md`: configuration table, contact-form hardening, rate-limit and client-IP guidance, legal-page gate, security-header rationale, Node requirement, launch checklist.

Dependencies: `package.json`, `package-lock.json` and `.env.local` are unchanged (verified with `git diff`).

---

## C. Retest

| Finding ID | Original issue | Fix applied | Retest result | Evidence | Remaining action |
| --- | --- | --- | --- | --- | --- |
| SEO-001 | All canonical/OG/JSON-LD/robots/sitemap URLs were `http://localhost:3000` | Validated single origin; production build requires https origin | **PASS** (local, placeholder origin) | `next build` without the variable exits 1 with `NEXT_PUBLIC_SITE_URL is not set…`. With `https://qa.example.test`: 31/31 routes have canonical `= origin + path`, `og:url = canonical`, all JSON-LD URLs on origin, 0 `localhost` in HTML. 9 unit tests for the resolver. | Set the real `NEXT_PUBLIC_SITE_URL` in the **build** environment and recheck on the live domain. |
| SEO-003 | Homepage title 74 chars; articles 74–82; case studies up to 83 | Shorter homepage title, `seoTitle` for articles, no category suffix on case studies | **PASS** | Titles are 30–62 chars on all 31 routes (home 55); still unique; e2e asserts ≤ 70 per route. | None. |
| SEO-005 | 30/31 pages had no `og:image`/`twitter:image` | Shared 1200×630 image in every `pageMetadata()` Open Graph and Twitter object | **PASS** | 31/31 routes: `og:image`/`twitter:image` = `<origin>/opengraph-image`, width 1200, height 630 (script + 31 e2e tests). | Validate previews with the social platforms' debuggers on the live domain (not done). |
| SEO-006 | Homepage `og:title`/`twitter:title` were only "Solvera Technologies"; descriptions differed | Homepage metadata defined once via `pageMetadata()` | **PASS** | On `/`: `<title>` = `og:title` = `twitter:title`; meta description = `og:description` = `twitter:description` (script, e2e, unit test). | None. |
| SEO-008 | robots.txt had `Host: http://localhost:3000` and a localhost sitemap | `host` removed; sitemap URL from origin | **PASS** | `robots.txt`: `Allow: /`, `Disallow: /api/`, `Sitemap: https://qa.example.test/sitemap.xml`; no `Host:` line; no `localhost`. | Confirm the live `Content-Type` and that crawlers can fetch it. |
| SEO-009 | Sitemap had 31 localhost URLs incl. unfinished legal pages | Absolute origin URLs; legal pages excluded until ready | **PASS** (local) | 28 `<loc>` entries, 28 unique, all on origin, no `localhost`, legal pages absent (e2e compares the exact set). | Submit to Search Console after launch. |
| SEO-011 | Article JSON-LD had no image or `datePublished` | Added `image`; dates left absent on purpose | **PARTIAL** | Rendered Article keys now include `image` (`<origin>/opengraph-image`); `datePublished` correctly absent (no real dates exist). One Organization + one WebSite, no duplicates. | Add real `publishedAt` dates when each article is published; the schema emits them automatically. |
| SEC-001 | No CSP, nosniff, Referrer-Policy, Permissions-Policy or framing protection | Headers in `next.config.ts` | **PASS** for the app layer; **HSTS not applicable locally** | Live response lists CSP (no `unsafe-eval`, no `*`), `nosniff`, `strict-origin-when-cross-origin`, Permissions-Policy, `X-Frame-Options: DENY`, COOP. Chromium logged no console/CSP errors on 31 routes × desktop + mobile. | HSTS, HTTP→HTTPS and www/apex redirects at the host; recheck headers on the live URL. CSP still allows `'unsafe-inline'` (documented trade-off). |
| SEC-005 | In-memory limiter; first `X-Forwarded-For` trusted (spoofable) | Header ignored unless named in `CONTACT_CLIENT_IP_HEADER`; shared flood bucket otherwise; pluggable `RateLimitStore` | **PARTIAL** | Unit tests: 21 requests with 21 spoofed `X-Forwarded-For` values → 429; trusted header isolates clients; right-most XFF used when trusted. | Choose and register a shared store for multi-instance hosting; set `CONTACT_CLIENT_IP_HEADER`; no flood test was run against a real deployment. |
| SEC-007 | `X-Powered-By: Next.js` | `poweredByHeader: false` | **PASS** | Header absent on `/` and the API (script + e2e). | None. |
| A11Y-001 | Orange text 2.73–4.01:1 | `text-brand-ink` `#a03d06`; focus ring and input focus darkened; also muted grey and white-on-orange badge (A11Y-008) | **PASS** (sampled) | 1,965 visible text nodes on 31 routes: 0 below AA (solid backgrounds; decorative `aria-hidden` illustrations and gradient/image backgrounds excluded). Keyboard focus outline measured `rgb(160, 61, 6)`, 2 px. Per-route guard test forbids small bright-orange text. | Hero accent "Grow Further." is large text in `#d35a12` (3.13:1 on the hero tint; passes the 3:1 large-text threshold only). Run axe and a manual pass. |
| A11Y-002 | Auto-advancing carousel had no pause control | Persistent Pause/Play on both carousels | **PASS** | e2e: Enter pauses, state persists after pointer/focus leave (4.5 s, no slide change), Space resumes. Browser: category carousel stays put while paused; autoplay advances after Play; mobile button 44×44. | Test with a real screen reader and a physical touch device. |
| A11Y-005 | Reduced-motion handling not verified | Reviewed; carousels hide the control and never auto-rotate | **PARTIAL** | Chromium `reducedMotion: "reduce"`: services carousel did not rotate over 4.5 s and no Pause control rendered. Global CSS and JS checks reviewed in code. | Verify the rest manually with the OS setting (steps in E). |
| QA-001 | Valid inquiry returned 503; no provider | Delivery hardened; no credentials added (none supplied) | **PARTIAL: cannot deliver until configured** | Real `next start` against a loopback mock, controlled fake data: provider 200 → HTTP 200; 500 → 502; 302 → 502 and redirect target never hit; hung provider → 502 after 10,029 ms; concurrent same id → 200 + 409, retry after success → 200 with no second delivery (mock saw 2 deliveries total); secret and `Idempotency-Key` headers sent. e2e: with no provider the page still shows "unavailable" and no success text. | Configure Resend or an https webhook, add verified public contact details, send **one** staging test. |
| QA-003 | Legal pages indexable, in sitemap, with placeholders | Gated by `src/config/legal.ts`; text built from supplied facts | **PARTIAL** | Pages return 200 with `robots: noindex, follow`, the template notice, and are absent from the sitemap (e2e + script). Unit test: not ready until all facts + `LEGAL_COUNSEL_REVIEWED=true`. | Owner must supply the facts (E) and have counsel review. Pages remain templates until then. |
| QA-011 | `npm run lint` failed with 3 errors | Three hook patterns refactored, no suppressions | **PASS** | `npm run lint` exit 0 on the final tree. | None. |
| QA-013 | Vitest could not start (missing Rolldown binding) | Restored the binding without saving it; ran under a compliant Node | **PASS on Node 22; BLOCKED on the system Node 20.18** | `npm run test` exit 0: 5 files, 51 tests. On Node 20.18.0 the suite still cannot start (jsdom dependency `require()`s an ES module; Vitest toolchain requires ≥ 20.19). | Upgrade local/CI Node to 20.19+ or 22.12+. |
| QA-016 | Playwright suite never run | Installed Chromium, ran the suite | **PASS (Chromium only)** | `npx playwright test`: 150 passed, 0 failed, 68 skipped by design (desktop-only/mobile-only tests skip in the other project). | Firefox and WebKit not installed or run. |
| QA-017 | CTA destination could not deliver | Same as QA-001 | **PARTIAL** | CTA labels and routes unchanged and working; delivery depends on QA-001. | As QA-001. |
| QA-019 | Unused starter SVGs and a duplicate photo served publicly | Removed after grep and hash check | **PASS** | HTTP: the five starter SVGs, `solvera-mark.svg` and `industries-collaboration.jpg` → 404; `collaboration.jpg`, `workspace.jpg`, `icon.svg` → 200. Build and e2e pass. | None. |
| PERF-001 | Hero shipped as an unoptimized 198,452-byte JPEG | Removed `unoptimized`; `preload` kept | **PASS** (measured locally; not a Lighthouse score) | `/_next/image` WebP: 17,446 B @384w, 37,882 @640w, 55,024 @828w, 79,712 @1080w, 93,400 @1200w, 136,076 @1920w (JPEG fallback 18,704 → 190,087). Preload link emitted; `currentSrc` is a `/_next/image` URL. | Measure LCP and Lighthouse on the production host and CDN. Industry photos were not re-measured. |

**New findings during retest**

| ID | Issue | Resolution |
| --- | --- | --- |
| A11Y-008 | Muted grey 3.66–3.88:1 on header/hero tints; white-on-orange numerals 2.91:1; two 7-px chips in the decorative mockup used bright orange | Fixed as described in B. Sample re-run: 0 failures. |
| QA-021 | Starter `Accordion` unit test and one e2e test were tied to jsdom CSS and rotation timing | Corrected as described in B (no coverage removed). |

---

## D. Test commands and exit status

| # | Command (shell: PowerShell, Windows) | Node | Exit | Result |
| --- | --- | --- | --- | --- |
| 1 | `npm test` (audit baseline) | v20.18.0 | 1 | Vitest could not load the Rolldown win32 binding (QA-013). |
| 2 | `npm install --no-save @rolldown/binding-win32-x64-msvc@1.2.14` | v20.18.0 | 0 | Restored the optional native binding only; `package.json` and lockfile unchanged. EBADENGINE warnings (Node < 20.19). |
| 3 | `npm test` | v20.18.0 | 1 | Workers fail: `ERR_REQUIRE_ESM` (`html-encoding-sniffer` → `@exodus/bytes`). With `NODE_OPTIONS=--experimental-require-module`: exit 1, stack overflow. Environment limit, not a code defect. |
| 4 | `npx --yes node@22 node_modules/vitest/vitest.mjs run` (before fixes) | v22 | 1 | 33 passed, 1 failed (`Accordion` test). |
| 5 | Same command after fixes | v22 | 0 | 5 files, 51 tests passed. |
| 6 | `npx eslint src tests e2e` | v20.18.0 | 0 | Clean. |
| 7 | `npm run lint` | v22.23.4 | 0 | Clean. |
| 8 | `npm run typecheck` | v22.23.4 | 0 | Clean. |
| 9 | `npm run test` | v22.23.4 | 0 | 5 files, 51 tests passed. |
| 10 | `npm run build` with `NEXT_PUBLIC_SITE_URL` unset | v20.18.0 | 1 | **Expected.** Fails with the explicit `SiteUrlError`; no localhost URLs can ship. |
| 11 | `npm run build` with `NEXT_PUBLIC_SITE_URL=https://qa.example.test` | v20.18.0 | 0 | 40 pages generated. |
| 12 | `npm run check` (lint && typecheck && test && build), final tree | v22.23.4 | 0 | All four stages passed (51 tests, 40 pages). |
| 13 | `npx playwright install chromium` | v20.18.0 | 0 | Installed into a user-level browser cache. |
| 14 | `npx playwright test`, final tree, against `next start -p 3100` | v22.23.4 (runner and server) | 0 | **150 passed, 0 failed, 68 skipped by design.** Earlier runs each had one failure: a timing-dependent existing test (Node 20.18.0 run) and my own over-long looping test (Node 22 run). Both were fixed and rerun (see B). |
| 15 | Route/sitemap/robots/headers/JSON-LD script (GET only), final tree | v22.23.4 | 0 | 31/31 routes pass every check; see C. An earlier run on the same code under Node 20.18.0 gave the same result. |
| 16 | Contact integration test (real build, loopback mock, fake data) | v22 | 0 | Results in C (QA-001). |
| 17 | Chromium behavior checks and rendered-text contrast sample | v22 | 0 | Header colour on scroll/navigation, carousels, accordion, focus ring, mobile overflow 0 px, 0 console errors; 1,965 text nodes sampled, 0 below AA. |

Not run: `npm audit` (dependencies unchanged), `next dev` with the new CSP, Lighthouse, axe, Firefox, WebKit/Safari, Microsoft Edge (rechecked), any production or staging URL.

---

## E. Outstanding requirements

| # | Needed from the owner / infrastructure | Why |
| --- | --- | --- |
| 1 | The real production https origin, set as `NEXT_PUBLIC_SITE_URL` **in the build environment** | The production build refuses to run without it; SEO URLs depend on it. |
| 2 | Contact provider: Resend key + recipient + verified sender, **or** an https webhook (+ secret); then one staging test submission | No provider is configured, so no inquiry can be delivered. |
| 3 | Verified public email/phone/address and social links (optional) | Hidden everywhere while empty. |
| 4 | Name of the client-IP header set by the real proxy/CDN → `CONTACT_CLIENT_IP_HEADER`; a shared rate-limit store registered via `setRateLimitStore()` on serverless/multi-instance hosting | Per-client limits and cross-instance accuracy. |
| 5 | Legal facts: registered entity name, registered address, governing jurisdiction, effective date, inquiry-data retention period, list of data-processing providers; then qualified-counsel review and `LEGAL_COUNSEL_REVIEWED=true` | Pages stay `noindex` and out of the sitemap until then. This repository does not provide legal advice or certification. |
| 6 | Real article publication dates (`publishedAt`) | `datePublished` is intentionally omitted. |
| 7 | Hosting layer: valid TLS, HSTS, HTTP→HTTPS, one canonical www/apex host, CDN caching, security-header recheck on the live URL | Not testable locally and not claimed. |
| 8 | Upgrade Node to 20.19+ or 22.12+ locally and in CI | `npm test` cannot start on 20.18.0. |
| 9 | Lighthouse and real-user Core Web Vitals on the production host; Firefox and Safari passes; axe plus a screen-reader pass | Not performed. |
| 10 | Social-preview check of the shared image with the platforms' debuggers | Not performed. |
| 11 | Real project screenshots, approved testimonials, analytics/consent if added | Content decisions; the cookie policy must be updated if analytics are added. |

**Manual reduced-motion check (A11Y-005):** enable "Reduce motion"/"Show animations" off in the OS (or Chrome DevTools → Rendering → *Emulate CSS prefers-reduced-motion: reduce*). Reload `/`, `/services`, `/solutions`, `/industries`. Confirm the services carousel does not rotate and has no Pause button, sections appear without slide/fade entrance, workflow diagrams show static lines/nodes, anchor links jump instead of scrolling smoothly, and the sticky card stack on `/solutions` and `/industries` does not zoom. Then turn the setting off and confirm Pause/Play works with Tab → Enter/Space.

---

## F. Launch recommendation

**Ready for staging. Not ready for production.**

Staging can be deployed now: the code fixes are in, verified locally, and the quality gates pass. Production should wait for items 1, 2, 5 and 7 in section E at minimum (real origin, working inquiry delivery, completed and reviewed legal pages, and verified HTTPS/redirect/header configuration at the host). Items 4 and 8 are strongly recommended before launch; items 6 and 9–11 can follow shortly after.
