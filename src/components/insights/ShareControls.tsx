"use client";

import { useState } from "react";
import { Check, Link2 } from "lucide-react";

export function ShareControls({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState<"idle" | "copied" | "error">("idle");
  const enc = encodeURIComponent;
  const links = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { label: "X", href: `https://x.com/intent/post?url=${enc(url)}&text=${enc(title)}` },
    { label: "Email", href: `mailto:?subject=${enc(title)}&body=${enc(url)}` },
  ];

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied("copied");
    } catch {
      setCopied("error");
    }
    setTimeout(() => setCopied("idle"), 2500);
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-sm font-medium text-ink">Share</span>
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target={l.label === "Email" ? undefined : "_blank"}
          rel={l.label === "Email" ? undefined : "noopener noreferrer"}
          className="rounded-full border border-line px-3 py-1.5 text-sm text-ink/75 transition-colors hover:border-ink/30 hover:text-ink"
        >
          {l.label}
          {l.label !== "Email" && <span className="sr-only"> (opens in a new tab)</span>}
        </a>
      ))}
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-sm text-ink/75 transition-colors hover:border-ink/30 hover:text-ink"
      >
        {copied === "copied" ? <Check aria-hidden className="size-3.5 text-mint" /> : <Link2 aria-hidden className="size-3.5" />}
        {copied === "copied" ? "Link copied" : copied === "error" ? "Copy failed" : "Copy link"}
      </button>
      <span role="status" className="sr-only">
        {copied === "copied" ? "Link copied to clipboard" : ""}
      </span>
    </div>
  );
}
