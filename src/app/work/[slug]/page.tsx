import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { pageMetadata } from "@/lib/seo";
import { CaseStudyLayout } from "@/components/portfolio/CaseStudyLayout";

export async function generateStaticParams() {
  const { projects } = await getContent();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const { projects } = await getContent();
  const project = projects.find((item) => item.slug === slug);
  if (!project) return pageMetadata({ title: "Project not found", description: "This project could not be found.", path: "/work", noIndex: true });
  return pageMetadata({
    title: `${project.title} — ${project.category}`,
    description: project.summary,
    path: `/work/${project.slug}`,
  });
}

export default async function CaseStudyPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const { projects } = await getContent();
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();
  return <CaseStudyLayout project={project} />;
}
