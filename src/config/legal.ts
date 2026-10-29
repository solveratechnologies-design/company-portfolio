/**
 * Owner-supplied legal facts.
 *
 * The privacy policy, terms and cookie policy need facts only the business
 * owner can provide. Nothing here is invented: each value comes from a server
 * environment variable (see .env.example). Until ALL required facts are present
 * AND LEGAL_COUNSEL_REVIEWED=true, the legal pages
 *   - show a visible "template" notice,
 *   - are served with `noindex`, and
 *   - are left out of sitemap.xml.
 * Once everything is supplied they become indexable automatically.
 *
 * This is a publication gate, not a statement of legal compliance. Have the
 * final text reviewed by qualified counsel for the jurisdictions you serve.
 *
 * Values are read at build/prerender time, so set them in the build environment.
 */

export interface LegalFacts {
  entityName?: string;
  registeredAddress?: string;
  jurisdiction?: string;
  effectiveDate?: string;
  retentionPeriod?: string;
  serviceProviders?: string;
}

export const LEGAL_REQUIRED: { key: keyof LegalFacts; env: string; description: string }[] = [
  { key: "entityName", env: "LEGAL_ENTITY_NAME", description: "Registered legal business name" },
  { key: "registeredAddress", env: "LEGAL_REGISTERED_ADDRESS", description: "Registered business address" },
  { key: "jurisdiction", env: "LEGAL_JURISDICTION", description: "Governing law / jurisdiction for the Terms" },
  { key: "effectiveDate", env: "LEGAL_EFFECTIVE_DATE", description: "Effective date of the policies (for example 1 March 2027)" },
  { key: "retentionPeriod", env: "LEGAL_RETENTION_PERIOD", description: "How long inquiry data is kept" },
  { key: "serviceProviders", env: "LEGAL_SERVICE_PROVIDERS", description: "Providers that process inquiry data (email/webhook, hosting)" },
];

function clean(value: string | undefined) {
  const v = value?.trim();
  return v ? v : undefined;
}

export function readLegalFacts(env: NodeJS.ProcessEnv = process.env): LegalFacts {
  return {
    entityName: clean(env.LEGAL_ENTITY_NAME),
    registeredAddress: clean(env.LEGAL_REGISTERED_ADDRESS),
    jurisdiction: clean(env.LEGAL_JURISDICTION),
    effectiveDate: clean(env.LEGAL_EFFECTIVE_DATE),
    retentionPeriod: clean(env.LEGAL_RETENTION_PERIOD),
    serviceProviders: clean(env.LEGAL_SERVICE_PROVIDERS),
  };
}

export function legalStatus(env: NodeJS.ProcessEnv = process.env) {
  const facts = readLegalFacts(env);
  const missing = LEGAL_REQUIRED.filter((item) => !facts[item.key]).map((item) => item.env);
  const reviewed = clean(env.LEGAL_COUNSEL_REVIEWED)?.toLowerCase() === "true";
  if (!reviewed) missing.push("LEGAL_COUNSEL_REVIEWED");
  return { facts, missing, ready: missing.length === 0 };
}

/** Returns the fact, or a visible bracketed placeholder while it is still unknown. */
export function fact(value: string | undefined, placeholder: string) {
  return value ?? `[${placeholder}]`;
}
