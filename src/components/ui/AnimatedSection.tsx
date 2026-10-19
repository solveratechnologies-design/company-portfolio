import type { CSSProperties, ElementType, ReactNode } from "react";

/**
 * Marks content for a restrained scroll reveal. Content is fully visible
 * without JavaScript; see RevealObserver and globals.css.
 */
export function AnimatedSection({
  as: Tag = "div",
  index = 0,
  className,
  children,
}: {
  as?: ElementType;
  index?: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag data-reveal className={className} style={{ "--i": index } as CSSProperties}>
      {children}
    </Tag>
  );
}
