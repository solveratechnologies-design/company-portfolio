import { getFeaturedProjects } from "@/data/projects";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";
import { Container, Section } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ButtonLink } from "@/components/ui/Button";

export function FeaturedWork() {
  return (
    <Section labelledBy="featured-work-title">
      <Container>
        <SectionHeading
          eyebrow="Selected work"
          id="featured-work-title"
          title="Selected Work. Practical Solutions."
          description="Concept projects and internal prototypes that show how we approach real business problems — each clearly labeled."
          action={
            <ButtonLink href="/work" variant="secondary" arrow>
              View all work
            </ButtonLink>
          }
        />
        <div className="mt-14">
          <ProjectGrid projects={getFeaturedProjects(4)} columns={2} size="large" />
        </div>
      </Container>
    </Section>
  );
}
