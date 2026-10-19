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
    <section className="on-dark relative isolate flex min-h-[80vh] items-center overflow-hidden bg-ink text-white">
      <div aria-hidden className="bg-grid-dark mask-radial absolute inset-0 -z-10" />
      <div aria-hidden className="absolute right-[-10%] top-[-20%] -z-10 size-[520px] rounded-full bg-brand/25 blur-[140px]" />
      <Container className="py-36">
        <div className="max-w-2xl">
          <Eyebrow tone="dark">Error 404</Eyebrow>
          <h1 className="mt-6 text-title font-semibold">This page took a different path.</h1>
          <p className="mt-6 text-lead text-white/70">
            The page you&apos;re looking for doesn&apos;t exist or may have moved. Here are a few useful places to continue.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/" size="lg" arrow>
              Back to home
            </ButtonLink>
            <ButtonLink href="/contact" size="lg" variant="outline-light">
              Contact us
            </ButtonLink>
          </div>
          <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 pt-6 text-sm">
            {serviceNav.map((s) => (
              <li key={s.href}>
                <Link href={s.href} className="text-white/70 hover:text-white">
                  {s.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/work" className="text-white/70 hover:text-white">
                Work
              </Link>
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}
