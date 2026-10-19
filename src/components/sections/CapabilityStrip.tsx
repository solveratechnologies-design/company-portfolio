import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";
import { Container } from "@/components/ui/Container";

export function CapabilityStrip() {
  return (
    <section aria-label="Core capabilities" className="on-dark relative bg-ink pb-10 text-white">
      <Container size="wide">
        <ul className="grid grid-cols-1 overflow-hidden rounded-2xl border border-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <li key={s.slug} className="border-white/10 [&:not(:first-child)]:border-t sm:[&:nth-child(2)]:border-t-0 sm:[&:nth-child(even)]:border-l lg:[&:not(:first-child)]:border-l lg:[&:not(:first-child)]:border-t-0">
                <Link href={s.href} className="group flex h-full items-center gap-4 p-5 transition-colors hover:bg-white/[0.04] md:p-6">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 transition-colors group-hover:border-mint/40 group-hover:text-mint-300">
                    <Icon aria-hidden className="size-5" />
                  </span>
                  <span className="flex flex-col">
                    <span className="font-mono text-[0.68rem] text-white/55">0{i + 1}</span>
                    <span className="font-medium text-white underline decoration-transparent decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-mint">
                      {s.title}
                    </span>
                  </span>
                  <ArrowUpRight aria-hidden className="ml-auto size-4 text-white/30 transition-colors group-hover:text-mint-300" />
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
