"use client";

import { useEffect } from "react";
import Link from "next/link";
import { RotateCcw } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";

export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  const digest = error instanceof Error && "digest" in error ? String((error as Error & { digest?: string }).digest ?? "") : "";

  return (
    <section className="on-dark relative isolate flex min-h-[70vh] items-center bg-ink text-white">
      <div aria-hidden className="bg-grid-dark mask-radial absolute inset-0 -z-10" />
      <Container className="py-36">
        <div className="max-w-xl">
          <Eyebrow tone="dark">Something went wrong</Eyebrow>
          <h1 className="mt-6 text-heading font-semibold">We couldn&apos;t load this page.</h1>
          <p className="mt-4 text-white/70">This is usually temporary. Please try again — if the problem continues, return to the homepage.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => retry()}
              className="inline-flex h-11 items-center gap-2 rounded-full bg-brand px-5 font-medium text-white transition-colors hover:bg-brand-600"
            >
              <RotateCcw aria-hidden className="size-4" /> Try again
            </button>
            <Link href="/" className="inline-flex h-11 items-center rounded-full border border-white/20 px-5 font-medium text-white hover:border-white/50">
              Go to homepage
            </Link>
          </div>
          {digest && <p className="mt-8 font-mono text-xs text-white/60">Reference: {digest}</p>}
        </div>
      </Container>
    </section>
  );
}
