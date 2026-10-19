"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/Logo";
import { ButtonLink } from "@/components/ui/Button";
import { DesktopNavigation } from "./DesktopNavigation";
import { MobileNavigation } from "./MobileNavigation";

export function Header() {
  const pathname = usePathname();
  const { scrolled } = useScrollProgress(12);

  return (
    <header
      className={cn(
        "on-dark fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        scrolled
          ? "border-b border-white/10 bg-ink/95 backdrop-blur-xl supports-[backdrop-filter]:bg-ink/85"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-ink"
      >
        Skip to content
      </a>
      <div className="mx-auto flex h-[4.5rem] max-w-[1400px] items-center justify-between gap-6 px-5 sm:px-8">
        <Link href="/" className="shrink-0 rounded-lg">
          <Logo tone="light" />
          <span className="sr-only"> — home</span>
        </Link>
        <DesktopNavigation pathname={pathname} />
        <div className="flex items-center gap-2">
          <span className="hidden sm:block">
            <ButtonLink href="/contact" variant="primary" arrow>
              Start a Project
            </ButtonLink>
          </span>
          <MobileNavigation pathname={pathname} />
        </div>
      </div>
    </header>
  );
}
