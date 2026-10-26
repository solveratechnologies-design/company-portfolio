"use client";

import { useLayoutEffect, type RefObject } from "react";

/** Zooms one card at a time while its section is scrolled. The first card starts zoomed. */
export function useZoomCards(
  trackRef: RefObject<HTMLElement | null>,
  listRef: RefObject<HTMLElement | null>,
  selector: string,
  options?: { mobile?: "center" | "stacked-center"; progress?: "view" },
) {
  useLayoutEffect(() => {
    const track = trackRef.current;
    const list = listRef.current;
    if (!track || !list) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const wide = window.matchMedia("(min-width: 1024px)");
    let frameId = 0;

    const apply = () => {
      frameId = 0;
      const items = [...list.querySelectorAll<HTMLElement>(selector)];
      if (!items.length) return;

      if (motion.matches) {
        items.forEach((card) => {
          card.style.transform = "none";
          card.style.opacity = "1";
          card.style.zIndex = "";
          card.style.boxShadow = "";
          card.style.borderColor = "";
        });
        return;
      }

      const rect = track.getBoundingClientRect();
      const lastIndex = items.length - 1;
      const nav = 72;
      const layoutTop = (el: HTMLElement) => (el.parentElement?.tagName === "LI" ? el.parentElement : el).offsetTop;
      const stacked = items.length < 2 || Math.abs(layoutTop(items[0]) - layoutTop(items[1])) > 8;
      const useCenter = options?.mobile === "center" ? !wide.matches : options?.mobile === "stacked-center" ? stacked : false;
      let activeIndex = 0;
      if (useCenter) {
        const midpoint = window.innerHeight / 2;
        let nearest = Infinity;
        items.forEach((card, index) => {
          const box = card.getBoundingClientRect();
          const delta = Math.abs(box.top + box.height / 2 - midpoint);
          if (delta < nearest) {
            nearest = delta;
            activeIndex = index;
          }
        });
      } else if (wide.matches && options?.progress !== "view") {
        const runway = track.querySelector("[data-zoom-runway]")?.getBoundingClientRect().height ?? 0;
        const progress = runway <= 0 ? 0 : Math.min(1, Math.max(0, (nav - rect.top) / runway));
        activeIndex = Math.round(progress * lastIndex);
      } else if (options?.progress === "view") {
        const block = track.closest("article") ?? track;
        const box = block.getBoundingClientRect();
        const midpoint = window.innerHeight / 2;
        const traveled = midpoint - (box.top + box.height / 2);
        if (traveled < 0) {
          activeIndex = -1;
        } else {
          const distance = Math.max(window.innerHeight * 0.42, rect.height);
          const progress = Math.min(1, traveled / distance);
          activeIndex = Math.round(progress * lastIndex);
        }
      } else {
        const start = window.innerHeight * 0.78;
        const distance = Math.max(rect.height * 0.72, 1);
        const progress = Math.min(1, Math.max(0, (start - rect.top) / distance));
        activeIndex = Math.round(progress * lastIndex);
      }

      items.forEach((card, index) => {
        const active = index === activeIndex;
        card.style.transform = active ? "scale(1.07)" : "scale(0.94)";
        card.style.opacity = active ? "1" : "0.55";
        card.style.zIndex = active ? "2" : "1";
        card.style.borderColor = active ? "rgb(242 114 34 / 0.45)" : "";
        card.style.boxShadow = active ? "0 28px 50px -24px rgb(242 114 34 / 0.45)" : "none";
        card.setAttribute("aria-current", active ? "true" : "false");
      });
    };

    const onScroll = () => {
      if (!frameId) frameId = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    motion.addEventListener("change", onScroll);
    wide.addEventListener("change", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      motion.removeEventListener("change", onScroll);
      wide.removeEventListener("change", onScroll);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [trackRef, listRef, selector, options?.mobile, options?.progress]);
}
