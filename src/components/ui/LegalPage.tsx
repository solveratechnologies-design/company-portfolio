import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { PageHero } from "./PageHero";
import { Container, Section } from "./Container";
import { slugify } from "@/lib/utils";
import { legalNav } from "@/data/navigation";

export interface LegalSection {
  title: string;
  paragraphs?: string[];
  list?: string[];
}

export function LegalPage({ title, intro, href, sections }: { title: string; intro: string; href: string; sections: LegalSection[] }) {
  return (
    <>
      <PageHero breadcrumbs={[{ label: title, href }]} eyebrow="Legal" title={title} description={intro} size="compact" />
      <Section>
        <Container className="grid gap-12 lg:grid-cols-[240px_1fr] lg:gap-16">
          <nav aria-label={`${title} sections`} className="lg:sticky lg:top-28 lg:self-start">
            <p className="font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">Contents</p>
            <ol className="mt-3 flex flex-col gap-1.5 text-sm">
              {sections.map((s, i) => (
                <li key={s.title}>
                  <a href={`#${slugify(s.title)}`} className="text-muted hover:text-ink">
                    {i + 1}. {s.title}
                  </a>
                </li>
              ))}
            </ol>
            <p className="mt-8 font-mono text-[0.7rem] uppercase tracking-[0.16em] text-muted">Other policies</p>
            <ul className="mt-3 flex flex-col gap-1.5 text-sm">
              {legalNav
                .filter((l) => l.href !== href)
                .map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-brand hover:text-brand-600">
                      {l.label}
                    </Link>
                  </li>
                ))}
            </ul>
          </nav>
          <div className="max-w-[72ch]">
            <p className="mb-10 flex items-start gap-3 rounded-2xl border border-amber-300/60 bg-amber-50 p-4 text-sm text-amber-900">
              <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" />
              <span>
                <strong className="font-semibold">Template notice:</strong> this policy is a starting template. It must be reviewed by
                qualified legal counsel and completed with Solvera Technologies&apos; registered business details and effective date
                before publication.
              </span>
            </p>
            {sections.map((s, i) => (
              <section key={s.title} id={slugify(s.title)} aria-labelledby={`${slugify(s.title)}-h`} className="border-t border-line py-8 first:border-t-0 first:pt-0">
                <h2 id={`${slugify(s.title)}-h`} className="text-[1.35rem] font-semibold tracking-tight">
                  {i + 1}. {s.title}
                </h2>
                {s.paragraphs?.map((p) => (
                  <p key={p} className="mt-4 leading-relaxed text-ink/80">
                    {p}
                  </p>
                ))}
                {s.list && (
                  <ul className="mt-4 flex list-disc flex-col gap-2 pl-6 leading-relaxed text-ink/80 marker:text-brand">
                    {s.list.map((li) => (
                      <li key={li}>{li}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </Container>
      </Section>
    </>
  );
}
