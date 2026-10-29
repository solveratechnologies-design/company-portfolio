import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import type { CSSProperties } from "react";
import type { Article } from "@/types/article";
import { readingTime } from "@/data/articles";
import { ArticleCover } from "@/components/visuals/ArticleCover";
import { formatDate, cn } from "@/lib/utils";

export function ArticleCard({ article, index = 0, layout = "card", headingLevel = 3 }: { article: Article; index?: number; layout?: "card" | "featured"; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as "h2" | "h3";
  const featured = layout === "featured";
  return (
    <Link
      href={`/insights/${article.slug}`}
      data-reveal
      style={{ "--i": index % 3 } as CSSProperties}
      className={cn(
        "group flex h-full overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-[translate,border-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-brand/30 hover:shadow-[0_24px_48px_-28px_rgb(16_24_32/0.35)]",
        featured ? "flex-col lg:flex-row" : "flex-col",
      )}
    >
      <div className={cn("relative overflow-hidden", featured ? "aspect-[16/9] lg:aspect-auto lg:w-1/2" : "aspect-[16/9]")}>
        <ArticleCover article={article} className="size-full transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
      </div>
      <div className={cn("flex flex-1 flex-col p-6 md:p-7", featured && "lg:p-10")}>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span className="font-medium text-brand-ink">{article.category}</span>
          {article.publishedAt && (
            <>
              <span aria-hidden>·</span>
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            </>
          )}
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden className="size-3.5" />
            {readingTime(article)} min read
          </span>
        </p>
        <H className={cn("mt-3 font-semibold tracking-tight text-ink transition-colors group-hover:text-brand-ink", featured ? "text-[1.6rem] leading-tight md:text-[2rem]" : "text-card")}>{article.title}</H>
        <p className="mt-3 leading-relaxed text-muted">{article.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-medium text-brand-ink">
          Read Article
          <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
