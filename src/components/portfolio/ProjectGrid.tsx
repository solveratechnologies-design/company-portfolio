import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";

export function ProjectGrid({ projects, columns = 3, size = "default" }: { projects: Project[]; columns?: 2 | 3; size?: "default" | "large" }) {
  return (
    <ul className={cn("grid gap-5", columns === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3")}>
      {projects.map((p, i) => (
        <li key={p.slug}>
          <ProjectCard project={p} index={i} size={size} />
        </li>
      ))}
    </ul>
  );
}
