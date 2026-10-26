import { chromium } from "playwright";

const browser = await chromium.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
});

async function measure(page, label) {
  await page.waitForTimeout(600);
  return page.evaluate((label) => {
    const pad = (el) => {
      if (!el) return null;
      const s = getComputedStyle(el);
      return `${s.paddingTop}/${s.paddingBottom}`;
    };
    const hero = document.querySelector("[data-hero] .mx-auto");
    const sections = [...document.querySelectorAll("main section")].map((el) => ({
      id: el.id || el.getAttribute("aria-labelledby") || el.querySelector("h2")?.textContent?.slice(0, 24) || "section",
      pad: pad(el),
    }));
    return { label, hero: pad(hero), sections };
  }, label);
}

const index = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await index.goto("http://localhost:3000/insights", { waitUntil: "domcontentloaded" });
await index.waitForSelector("#all-articles-title");
const desktopIndex = await measure(index, "index-desktop");
const href = await index.locator("a[href^='/insights/']").first().getAttribute("href");
await index.setViewportSize({ width: 390, height: 844 });
await index.waitForTimeout(300);
const mobileIndex = await measure(index, "index-mobile");

const article = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await article.goto(`http://localhost:3000${href}`, { waitUntil: "domcontentloaded" });
await article.waitForSelector("article");
const desktopArticle = await measure(article, "article-desktop");
await article.setViewportSize({ width: 390, height: 844 });
await article.waitForTimeout(300);
const mobileArticle = await measure(article, "article-mobile");

console.log(JSON.stringify({ href, desktopIndex, mobileIndex, desktopArticle, mobileArticle }, null, 2));
await browser.close();
