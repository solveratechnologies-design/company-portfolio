/**
 * Route-level loading state. It is deliberately taller than the viewport so
 * the footer stays off-screen until content arrives — swapping the skeleton
 * for the page then causes no visible layout shift (CLS).
 */
export function PageSkeleton({ label = "Loading page…", withMedia = false }: { label?: string; withMedia?: boolean }) {
  return (
    <div role="status" aria-live="polite" className="min-h-[115vh]">
      <div className="bg-hero">
        <div className="mx-auto max-w-[1240px] px-5 pb-20 pt-40 sm:px-8 md:pb-28">
          <div className="h-3 w-32 animate-pulse rounded-full bg-ink/10" />
          <div className="mt-6 h-12 w-3/4 max-w-2xl animate-pulse rounded-xl bg-ink/10" />
          <div className="mt-4 h-12 w-1/2 max-w-xl animate-pulse rounded-xl bg-ink/10" />
          <div className="mt-8 h-4 w-2/3 max-w-lg animate-pulse rounded-full bg-ink/5" />
        </div>
      </div>
      {withMedia && (
        <div className="mx-auto max-w-[1240px] px-5 py-16 sm:px-8">
          <div className="aspect-[16/9] w-full animate-pulse rounded-[1.75rem] bg-paper md:aspect-[21/9]" />
        </div>
      )}
      <span className="sr-only">{label}</span>
    </div>
  );
}
