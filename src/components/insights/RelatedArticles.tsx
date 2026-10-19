import type { Article } from "@/types/article";
import { ArticleCard } from "./ArticleCard";

export function RelatedArticles({ articles, title = "Related articles" }: { articles: Article[]; title?: string }) {
  if (!articles.length) return null;
  return (
    <section aria-labelledby="related-articles-title">
      <h2 id="related-articles-title" className="text-heading font-semibold">
        {title}
      </h2>
      <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((a, i) => (
          <li key={a.slug}>
            <ArticleCard article={a} index={i} />
          </li>
        ))}
      </ul>
    </section>
  );
}
