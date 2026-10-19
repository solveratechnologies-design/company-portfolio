import type { CSSProperties } from "react";
import { BookOpen, FileText, Handshake, MessageCircle, Search, Sparkles, Users } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceFeatureGrid } from "@/components/services/ServiceFeatureGrid";
import { ButtonLink } from "@/components/ui/Button";
import { FinalCTA } from "@/components/sections/FinalCTA";

export const metadata = pageMetadata({
  title: "Careers",
  description: "How we work at Solvera Technologies, our working principles, and how to express interest in future opportunities.",
  path: "/careers",
});

/** Add verified openings here. While empty, the page explains that no roles are open. */
const openPositions: { title: string; type: string; location: string; summary: string }[] = [];

const principles = [
  { icon: MessageCircle, title: "Communicate clearly", description: "Write things down, share progress early, and ask questions before assumptions become problems." },
  { icon: Users, title: "Own the outcome", description: "We care about whether the solution works for the client, not just whether the task is done." },
  { icon: BookOpen, title: "Keep learning", description: "Technology changes quickly. We share what we learn and adopt new tools when they genuinely help." },
  { icon: Sparkles, title: "Craft that lasts", description: "Readable code, tidy workflows and documentation are part of the job — not extras." },
];

export default function CareersPage() {
  return (
    <>
      {/* 1 */}
      <PageHero
        breadcrumbs={[{ label: "Careers", href: "/careers" }]}
        eyebrow="Careers"
        title="Collaborative work, practical problems, lasting craft."
        description="We work as a small, connected team across development, AI, automation and marketing — with clear communication and real ownership."
        size="compact"
      />
      {/* 2 */}
      <Section labelledBy="principles-title">
        <Container>
          <SectionHeading eyebrow="How we work" id="principles-title" title="Working principles and culture." />
          <div className="mt-14">
            <ServiceFeatureGrid items={principles} columns={4} />
          </div>
        </Container>
      </Section>
      {/* 3 */}
      <Section tone="paper" labelledBy="positions-title">
        <Container>
          <SectionHeading eyebrow="Open positions" id="positions-title" title="Current openings" />
          {openPositions.length > 0 ? (
            <ul className="mt-10 flex flex-col gap-4">
              {openPositions.map((p) => (
                <li key={p.title} className="rounded-[var(--radius-card)] border border-line bg-white p-6">
                  <h3 className="text-card font-semibold">{p.title}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {p.type} · {p.location}
                  </p>
                  <p className="mt-3 text-muted">{p.summary}</p>
                </li>
              ))}
            </ul>
          ) : (
            <div data-reveal className="mt-10 rounded-[var(--radius-card)] border border-dashed border-ink/20 bg-white p-8 md:p-10">
              <p className="text-card font-semibold">There are no open positions right now.</p>
              <p className="mt-3 max-w-2xl leading-relaxed text-muted">
                We&apos;re always interested in hearing from thoughtful developers, designers, automation specialists and marketers.
                If you&apos;d like to be considered for future opportunities, send us a short introduction through the contact form
                with a link to your portfolio or profile.
              </p>
              <div className="mt-6">
                <ButtonLink href="/contact" variant="secondary" arrow>
                  Introduce yourself
                </ButtonLink>
              </div>
            </div>
          )}
        </Container>
      </Section>
      {/* 4 */}
      <Section labelledBy="application-title">
        <Container>
          <SectionHeading eyebrow="Application process" id="application-title" title="What to expect when a role opens." />
          <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: FileText, t: "Apply", d: "Share your CV or profile and examples of your work." },
              { icon: Search, t: "Review", d: "We review every application and reply either way." },
              { icon: MessageCircle, t: "Conversation", d: "A conversation about your experience and how you like to work." },
              { icon: Handshake, t: "Practical step", d: "A short, relevant exercise or portfolio walkthrough — never unpaid client work." },
            ].map(({ icon: Icon, t, d }, i) => (
              <li key={t} data-reveal style={{ "--i": i } as CSSProperties} className="rounded-[var(--radius-card)] border border-line p-6">
                <div className="flex items-center justify-between">
                  <Icon aria-hidden className="size-5 text-brand" />
                  <span className="font-mono text-xs text-muted">0{i + 1}</span>
                </div>
                <h3 className="mt-5 font-semibold">{t}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{d}</p>
              </li>
            ))}
          </ol>
        </Container>
      </Section>
      {/* 5 */}
      <FinalCTA title="Interested in working with us?" description="Introduce yourself and tell us what kind of work you enjoy most." primary={{ label: "Get in touch", href: "/contact" }} secondary={{ label: "About Solvera", href: "/about" }} />
    </>
  );
}
