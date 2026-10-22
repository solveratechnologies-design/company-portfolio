"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Plays a section entrance as each block reaches the viewport.
 * The hero keeps its own load sequence and is not part of this.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const bound = new WeakSet<HTMLElement>();

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          play(entry.target as HTMLElement);
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );

    function play(el: HTMLElement) {
      el.classList.remove("section-await");
      el.classList.add("section-in");
      const finish = (event: AnimationEvent) => {
        if (event.target !== el) return;
        el.classList.add("section-done");
        el.removeEventListener("animationend", finish);
      };
      el.addEventListener("animationend", finish);
    }

    function prepare(el: HTMLElement) {
      if (bound.has(el)) return;
      const rect = el.getBoundingClientRect();
      if (rect.height < 8) return;
      bound.add(el);
      if (reduce) return;

      const view = window.innerHeight;
      const below = rect.top > view * 0.86;
      if (below) {
        el.classList.add("section-await");
        io.observe(el);
        return;
      }
      if (rect.bottom < 0) return;
      requestAnimationFrame(() => play(el));
    }

    const scan = () => document.querySelectorAll<HTMLElement>("[data-animate-section]").forEach(prepare);
    scan();
    const again = window.setTimeout(scan, 150);

    const root = document.getElementById("main") ?? document.body;
    const mo = new MutationObserver(scan);
    mo.observe(root, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(again);
      io.disconnect();
      mo.disconnect();
    };
  }, [pathname]);

  return null;
}
