import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { CSSProperties } from "react";
import type { Project } from "@/types/project";
import { statusLabel } from "@/data/projects";
import { Badge } from "@/components/ui/Badge";
import { ProjectVisual } from "@/components/visuals/UIMockup";
import { cn } from "@/lib/utils";

export function ProjectCard({ project, index = 0, size = "default", headingLevel = 3 }: { project: Project; index?: number; size?: "default" | "large"; headingLevel?: 2 | 3 }) {
  const H = `h${headingLevel}` as "h2" | "h3";
  return (
    <Link
      href={`/work/${project.slug}`}
      data-reveal
      style={{ "--i": index % 3 } as CSSProperties}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white transition-[border-color,box-shadow] duration-300 hover:border-brand/30 hover:shadow-[0_24px_48px_-28px_rgb(16_24_32/0.35)]"
    >
      <div className={cn("relative overflow-hidden border-b border-line", size === "large" ? "aspect-[16/10]" : "aspect-[16/11]")}>
        <ProjectVisual spec={project.cover} className="size-full transition-transform duration-700 ease-out group-hover:scale-[1.03]" />
        <span className="absolute right-4 top-4 flex size-10 translate-y-1 items-center justify-center rounded-full bg-ink text-white opacity-0 transition-[opacity,transform] duration-300 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:opacity-100">
          <ArrowUpRight aria-hidden className="size-4" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6 md:p-7">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand">{project.category}</Badge>
          <Badge tone={project.status === "client" ? "mint" : "warning"}>{statusLabel[project.status]}</Badge>
        </div>
        <H className={cn("mt-4 font-semibold tracking-tight text-ink transition-colors group-hover:text-brand-ink", size === "large" ? "text-[1.45rem] leading-tight" : "text-card")}>{project.title}</H>
        <p className="mt-3 leading-relaxed text-muted">{project.summary}</p>
        {size === "large" && (
          <dl className="mt-5 grid gap-4 border-t border-line pt-5 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-ink">Problem</dt>
              <dd className="mt-1 line-clamp-3 text-muted">{project.problem}</dd>
            </div>
            <div>
              <dt className="font-medium text-ink">Solution</dt>
              <dd className="mt-1 line-clamp-3 text-muted">{project.solution}</dd>
            </div>
          </dl>
        )}
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-6" aria-label="Technologies">
          {project.technologies.slice(0, size === "large" ? 5 : 3).map((t) => (
            <li key={t} className="rounded-md bg-paper px-2 py-1 font-mono text-[0.7rem] text-ink/70">
              {t}
            </li>
          ))}
        </ul>
        <span className="sr-only">View case study</span>
      </div>
    </Link>
  );
}
