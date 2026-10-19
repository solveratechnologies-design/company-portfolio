"use client";

import { useState } from "react";
import type { Article, ArticleCategory } from "@/types/article";
import { cn } from "@/lib/utils";
import { ArticleCard } from "./ArticleCard";

const PAGE_SIZE = 3;

/** Category navigation + "Load more" for the insights listing. */
export function ArticleGrid({ articles, categories }: { articles: Article[]; categories: ArticleCategory[] }) {
  const [category, setCategory] = useState<ArticleCategory | "All">("All");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = category === "All" ? articles : articles.filter((a) => a.category === category);
  const shown = filtered.slice(0, visible);
  const available = categories.filter((c) => articles.some((a) => a.category === c));

  return (
    <div>
      <div role="group" aria-label="Article categories" className="flex flex-wrap gap-2">
        {(["All", ...available] as const).map((c) => {
          const selected = category === c;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                setCategory(c);
                setVisible(PAGE_SIZE);
              }}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                selected ? "border-ink bg-ink text-white" : "border-line bg-white text-ink/75 hover:border-ink/30 hover:text-ink",
              )}
            >
              {c === "All" ? "All topics" : c}
            </button>
          );
        })}
      </div>
      <p role="status" aria-live="polite" className="sr-only">
        Showing {shown.length} of {filtered.length} articles.
      </p>

      {filtered.length === 0 ? (
        <p className="mt-10 rounded-[var(--radius-card)] border border-dashed border-line p-10 text-center text-muted">No articles in this topic yet.</p>
      ) : (
        <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {shown.map((a, i) => (
            <li key={a.slug}>
              <ArticleCard article={a} index={i} />
            </li>
          ))}
        </ul>
      )}

      {visible < filtered.length && (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="inline-flex h-11 items-center rounded-full border border-line bg-white px-6 text-sm font-medium text-ink transition-colors hover:border-ink/30 hover:bg-paper"
          >
            Load more articles
            <span className="ml-2 text-muted">({filtered.length - visible} more)</span>
          </button>
        </div>
      )}
    </div>
  );
}
