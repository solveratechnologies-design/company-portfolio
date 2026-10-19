import { expect, test, type Page } from "@playwright/test";
import { staticRoutes } from "../src/lib/routes";
import { projects } from "../src/data/projects";
import { articles } from "../src/data/articles";
import { services } from "../src/data/services";

const allRoutes = [
  ...staticRoutes,
  ...services.map((s) => s.href),
  ...projects.map((p) => `/work/${p.slug}`),
  ...articles.map((a) => `/insights/${a.slug}`),
];

function trackErrors(page: Page) {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  return errors;
}

test.describe("every route", () => {
  for (const route of allRoutes) {
    test(`${route} renders without errors or horizontal overflow`, async ({ page }) => {
      const errors = trackErrors(page);
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(page.locator("main")).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
      expect(errors).toEqual([]);
    });
  }
});

test("titles and descriptions are unique", async ({ page }) => {
  test.skip(test.info().project.name !== "desktop");
  const titles = new Map<string, string>();
  const descriptions = new Map<string, string>();
  for (const route of allRoutes) {
    await page.goto(route);
    const title = await page.title();
    const desc = (await page.locator('meta[name="description"]').getAttribute("content")) ?? "";
    expect(titles.has(title), `duplicate title on ${route} and ${titles.get(title)}`).toBe(false);
    expect(descriptions.has(desc), `duplicate description on ${route}`).toBe(false);
    titles.set(title, route);
    descriptions.set(desc, route);
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
  }
});

test("unknown slugs return the not-found page", async ({ page }) => {
  for (const path of ["/work/nope", "/insights/nope", "/this-does-not-exist"]) {
    const res = await page.goto(path);
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText(/different path/i);
  }
});

test("sitemap and robots are served", async ({ request }) => {
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBe(true);
  const xml = await sitemap.text();
  for (const route of allRoutes) expect(xml).toContain(`<loc>http://localhost:3000${route === "/" ? "" : route}</loc>`);
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("Sitemap:");
});

test.describe("desktop navigation", () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== "desktop"));

  test("services dropdown works with mouse and keyboard", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("navigation", { name: "Main" }).getByRole("button", { name: "Services" });
    await trigger.click();
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    await page.keyboard.press("Escape");
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await expect(trigger).toBeFocused();
    await page.keyboard.press("ArrowDown");
    await expect(page.getByRole("link", { name: /AI Solutions/ }).first()).toBeVisible();
    await trigger.click();
    await page.mouse.click(10, 600);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
    await trigger.click();
    await page.getByRole("navigation", { name: "Main" }).getByRole("link", { name: /Business Automation/ }).click();
    await expect(page).toHaveURL(/\/services\/business-automation$/);
    await expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  test("header CTA and logo navigate", async ({ page }) => {
    await page.goto("/about");
    await page.getByRole("banner").getByRole("link", { name: "Start a Project" }).click();
    await expect(page).toHaveURL(/\/contact$/);
    await page.getByRole("banner").getByRole("link", { name: /Home/ }).first().click();
    await expect(page).toHaveURL(/\/$/);
  });

  test("homepage service cards open the right pages", async ({ page }) => {
    for (const s of services) {
      await page.goto("/");
      await page.locator(`#services-overview-title`).scrollIntoViewIfNeeded();
      await page.locator(`main a[href="${s.href}"]`).filter({ hasText: "Learn More" }).click();
      await expect(page).toHaveURL(new RegExp(`${s.href}$`));
    }
  });
});

test.describe("mobile navigation", () => {
  test.beforeEach(({}, info) => test.skip(info.project.name !== "mobile"));

  test("opens, locks scroll, expands services, closes on Escape and after navigation", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByRole("button", { name: "Open menu" });
    await toggle.click();
    const dialog = page.getByRole("dialog", { name: "Site menu" });
    await expect(dialog).toBeVisible();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("hidden");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
    await page.getByRole("button", { name: "Open menu" }).click();
    await dialog.getByRole("button", { name: "Services" }).click();
    await dialog.getByRole("link", { name: "Digital Marketing" }).click();
    await expect(page).toHaveURL(/\/services\/digital-marketing$/);
    await expect(dialog).toBeHidden();
    expect(await page.evaluate(() => document.body.style.overflow)).toBe("");
  });
});

test("portfolio filter updates results without reload", async ({ page }) => {
  await page.goto("/work");
  await page.evaluate(() => ((window as unknown as { __marker: boolean }).__marker = true));
  const group = page.getByRole("group", { name: "Project categories" });
  await group.getByRole("button", { name: /AI Solutions/ }).click();
  const expected = projects.filter((p) => p.category === "AI Solutions").length;
  await expect(page.locator('main a[href^="/work/"]')).toHaveCount(expected);
  expect(await page.evaluate(() => (window as unknown as { __marker?: boolean }).__marker)).toBe(true);
  await expect(page).toHaveURL(/category=AI\+Solutions/);
});

test("case study shows correct data", async ({ page }) => {
  const p = projects[1];
  await page.goto(`/work/${p.slug}`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(p.title);
  await expect(page.getByText(p.problem)).toBeVisible();
});

test("article shows calculated reading time and table of contents", async ({ page }) => {
  const a = articles[0];
  await page.goto(`/insights/${a.slug}`);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(a.title);
  await expect(page.getByText(/min read/).first()).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Table of contents" })).toBeVisible();
});

test("contact form validates and never fakes success", async ({ page }) => {
  await page.goto("/contact?service=AI%20Solutions");
  await expect(page.getByLabel(/service required/i)).toHaveValue("AI Solutions");
  await page.getByRole("button", { name: /send inquiry/i }).click();
  await expect(page.getByLabel(/full name/i)).toHaveAttribute("aria-invalid", "true");
  await page.getByLabel(/full name/i).fill("Jane Doe");
  await page.getByLabel(/business email/i).fill("jane@company.com");
  await page.getByLabel(/project description/i).fill("We want an assistant that answers customer questions.");
  await page.getByLabel(/I agree/i).check();
  await page.waitForTimeout(2600); // honest user typing time (spam check)
  await page.getByRole("button", { name: /send inquiry/i }).click();
  // No provider is configured in tests: the API must refuse rather than pretend.
  await expect(page.locator("form").getByRole("alert")).toContainText(/unavailable|not connected/i);
  await expect(page.getByText(/has been sent/i)).toHaveCount(0);
  await expect(page.getByLabel(/full name/i)).toHaveValue("Jane Doe");
});

test("FAQ accordion toggles", async ({ page }) => {
  await page.goto("/faq");
  const q = page.getByRole("button", { name: /What kinds of businesses/ });
  await q.click();
  await expect(q).toHaveAttribute("aria-expanded", "true");
  await q.click();
  await expect(q).toHaveAttribute("aria-expanded", "false");
});
