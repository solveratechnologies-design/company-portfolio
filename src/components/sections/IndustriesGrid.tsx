"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLayoutEffect, useRef } from "react";
import { industries, type Industry } from "@/data/industries";
import { Container } from "@/components/ui/Container";

function IndustryScrollCard({ industry }: { industry: Industry }) {
  const Icon = industry.icon;
  return (
    <li data-card className="origin-center">
      <Link
        href={`/industries#${industry.slug}`}
        className="flex h-[152px] flex-col rounded-[var(--radius-card)] border border-line bg-white p-4 shadow-[0_18px_40px_-30px_rgb(16_24_32/0.45)]"
      >
        <div className="flex items-center justify-between">
          <Icon aria-hidden className="size-5 text-brand" />
          <ArrowUpRight aria-hidden className="size-3.5 text-ink/25" />
        </div>
        <h3 className="mt-2.5 text-[0.95rem] font-semibold leading-snug">{industry.name}</h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted">{industry.summary}</p>
      </Link>
    </li>
  );
}

export function IndustriesGrid() {
  const trackRef = useRef<HTMLElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const frame = frameRef.current;
    const list = listRef.current;
    if (!track || !frame || !list) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frameId = 0;

    const apply = () => {
      frameId = 0;
      const cards = [...list.querySelectorAll<HTMLElement>("[data-card]")];

      if (motion.matches) {
        list.style.transform = "none";
        cards.forEach((card) => {
          card.style.transform = "none";
          card.style.opacity = "";
          card.style.filter = "";
          card.style.zIndex = "";
          const link = card.querySelector("a");
          if (link instanceof HTMLElement) {
            link.style.borderColor = "";
            link.style.boxShadow = "";
          }
        });
        return;
      }

      const rect = track.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      const progress = scrollable <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / scrollable));
      const sample = cards[0];
      const cardH = sample?.offsetHeight ?? 0;
      const gap = Number.parseFloat(getComputedStyle(list).rowGap || "0") || 0;
      const stride = cardH + gap;
      const lastIndex = Math.max(0, cards.length - 1);
      const position = progress * lastIndex;
      const activeIndex = Math.round(position);
      const pad = Number.parseFloat(getComputedStyle(frame).paddingTop || "0") || 0;
      const frameH = frame.clientHeight;
      const inset = 6;
      const firstY = inset;
      const lastY = frameH - pad - inset - (lastIndex * stride + cardH);
      const centerY = frameH / 2 - pad - (position * stride + cardH / 2);
      const y = Math.min(firstY, Math.max(lastY, centerY));
      list.style.transform = `translate3d(0, ${y}px, 0)`;

      cards.forEach((card, index) => {
        const active = index === activeIndex;
        card.style.transform = active ? "scale(1.03)" : "scale(0.97)";
        card.style.opacity = active ? "1" : "0.72";
        card.style.filter = active ? "none" : "none";
        card.style.zIndex = active ? "2" : "1";
        const link = card.querySelector("a");
        if (link instanceof HTMLElement) {
          link.style.borderColor = active ? "rgb(242 114 34 / 0.45)" : "";
          link.style.boxShadow = active ? "0 24px 48px -24px rgb(242 114 34 / 0.55)" : "none";
        }
      });
    };

    const onScroll = () => {
      if (!frameId) frameId = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    motion.addEventListener("change", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      motion.removeEventListener("change", onScroll);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <section ref={trackRef} aria-labelledby="industries-title" className="relative h-[165vh] bg-canvas motion-reduce:h-auto">
      <div className="sticky top-[4.5rem] flex h-[calc(100vh-4.5rem)] flex-col motion-reduce:static motion-reduce:h-auto">
        <Container className="flex h-full min-h-0 flex-col py-8 md:py-10">
          <div className="grid h-full min-h-0 items-stretch gap-8 lg:grid-cols-2 lg:gap-14">
            <div className="flex min-h-0 flex-col">
              <h2 id="industries-title" className="text-heading font-semibold text-ink">
                Industries we Support
              </h2>
              <p className="mt-4 max-w-md leading-relaxed text-muted">
                Practical technology for the way each sector works — its customers, its workflows, and the priorities that come with them.
              </p>
              <div
                ref={frameRef}
                className="relative mt-6 min-h-[280px] flex-1 overflow-hidden px-5 motion-reduce:h-auto motion-reduce:flex-none motion-reduce:overflow-visible motion-reduce:px-0"
              >
                <ul ref={listRef} className="flex w-full flex-col gap-3 self-start will-change-transform">
                  {industries.map((industry) => (
                    <IndustryScrollCard key={industry.slug} industry={industry} />
                  ))}
                </ul>
              </div>
            </div>
            <div className="relative min-h-[240px] lg:h-full lg:min-h-0">
              <div aria-hidden className="pointer-events-none absolute -bottom-6 left-[8%] right-[8%] h-16 rounded-full bg-brand/30 blur-3xl" />
              <div className="relative aspect-[5/4] overflow-hidden rounded-[1.75rem] shadow-[0_30px_60px_-40px_rgb(16_24_32/0.45)] lg:absolute lg:inset-0 lg:aspect-auto">
                <Image
                  src="/images/industries/collaboration.jpg"
                  alt="Two colleagues in conversation outside a modern office"
                  fill
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
