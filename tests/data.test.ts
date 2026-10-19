import { describe, expect, it } from "vitest";
import { filterProjects, getProject, getRelatedProjects, projects, projectCategories } from "@/data/projects";
import { articles, getTableOfContents, readingTime, countWords } from "@/data/articles";
import { services } from "@/data/services";
import { industries } from "@/data/industries";
import { isActivePath } from "@/data/navigation";

const unique = (xs: string[]) => new Set(xs).size === xs.length;

describe("content integrity", () => {
  it("has unique slugs", () => {
    expect(unique(projects.map((p) => p.slug))).toBe(true);
    expect(unique(articles.map((a) => a.slug))).toBe(true);
    expect(unique(industries.map((i) => i.slug))).toBe(true);
  });

  it("never reports results for non-client projects", () => {
    for (const p of projects) {
      if (p.status !== "client") expect(p.results ?? []).toHaveLength(0);
    }
  });

  it("uses valid categories and services for every project", () => {
    const slugs = services.map((s) => s.slug);
    for (const p of projects) {
      expect(projectCategories).toContain(p.category);
      p.services.forEach((s) => expect(slugs).toContain(s));
    }
  });

  it("has unique article heading ids", () => {
    for (const a of articles) {
      const ids = getTableOfContents(a).map((h) => h.id);
      expect(unique(ids)).toBe(true);
    }
  });
});

describe("project filtering", () => {
  it("returns everything for All", () => {
    expect(filterProjects(projects, "All")).toHaveLength(projects.length);
  });
  it("returns only the selected category", () => {
    const ai = filterProjects(projects, "AI Solutions");
    expect(ai.length).toBeGreaterThan(0);
    expect(ai.every((p) => p.category === "AI Solutions")).toBe(true);
  });
  it("finds projects by slug and excludes the current one from related", () => {
    expect(getProject("does-not-exist")).toBeUndefined();
    const related = getRelatedProjects(projects[0].slug);
    expect(related.map((p) => p.slug)).not.toContain(projects[0].slug);
  });
});

describe("reading time", () => {
  it("is calculated from content at ~220 wpm", () => {
    const body = Array.from({ length: 10 }, () => ({ type: "p" as const, text: Array(110).fill("word").join(" ") }));
    expect(countWords({ title: "", body })).toBe(1100);
    expect(readingTime({ title: "", body })).toBe(5);
  });
  it("is at least one minute", () => {
    expect(readingTime({ title: "Hi", body: [] })).toBe(1);
  });
});

describe("isActivePath", () => {
  it("matches home exactly and nested routes by prefix", () => {
    expect(isActivePath("/", "/")).toBe(true);
    expect(isActivePath("/work", "/")).toBe(false);
    expect(isActivePath("/work/clinic-intake-automation", "/work")).toBe(true);
    expect(isActivePath("/workshop", "/work")).toBe(false);
  });
});
