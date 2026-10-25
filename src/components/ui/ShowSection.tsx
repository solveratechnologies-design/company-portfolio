import type { ReactNode } from "react";
import { isSectionEnabled, type PageId, type SectionId } from "@/config/sections";

/** Renders nothing when the section is turned off in code or HIDDEN_SECTIONS. Server-only so hidden content is not sent to the browser. */
export function ShowSection<P extends PageId>({ page, section, children }: { page: P; section: SectionId<P>; children: ReactNode }) {
  if (!isSectionEnabled(page, section)) return null;
  return children;
}
