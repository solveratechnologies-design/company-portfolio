import { z } from "zod";
import { BUDGET_OPTIONS, SERVICE_OPTIONS, TIMELINE_OPTIONS, type ContactFieldErrors } from "@/types/contact";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Please keep this under ${max} characters.`)
    .optional()
    .transform((v) => (v ? v : undefined));

/** Accepts "example.com" or "https://example.com" and normalizes to https. */
const websiteField = z
  .string()
  .trim()
  .max(200, "Please keep this under 200 characters.")
  .optional()
  .transform((v, ctx) => {
    if (!v) return undefined;
    const withProtocol = /^https?:\/\//i.test(v) ? v : `https://${v}`;
    try {
      const url = new URL(withProtocol);
      if (!url.hostname.includes(".")) throw new Error("no tld");
      return url.toString();
    } catch {
      ctx.addIssue({ code: "custom", message: "Please enter a valid website address." });
      return z.NEVER;
    }
  });

export const contactSchema = z.object({
  fullName: z
    .string({ error: "Please enter your full name." })
    .trim()
    .min(2, "Please enter your full name.")
    .max(120, "Please keep this under 120 characters."),
  email: z
    .string({ error: "Please enter your business email." })
    .trim()
    .min(1, "Please enter your business email.")
    .max(200, "Please keep this under 200 characters.")
    .pipe(z.email("Please enter a valid email address, like name@company.com.")),
  company: optionalText(120),
  website: websiteField,
  service: z.enum(SERVICE_OPTIONS, { error: "Please choose the service you need." }),
  budget: z
    .enum(BUDGET_OPTIONS)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  timeline: z
    .enum(TIMELINE_OPTIONS)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  message: z
    .string({ error: "Please tell us a little about your project." })
    .trim()
    .min(20, "Please share a few more details (at least 20 characters).")
    .max(5000, "Please keep your description under 5,000 characters."),
  consent: z.literal(true, { error: "Please confirm we may use these details to respond to your inquiry." }),
  companyFax: z.string().optional(),
  startedAt: z.number().optional(),
  submissionId: z.string().max(100).optional(),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactData = z.output<typeof contactSchema>;

export function validateContact(input: unknown):
  | { success: true; data: ContactData }
  | { success: false; fieldErrors: ContactFieldErrors } {
  const result = contactSchema.safeParse(input);
  if (result.success) return { success: true, data: result.data };
  const fieldErrors: ContactFieldErrors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof ContactFieldErrors | undefined;
    if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return { success: false, fieldErrors };
}

/** Bots typically submit a form within a second or two of loading it. */
export const MIN_FILL_TIME_MS = 2500;

export function looksLikeSpam(data: Pick<ContactData, "companyFax" | "startedAt">, now = Date.now()) {
  if (data.companyFax && data.companyFax.trim() !== "") return true;
  if (typeof data.startedAt === "number" && now - data.startedAt < MIN_FILL_TIME_MS) return true;
  return false;
}
