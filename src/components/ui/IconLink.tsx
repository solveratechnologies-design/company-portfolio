import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function IconLink({ href, children, className, tone = "light" }: { href: string; children: React.ReactNode; className?: string; tone?: "light" | "dark" }) {
  return (
    <Link
      href={href}
      className={cn(
        "group/il inline-flex items-center gap-1.5 text-sm font-medium transition-colors",
        tone === "dark" ? "text-white hover:text-brand-300" : "text-brand-ink hover:text-brand-ink-hover",
        className,
      )}
    >
      {children}
      <ArrowUpRight aria-hidden className="size-4 transition-transform duration-200 group-hover/il:-translate-y-0.5 group-hover/il:translate-x-0.5" />
    </Link>
  );
}
