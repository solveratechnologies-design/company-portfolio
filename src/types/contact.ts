export const SERVICE_OPTIONS = [
  "Web Development",
  "Custom Software",
  "AI Solutions",
  "Business Automation",
  "Digital Marketing",
  "Multiple Services",
  "Not Sure Yet",
] as const;

export const BUDGET_OPTIONS = [
  "Under $5,000",
  "$5,000 – $15,000",
  "$15,000 – $40,000",
  "$40,000+",
  "Not sure yet",
] as const;

export const TIMELINE_OPTIONS = [
  "As soon as possible",
  "Within 1–3 months",
  "Within 3–6 months",
  "Flexible / exploring",
] as const;

export type ServiceOption = (typeof SERVICE_OPTIONS)[number];

export interface ContactPayload {
  fullName: string;
  email: string;
  company?: string;
  website?: string;
  service: ServiceOption;
  budget?: string;
  timeline?: string;
  message: string;
  consent: boolean;
  /** Honeypot — must stay empty. */
  companyFax?: string;
  /** Time the form was rendered (ms epoch), used to reject instant bot submissions. */
  startedAt?: number;
  /** Client-generated id to prevent duplicate deliveries. */
  submissionId?: string;
}

export type ContactFieldErrors = Partial<Record<keyof ContactPayload, string>>;

export type ContactResponse =
  | { ok: true }
  | {
      ok: false;
      code: "validation" | "rate_limited" | "not_configured" | "delivery_failed" | "spam" | "bad_request" | "in_progress";
      message: string;
      fieldErrors?: ContactFieldErrors;
    };
