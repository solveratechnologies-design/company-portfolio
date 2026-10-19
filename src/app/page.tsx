import type { Metadata } from "next";
import { HeroSection } from "@/components/sections/HeroSection";
import { CapabilityStrip } from "@/components/sections/CapabilityStrip";
import { AboutPreview } from "@/components/sections/AboutPreview";
import { ServicesOverview } from "@/components/sections/ServicesOverview";
import { FeaturedWork } from "@/components/sections/FeaturedWork";
import { AutomationSpotlight } from "@/components/sections/AutomationSpotlight";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { IndustriesGrid } from "@/components/sections/IndustriesGrid";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { TestimonialsSection } from "@/components/sections/TestimonialsSection";
import { InsightsPreview } from "@/components/sections/InsightsPreview";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} — Web Development, AI, Automation & Digital Marketing` },
  description:
    "Solvera Technologies helps growing businesses build high-performance websites and software, apply practical AI, automate workflows, and grow with measurable digital marketing.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CapabilityStrip />
      <AboutPreview />
      <ServicesOverview />
      <FeaturedWork />
      <AutomationSpotlight />
      <WhyChooseUs />
      <IndustriesGrid />
      <ProcessTimeline />
      <TestimonialsSection />
      <InsightsPreview />
      <FinalCTA />
    </>
  );
}
