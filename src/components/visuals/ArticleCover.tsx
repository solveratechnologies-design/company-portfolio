import type { Article } from "@/types/article";
import { cn } from "@/lib/utils";

const toneBg = {
  brand: "bg-gradient-to-br from-[#c4510d] via-brand to-[#f8b07a]",
  mint: "bg-gradient-to-br from-[#16654a] via-[#2a9a72] to-mint",
  ink: "bg-gradient-to-br from-ink via-ink-2 to-ink-3",
} as const;

/** Generative, on-brand cover art for articles — no stock imagery. */
export function ArticleCover({ article, className, showCategory = true }: { article: Pick<Article, "cover" | "category" | "title">; className?: string; showCategory?: boolean }) {
  const { tone, motif } = article.cover;
  return (
    <div aria-hidden className={cn("relative overflow-hidden", toneBg[tone], className)}>
      <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
        {motif === "grid" &&
          Array.from({ length: 9 }).map((_, i) => (
            <g key={i} stroke="white" strokeOpacity="0.14">
              <line x1={i * 50} y1="0" x2={i * 50} y2="240" />
              <line x1="0" y1={i * 30} x2="400" y2={i * 30} />
            </g>
          ))}
        {motif === "grid" && <rect x="200" y="60" width="100" height="90" rx="10" fill="white" fillOpacity="0.16" stroke="white" strokeOpacity="0.4" />}
        {motif === "nodes" && (
          <g>
            <path d="M60 170 C 140 170, 140 70, 220 70 S 300 150, 350 110" fill="none" stroke="white" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="4 6" />
            {[
              [60, 170],
              [220, 70],
              [350, 110],
            ].map(([x, y]) => (
              <g key={x}>
                <circle cx={x} cy={y} r="18" fill="white" fillOpacity="0.12" />
                <circle cx={x} cy={y} r="7" fill="white" />
              </g>
            ))}
          </g>
        )}
        {motif === "bars" &&
          [60, 100, 80, 140, 120, 170].map((h, i) => (
            <rect key={i} x={70 + i * 46} y={200 - h} width="26" height={h} rx="6" fill="white" fillOpacity={0.15 + i * 0.1} />
          ))}
        {motif === "rings" &&
          [30, 60, 90, 120].map((r) => <circle key={r} cx="290" cy="120" r={r} fill="none" stroke="white" strokeOpacity={0.5 - r / 300} strokeWidth="1.5" />)}
        {motif === "rings" && <circle cx="290" cy="120" r="10" fill="white" />}
      </svg>
      {showCategory && (
        <span className="absolute left-4 top-4 rounded-full bg-white/15 px-2.5 py-1 font-mono text-[0.65rem] uppercase tracking-[0.14em] text-white backdrop-blur">
          {article.category}
        </span>
      )}
    </div>
  );
}
