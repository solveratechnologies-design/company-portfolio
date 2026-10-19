"use client";

import { useEffect, useState } from "react";

/**
 * Tracks vertical scroll position with requestAnimationFrame throttling.
 * Returns whether the page is scrolled past `threshold` and overall progress (0–1).
 */
export function useScrollProgress(threshold = 16) {
  const [state, setState] = useState({ scrolled: false, progress: 0, y: 0 });

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      setState((prev) => {
        const scrolled = y > threshold;
        if (prev.scrolled === scrolled && Math.abs(prev.progress - progress) < 0.005 && Math.abs(prev.y - y) < 40) return prev;
        return { scrolled, progress, y };
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [threshold]);

  return state;
}
