import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { pageMetadata } from "@/lib/seo";
import { CaseStudyLayout } from "@/components/portfolio/CaseStudyLayout";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return pageMetadata({ title: "Project not found", description: "This project could not be found.", path: "/work", noIndex: true });
  return pageMetadata({
    title: `${project.title} — ${project.category}`,
    description: project.summary,
    path: `/work/${project.slug}`,
  });
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();
  return <CaseStudyLayout project={project} />;
}
