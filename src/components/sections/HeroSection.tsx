import type { CSSProperties } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HeroVisual } from "@/components/visuals/HeroVisual";
import { getContent } from "@/content";
import { isSectionEnabled } from "@/config/sections";
import { CapabilityStrip } from "@/components/sections/CapabilityStrip";

export async function HeroSection() {
  const { services } = await getContent();
  return (
    <section aria-labelledby="hero-title" data-hero className="relative isolate overflow-hidden bg-hero text-ink">
      <div aria-hidden className="bg-grid-light absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,black_78%,transparent)]" />
      <div aria-hidden className="absolute -right-48 -top-48 -z-10 size-[760px] rounded-full bg-brand/30 blur-[150px]" />
      <div aria-hidden className="absolute -bottom-64 -left-40 -z-10 size-[560px] rounded-full bg-brand/15 blur-[150px]" />

      <Container size="wide" className="grid items-center gap-12 pb-10 pt-32 md:pt-40 lg:min-h-[min(860px,100svh)] lg:grid-cols-[1.12fr_1fr] lg:gap-8 lg:pb-14">
        <div className="flex flex-col gap-7">
          <div className="enter" style={{ "--i": 0 } as CSSProperties}>
            <Eyebrow>Strategy · Technology · Growth</Eyebrow>
          </div>
          <h1 id="hero-title" className="enter text-display font-semibold text-balance" style={{ "--i": 1 } as CSSProperties}>
            Build Smarter. Work Faster.{" "}
            <span className="text-brand-600">Grow Further.</span>
          </h1>
          <p className="enter max-w-xl text-lead text-muted" style={{ "--i": 2 } as CSSProperties}>
            Solvera Technologies helps businesses turn complex challenges into powerful digital experiences, intelligent automation, and measurable growth.
          </p>
          <div className="enter flex flex-wrap gap-3 pt-1" style={{ "--i": 3 } as CSSProperties}>
            <ButtonLink href="/contact" size="lg" arrow>
              Start a Project
            </ButtonLink>
            <ButtonLink href="/services" size="lg" variant="secondary">
              Explore Our Services
            </ButtonLink>
          </div>
        </div>
        <div className="flex w-full self-stretch justify-center lg:justify-end">
          <HeroVisual />
        </div>
      </Container>
      {isSectionEnabled("home", "capabilities") ? <CapabilityStrip services={services} /> : null}
    </section>
  );
}
