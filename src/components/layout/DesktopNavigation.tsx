"use client";

import Link from "next/link";
import { mainNav, isActivePath } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { ServicesDropdown } from "./ServicesDropdown";

export function navLinkClass(active: boolean) {
  return cn(
    "relative rounded-full px-3 py-2 text-[0.9rem] font-medium transition-colors",
    active ? "text-white" : "text-white/70 hover:text-white",
  );
}

export function ActiveDot({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "absolute inset-x-3 -bottom-0.5 h-px origin-left bg-mint transition-transform duration-300",
        active ? "scale-x-100" : "scale-x-0",
      )}
    />
  );
}

export function DesktopNavigation({ pathname }: { pathname: string }) {
  const [home, ...rest] = mainNav;
  return (
    <nav aria-label="Main" className="hidden nav:block">
      <ul className="flex items-center gap-0.5">
        <li>
          <Link href={home.href} className={navLinkClass(isActivePath(pathname, home.href))} aria-current={isActivePath(pathname, home.href) ? "page" : undefined}>
            {home.label}
            <ActiveDot active={isActivePath(pathname, home.href)} />
          </Link>
        </li>
        <li>
          <ServicesDropdown pathname={pathname} />
        </li>
        {rest.map((item) => {
          const active = isActivePath(pathname, item.href);
          return (
            <li key={item.href}>
              <Link href={item.href} className={navLinkClass(active)} aria-current={active ? "page" : undefined}>
                {item.label}
                <ActiveDot active={active} />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
