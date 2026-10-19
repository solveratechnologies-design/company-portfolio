import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description: "How Solvera Technologies collects, uses and protects personal information submitted through this website.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      href="/privacy-policy"
      intro="How we collect, use and protect personal information when you use this website or contact us."
      sections={[
        { title: "Who we are", paragraphs: ["This website is operated by Solvera Technologies (“Solvera”, “we”, “us”). Registered business name, address and contact details: [to be completed before publication]."] },
        {
          title: "Information we collect",
          paragraphs: ["We collect information you choose to provide through the project inquiry form, and limited technical information needed to operate and protect the website."],
          list: [
            "Inquiry details: name, business email, company, website, service of interest, budget and timeline ranges, and your project description.",
            "Technical data: IP address and request metadata, used for security and rate limiting.",
            "Analytics data, only if analytics are enabled and, where required, with your consent.",
          ],
        },
        {
          title: "How we use information",
          list: [
            "To respond to your inquiry and discuss a potential project.",
            "To protect the website against spam and abuse.",
            "To understand, in aggregate, how the website is used and improve it (where analytics are enabled).",
          ],
          paragraphs: ["We do not sell personal information, and we do not use inquiry details for unrelated marketing without your permission."],
        },
        { title: "Legal bases", paragraphs: ["Where data protection laws require a legal basis, we rely on your consent (for example, the inquiry consent checkbox) and our legitimate interest in responding to business enquiries and securing the website."] },
        { title: "Service providers", paragraphs: ["Inquiries may be delivered through an email or workflow provider configured by Solvera, and the website may be hosted by a cloud hosting provider. These providers process data on our behalf under their own terms. A current list of providers: [to be completed]."] },
        { title: "Retention", paragraphs: ["We keep inquiry information only as long as needed to respond and, where a project proceeds, for the duration required for that relationship and applicable legal obligations. Retention periods: [to be confirmed]."] },
        { title: "Your rights", paragraphs: ["Depending on where you live, you may have the right to access, correct, delete or restrict the use of your personal information, and to object to processing or withdraw consent. To make a request, contact us through the contact page."] },
        { title: "Security", paragraphs: ["We use reasonable technical and organizational measures to protect information, including encrypted connections and limited access. No method of transmission or storage is completely secure."] },
        { title: "Changes to this policy", paragraphs: ["We may update this policy from time to time. The effective date will be shown on this page: [effective date to be added]."] },
      ]}
    />
  );
}
