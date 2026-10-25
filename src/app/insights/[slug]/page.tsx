import { notFound } from "next/navigation";
import { Clock } from "lucide-react";
import type { ArticleBlock } from "@/types/article";
import { getTableOfContents, readingTime } from "@/data/articles";
import { getContent } from "@/content";
import { absoluteUrl, articleJsonLd, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { JsonLd } from "@/components/ui/JsonLd";
import { ArticleCover } from "@/components/visuals/ArticleCover";
import { TableOfContents } from "@/components/insights/TableOfContents";
import { RelatedArticles } from "@/components/insights/RelatedArticles";
import { ShareControls } from "@/components/insights/ShareControls";
import { FinalCTA } from "@/components/sections/FinalCTA";

export async function generateStaticParams() {
  const { articles } = await getContent();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const { articles } = await getContent();
  const article = articles.find((item) => item.slug === slug);
  if (!article) return pageMetadata({ title: "Article not found", description: "This article could not be found.", path: "/insights", noIndex: true });
  return pageMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/insights/${article.slug}`,
    type: "article",
    publishedTime: article.publishedAt,
  });
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 id={block.id} className="mt-12 text-[1.65rem] font-semibold leading-tight tracking-tight text-ink first:mt-0">
          {block.text}
        </h2>
      );
    case "p":
      return <p className="mt-5">{block.text}</p>;
    case "ul":
      return (
        <ul className="mt-5 flex list-disc flex-col gap-2 pl-6 marker:text-brand">
          {block.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="mt-5 flex list-decimal flex-col gap-3 pl-6 marker:font-mono marker:text-sm marker:text-brand">
          {block.items.map((i) => (
            <li key={i} className="pl-1">
              {i}
            </li>
          ))}
        </ol>
      );
    case "callout":
      return (
        <aside className="mt-8 rounded-2xl border-l-4 border-mint bg-mint-50 p-6">
          <p className="font-semibold text-ink">{block.title}</p>
          <p className="mt-2 text-ink/80">{block.text}</p>
        </aside>
      );
  }
}

export default async function ArticlePage({ params }: PageProps<"/insights/[slug]">) {
  const { slug } = await params;
  const { articles } = await getContent();
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();
  const related = articles
    .filter((item) => item.slug !== article.slug)
    .sort((a, b) => Number(b.category === article.category) - Number(a.category === article.category))
    .slice(0, 3);

  const toc = getTableOfContents(article);
  const minutes = readingTime(article);
  const url = absoluteUrl(`/insights/${article.slug}`);

  return (
    <>
      <JsonLd data={articleJsonLd(article)} />
      <PageHero
        breadcrumbs={[
          { label: "Insights", href: "/insights" },
          { label: article.title, href: `/insights/${article.slug}` },
        ]}
        eyebrow={article.category}
        title={article.title}
        description={article.excerpt}
        size="compact"
      >
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span>By {article.author}</span>
          {article.publishedAt && (
            <>
              <span aria-hidden>·</span>
              <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
            </>
          )}
          <span aria-hidden>·</span>
          <span className="inline-flex items-center gap-1">
            <Clock aria-hidden className="size-3.5" /> {minutes} min read
          </span>
        </p>
      </PageHero>

      <Section className="pt-12! md:pt-16!">
        <Container>
          <div data-reveal>
            <ArticleCover article={article} showCategory={false} className="aspect-[21/9] rounded-[1.75rem]" />
          </div>
          <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_260px] lg:gap-16">
            <article data-reveal className="max-w-[68ch] text-[1.075rem] leading-[1.75] text-ink/80">
              {article.body.map((b, i) => (
                <Block key={i} block={b} />
              ))}
              <div className="mt-12 border-t border-line pt-6">
                <ShareControls url={url} title={article.title} />
              </div>
            </article>
            <aside className="order-first lg:order-none">
              <div className="lg:sticky lg:top-28">
                <TableOfContents items={toc} />
              </div>
            </aside>
          </div>
        </Container>
      </Section>

      <Section tone="paper">
        <Container>
          <RelatedArticles articles={related} />
        </Container>
      </Section>

      <FinalCTA title="Want help applying this to your business?" description="Tell us what you're working on, and we'll suggest a practical next step." />
    </>
  );
}
