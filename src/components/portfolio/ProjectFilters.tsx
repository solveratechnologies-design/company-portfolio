"use client";

import { useEffect, useState } from "react";
import type { Project, ProjectCategory } from "@/types/project";
import { filterProjects, projectCategories } from "@/data/projects";
import { cn } from "@/lib/utils";
import { ProjectGrid } from "./ProjectGrid";

type Filter = ProjectCategory | "All";

function readCategoryFromUrl(): Filter {
  const value = new URLSearchParams(window.location.search).get("category");
  return (projectCategories as string[]).includes(value ?? "") ? (value as ProjectCategory) : "All";
}

/**
 * Category filter for the portfolio. Updates results without a page reload and
 * mirrors the selection in the URL (?category=…) so filtered views can be shared.
 */
export function ProjectFilters({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<Filter>("All");

  useEffect(() => {
    // Sync from the URL after mount (also on back/forward).
    const sync = () => setFilter(readCategoryFromUrl());
    sync();
    window.addEventListener("popstate", sync);
    return () => window.removeEventListener("popstate", sync);
  }, []);

  function select(next: Filter) {
    setFilter(next);
    const url = new URL(window.location.href);
    if (next === "All") url.searchParams.delete("category");
    else url.searchParams.set("category", next);
    window.history.replaceState(window.history.state, "", url);
  }

  const counts = Object.fromEntries(projectCategories.map((c) => [c, projects.filter((p) => p.category === c).length]));
  const filtered = filterProjects(projects, filter);
  const featured = filtered.filter((p) => p.featured);
  const more = filtered.filter((p) => !p.featured);

  return (
    <div>
      <section aria-labelledby="filters-title" className="sticky top-[4.5rem] z-30 -mx-5 border-b border-line bg-canvas/90 px-5 py-4 backdrop-blur sm:-mx-8 sm:px-8">
        <h2 id="filters-title" className="sr-only">
          Filter projects by category
        </h2>
        <div role="group" aria-label="Project categories" className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {(["All", ...projectCategories] as Filter[]).map((c) => {
            const selected = filter === c;
            const count = c === "All" ? projects.length : counts[c];
            return (
              <button
                key={c}
                type="button"
                aria-pressed={selected}
                onClick={() => select(c)}
                className={cn(
                  "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  selected ? "border-ink bg-ink text-white" : "border-line bg-white text-ink/75 hover:border-ink/30 hover:text-ink",
                )}
              >
                {c === "All" ? "All Projects" : c}
                <span className={cn("rounded-full px-1.5 text-xs", selected ? "bg-white/15" : "bg-paper text-muted")}>{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      <p role="status" aria-live="polite" className="sr-only">
        Showing {filtered.length} {filtered.length === 1 ? "project" : "projects"}
        {filter !== "All" ? ` in ${filter}` : ""}.
      </p>

      {filtered.length === 0 ? (
        <div className="mt-12 rounded-[var(--radius-card)] border border-dashed border-line p-12 text-center">
          <p className="font-semibold">No projects in this category yet.</p>
          <p className="mt-2 text-muted">We&apos;re happy to discuss how we would approach a {filter.toLowerCase()} project.</p>
          <button type="button" onClick={() => select("All")} className="mt-5 text-sm font-medium text-brand hover:text-brand-600">
            Show all projects
          </button>
        </div>
      ) : (
        <>
          {featured.length > 0 && (
            <section aria-labelledby="featured-projects-title" className="pt-12">
              <h2 id="featured-projects-title" className="mb-6 font-mono text-xs uppercase tracking-[0.16em] text-muted">
                Featured projects
              </h2>
              <ProjectGrid projects={featured} columns={2} size="large" />
            </section>
          )}
          {more.length > 0 && (
            <section aria-labelledby="more-projects-title" className="pt-16">
              <h2 id="more-projects-title" className="mb-6 font-mono text-xs uppercase tracking-[0.16em] text-muted">
                {featured.length > 0 ? "More work" : "Projects"}
              </h2>
              <ProjectGrid projects={more} columns={3} />
            </section>
          )}
        </>
      )}
    </div>
  );
}
