import { ArrowRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SubmitButton({ pending, children }: { pending: boolean; children: React.ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className={cn(
        "group/btn inline-flex h-13 items-center justify-center gap-2 rounded-full bg-brand px-7 text-base font-medium text-ink transition-colors hover:bg-brand-600",
        "disabled:cursor-wait disabled:opacity-75",
      )}
    >
      {pending ? (
        <>
          <Loader2 aria-hidden className="size-4 animate-spin" />
          Sending…
        </>
      ) : (
        <>
          {children}
          <ArrowRight aria-hidden className="size-4 transition-transform group-hover/btn:translate-x-0.5" />
        </>
      )}
    </button>
  );
}
