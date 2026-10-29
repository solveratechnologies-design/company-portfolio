import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { serviceNav } from "@/data/navigation";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you were looking for could not be found.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[80vh] items-center overflow-hidden bg-hero text-ink">
      <div aria-hidden className="bg-grid-light mask-radial absolute inset-0 -z-10" />
      <div aria-hidden className="absolute right-[-10%] top-[-20%] -z-10 size-[520px] rounded-full bg-brand/25 blur-[140px]" />
      <Container className="py-36">
        <div className="enter max-w-2xl">
          <Eyebrow>Error 404</Eyebrow>
          <h1 className="mt-6 text-title font-semibold">This page took a different path.</h1>
          <p className="mt-6 text-lead text-muted">
            The page you&apos;re looking for doesn&apos;t exist or may have moved. Here are a few useful places to continue.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/" size="lg" arrow>
              Back to home
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="secondary">
              Contact us
            </ButtonLink>
          </div>
          <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-6 text-sm">
            {serviceNav.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="text-ink/70 hover:text-brand-ink">
                  {s.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/work" className="text-ink/70 hover:text-brand-ink">
                Work
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
