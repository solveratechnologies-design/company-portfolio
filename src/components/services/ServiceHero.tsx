import type { Service } from "@/types/service";
import { PageHero } from "@/components/ui/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import type { ReactNode } from "react";

export function ServiceHero({ service, title, description, aside, ctaLabel = "Start a Project" }: { service: Service; title: string; description: string; aside?: ReactNode; ctaLabel?: string }) {
  return (
    <PageHero
      breadcrumbs={[
        { label: "Services", href: "/services" },
        { label: service.title, href: service.href },
      ]}
      eyebrow={service.title}
      title={title}
      description={description}
      aside={aside}
      actions={
        <>
          <ButtonLink href="/contact" size="lg" arrow>
            {ctaLabel}
          </ButtonLink>
          <ButtonLink href="#overview" size="lg" variant="outline-light">
            Learn more
          </ButtonLink>
        </>
      }
    />
  );
}
