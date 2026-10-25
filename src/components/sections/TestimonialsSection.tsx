import { CheckCircle2, ClipboardCheck, Eye, FileStack, MessagesSquare, Route } from "lucide-react";
import type { CSSProperties } from "react";
import { getContent } from "@/content";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";

const expectations = [
  { icon: MessagesSquare, title: "Clear communication", text: "Regular updates in plain language, a single point of contact, and quick answers to your questions." },
  { icon: ClipboardCheck, title: "Defined project scope", text: "A written scope with priorities and acceptance criteria — agreed before any work begins." },
  { icon: Eye, title: "Visible progress", text: "Access to staging builds and a shared board, so you can see exactly where things stand." },
  { icon: Route, title: "Structured delivery", text: "Milestones, review points and testing built into the plan, not added at the end." },
  { icon: FileStack, title: "Documentation & handover", text: "Documentation, credentials and ownership of everything we build, handed over in full." },
];

/**
 * Shows approved client testimonials when they exist in data/testimonials.ts.
 * Until then, it renders "What You Can Expect" — no invented quotes.
 */
export async function TestimonialsSection() {
  const { testimonials } = await getContent();
  if (testimonials.length > 0) {
    return (
      <Section tone="paper" labelledBy="testimonials-title">
        <Container>
          <SectionHeading eyebrow="Client feedback" id="testimonials-title" title="What clients say about working with us." />
          <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <li key={t.name} data-reveal style={{ "--i": i } as CSSProperties}>
                <figure className="flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-white p-7">
                  <blockquote className="text-lg leading-relaxed">“{t.quote}”</blockquote>
                  <figcaption className="mt-auto pt-6 text-sm">
                    <span className="block font-semibold">{t.name}</span>
                    <span className="text-muted">
                      {t.role}, {t.company}
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </Container>
      </Section>
    );
  }

  return (
    <Section tone="paper" labelledBy="expect-title">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <SectionHeading
          eyebrow="Working together"
          id="expect-title"
          title="What You Can Expect"
          description="How every Solvera engagement is run — whatever its size."
        />
        <ul className="flex flex-col divide-y divide-line rounded-[var(--radius-card)] border border-line bg-white">
          {expectations.map(({ icon: Icon, title, text }, i) => (
            <li key={title} data-reveal style={{ "--i": i } as CSSProperties} className="flex gap-5 p-6 md:p-7">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-mint-50 text-[#1f7a58]">
                <Icon aria-hidden className="size-5" />
              </span>
              <div>
                <h3 className="flex items-center gap-2 font-semibold">
                  {title}
                  <CheckCircle2 aria-hidden className="size-4 text-mint" />
                </h3>
                <p className="mt-1.5 leading-relaxed text-muted">{text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
