"use client";

import { useEffect, useRef, useState, type ComponentPropsWithoutRef, type ElementType } from "react";

/**
 * Wraps decorative animated content and exposes `data-inview` so CSS can
 * pause continuous animations while off-screen. State is managed by React,
 * so it never conflicts with hydration.
 */
export function InView<T extends ElementType = "div">({
  as,
  children,
  ...rest
}: { as?: T } & ComponentPropsWithoutRef<T>) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} data-animate="" data-inview={inView ? "true" : "false"} {...rest}>
      {children}
    </Tag>
  );
}
