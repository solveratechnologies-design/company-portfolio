import { pageMetadata } from "@/lib/seo";
import { legalStatus, fact } from "@/config/legal";
import { LegalPage } from "@/components/ui/LegalPage";

const status = legalStatus();

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: "Terms governing the use of the Solvera Technologies website and its content.",
  path: "/terms",
  // Unfinished legal pages stay out of search results until the owner supplies the facts (src/config/legal.ts).
  noIndex: !status.ready,
});

export default function TermsPage() {
  const { facts, ready } = status;
  return (
    <LegalPage
      title="Terms of Service"
      href="/terms"
      intro="The terms that apply when you use this website. Project work is governed by a separate written agreement."
      sections={[
        { title: "Acceptance", paragraphs: ["By using this website, you agree to these terms. If you do not agree, please do not use the website."] },
        { title: "Use of the website", list: ["Use the website lawfully and do not attempt to disrupt or gain unauthorized access to it.", "Do not submit false, misleading or harmful information through forms.", "Do not use automated means to submit forms or scrape content without permission."] },
        { title: "Content and intellectual property", paragraphs: ["Website content, design and code are owned by Solvera Technologies or its licensors unless stated otherwise. Third-party names and trademarks belong to their owners and are used for identification only."] },
        { title: "Concept projects and examples", paragraphs: ["Projects labeled “Concept Project” or “Internal Prototype” illustrate our approach and are not commissioned client work. Illustrative data shown on this website is sample data, not client results."] },
        { title: "No professional advice", paragraphs: ["Articles and other content are provided for general information. They are not legal, financial or other professional advice for your specific situation."] },
        { title: "Project engagements", paragraphs: ["Submitting an inquiry does not create a contract. Any project work is subject to a separate written proposal or agreement that sets out scope, fees and responsibilities."] },
        {
          title: "Limitation of liability",
          paragraphs: [
            `To the extent permitted by law, the website is provided “as is”, and Solvera Technologies is not liable for losses arising from its use.${ready ? "" : " [Jurisdiction-specific wording to be reviewed by counsel.]"}`,
          ],
        },
        { title: "Governing law", paragraphs: [`These terms are governed by the laws of ${fact(facts.jurisdiction, "jurisdiction to be completed")}.`] },
        { title: "Changes", paragraphs: [`We may update these terms. Continued use of the website after changes means you accept the updated terms. Effective date: ${fact(facts.effectiveDate, "effective date to be added")}.`] },
      ]}
    />
  );
}
