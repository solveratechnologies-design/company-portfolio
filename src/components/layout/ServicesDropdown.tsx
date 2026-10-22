"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import { serviceNav } from "@/data/navigation";
import { cn } from "@/lib/utils";
import { ActiveDot, navLinkClass } from "./DesktopNavigation";

export function ServicesDropdown({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // When hover opened the menu, the first click should keep it open rather than toggle it shut.
  const openedByHover = useRef(false);
  const active = pathname.startsWith("/services");

  const close = useCallback((returnFocus = false) => {
    openedByHover.current = false;
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  // Close on route change
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close(true);
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const items = () => Array.from(rootRef.current?.querySelectorAll<HTMLAnchorElement>("[data-menu-item]") ?? []);

  function onButtonKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => items()[0]?.focus());
    }
  }

  function onPanelKeyDown(e: React.KeyboardEvent) {
    const list = items();
    const index = list.indexOf(document.activeElement as HTMLAnchorElement);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      list[(index + 1) % list.length]?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      list[(index - 1 + list.length) % list.length]?.focus();
    }
  }

  // Hover intent for fine pointers; click/tap/keyboard always work.
  const onEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (!open) openedByHover.current = true;
    setOpen(true);
  };
  const onLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    closeTimer.current = setTimeout(() => {
      openedByHover.current = false;
      setOpen(false);
    }, 160);
  };

  return (
    <div
      ref={rootRef}
      className="relative"
      onPointerEnter={onEnter}
      onPointerLeave={onLeave}
      onBlur={(e) => {
        if (!rootRef.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="true"
        onClick={() => {
          if (openedByHover.current) {
            openedByHover.current = false;
            setOpen(true);
            return;
          }
          setOpen((o) => !o);
        }}
        onKeyDown={onButtonKeyDown}
        className={cn(navLinkClass(active), "inline-flex items-center gap-1")}
      >
        Services
        <ChevronDown aria-hidden className={cn("size-3.5 transition-transform duration-200", open && "rotate-180")} />
        <ActiveDot active={active} />
      </button>

      <div
        id={panelId}
        onKeyDown={onPanelKeyDown}
        className={cn(
          "absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3 transition-[opacity,transform,visibility] duration-200 ease-out",
          open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0",
        )}
      >
        <div className="overflow-hidden rounded-2xl border border-line bg-white text-ink shadow-[0_30px_60px_-20px_rgb(16_24_32/0.35)]">
          <ul className="grid grid-cols-2 gap-1 p-2">
            {serviceNav.map(({ href, label, description, icon: Icon }) => {
              const current = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    data-menu-item
                    aria-current={current ? "page" : undefined}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "group flex gap-3 rounded-xl p-3.5 transition-colors hover:bg-paper focus-visible:bg-paper",
                      current && "bg-brand-50",
                    )}
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-line bg-white text-brand transition-colors group-hover:border-brand/30 group-hover:bg-brand group-hover:text-ink">
                      <Icon aria-hidden className="size-[1.15rem]" />
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[0.95rem] font-semibold">{label}</span>
                      <span className="text-[0.82rem] leading-snug text-muted">{description}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex items-center justify-between gap-4 border-t border-line bg-paper px-5 py-3.5 text-sm">
            <span className="text-muted">Not sure which service fits?</span>
            <Link
              href="/services"
              data-menu-item
              onClick={() => setOpen(false)}
              className="group inline-flex items-center gap-1.5 font-medium text-brand hover:text-brand-600"
            >
              View all services
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
