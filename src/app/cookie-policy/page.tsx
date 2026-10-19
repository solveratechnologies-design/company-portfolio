import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata = pageMetadata({
  title: "Cookie Policy",
  description: "Information about cookies and similar technologies used on the Solvera Technologies website.",
  path: "/cookie-policy",
});

export default function CookiePolicyPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      href="/cookie-policy"
      intro="What cookies are, which ones this website uses, and how you can control them."
      sections={[
        { title: "What cookies are", paragraphs: ["Cookies are small text files stored by your browser. Similar technologies include local storage and tracking pixels."] },
        { title: "Cookies this website uses", paragraphs: ["In its current configuration, this website does not set analytics or advertising cookies. It may use strictly necessary technical storage required for the site to function and to protect forms from abuse."] },
        { title: "Analytics and advertising", paragraphs: ["If analytics or advertising tools (for example, Google Analytics or ad platform tags) are added in future, this policy will be updated to list them, and consent will be requested where the law requires it before they are activated."] },
        { title: "Managing cookies", paragraphs: ["You can block or delete cookies in your browser settings. Blocking strictly necessary storage may affect how parts of the website work."] },
        { title: "Contact", paragraphs: ["Questions about this policy can be sent through the contact page. Effective date: [to be added]."] },
      ]}
    />
  );
}
