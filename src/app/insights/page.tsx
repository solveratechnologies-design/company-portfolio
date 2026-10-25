import { pageMetadata } from "@/lib/seo";
import { articleCategories } from "@/data/articles";
import { getContent } from "@/content";
import { ShowSection } from "@/components/ui/ShowSection";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArticleCard } from "@/components/insights/ArticleCard";
import { ArticleGrid } from "@/components/insights/ArticleGrid";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata = pageMetadata({
  title: "Insights",
  description:
    "Practical guides on websites, AI, automation and digital marketing — helping business owners and teams make better technology decisions.",
  path: "/insights",
});

export default async function InsightsPage() {
  const { articles } = await getContent();
  const featured = articles.find((article) => article.featured) ?? articles[0];
  const rest = featured ? articles.filter((article) => article.slug !== featured.slug) : articles;
  return (
    <>
      <ShowSection page="insights" section="hero">
      <PageHero
        breadcrumbs={[{ label: "Insights", href: "/insights" }]}
        eyebrow="Insights"
        title="Practical thinking for better digital decisions."
        description="Guides on websites, AI, automation and growth — written to be useful, not to fill a content calendar."
        size="compact"
      />
      </ShowSection>
      {featured ? (
      <ShowSection page="insights" section="featured">
      <Section labelledBy="featured-title" className="pb-0! md:pb-0!">
        <Container>
          <h2 id="featured-title" className="mb-6 font-mono text-xs uppercase tracking-[0.16em] text-muted">
            Featured guide
          </h2>
          <ArticleCard article={featured} layout="featured" />
        </Container>
      </Section>
      </ShowSection>
      ) : null}
      <ShowSection page="insights" section="list">
      <Section labelledBy="all-articles-title">
        <Container>
          <SectionHeading eyebrow="Library" id="all-articles-title" title="All articles" />
          <div className="mt-10">
            <ArticleGrid articles={rest} categories={articleCategories} />
          </div>
        </Container>
      </Section>
      </ShowSection>
      <ShowSection page="insights" section="cta">
      <FinalCTA title="Have a question these guides don't answer?" description="Tell us about your situation — we're happy to point you in the right direction." secondary={{ label: "Browse services", href: "/services" }} />
      </ShowSection>
    </>
  );
}
