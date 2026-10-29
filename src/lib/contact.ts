import "server-only";
import type { ContactData } from "./validation";

/**
 * Delivery for project inquiries.
 *
 * Supported providers (configure ONE in .env.local):
 *   1. Resend email API  — RESEND_API_KEY + CONTACT_TO_EMAIL (+ CONTACT_FROM_EMAIL)
 *   2. Generic webhook   — CONTACT_WEBHOOK_URL (+ optional CONTACT_WEBHOOK_SECRET)
 *      Works with n8n, Make, Zapier, GoHighLevel inbound webhooks, or your own CRM endpoint.
 *      The URL must be https (plain http is accepted only for localhost test receivers).
 *
 * If nothing is configured, deliverInquiry() reports "not_configured" and the
 * API returns 503. The form never shows a success state unless the provider
 * confirmed acceptance with a 2xx response.
 *
 * Logging policy: only the provider name, an HTTP status code or an error class
 * name is ever logged. Request bodies, names, emails, messages and secrets are never logged.
 */

export type DeliveryProvider = "resend" | "webhook" | "none";

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]"]);

/** https only; http is allowed for loopback hosts so a local mock receiver can be used in tests. */
export function isAllowedWebhookUrl(raw: string | undefined): boolean {
  if (!raw) return false;
  try {
    const url = new URL(raw);
    if (url.protocol === "https:") return true;
    return url.protocol === "http:" && LOOPBACK_HOSTS.has(url.hostname);
  } catch {
    return false;
  }
}

export function getDeliveryProvider(env: NodeJS.ProcessEnv = process.env): DeliveryProvider {
  if (env.RESEND_API_KEY && env.CONTACT_TO_EMAIL) return "resend";
  if (isAllowedWebhookUrl(env.CONTACT_WEBHOOK_URL)) return "webhook";
  return "none";
}

export type DeliveryResult = { ok: true } | { ok: false; reason: "not_configured" | "delivery_failed" };

const DELIVERY_TIMEOUT_MS = 10_000;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function toRows(data: ContactData): [string, string][] {
  return [
    ["Name", data.fullName],
    ["Email", data.email],
    ["Company", data.company ?? "—"],
    ["Website", data.website ?? "—"],
    ["Service", data.service],
    ["Budget", data.budget ?? "—"],
    ["Timeline", data.timeline ?? "—"],
    ["Project description", data.message],
  ];
}

/** Only a 2xx from the provider counts as accepted. Never log the response body. */
function accepted(provider: DeliveryProvider, res: Response): DeliveryResult {
  if (res.status >= 200 && res.status < 300) return { ok: true };
  console.error("[contact] Provider did not accept the inquiry", { provider, status: res.status });
  return { ok: false, reason: "delivery_failed" };
}

async function sendWithResend(data: ContactData, env: NodeJS.ProcessEnv): Promise<DeliveryResult> {
  const rows = toRows(data);
  const html = `<h2>New project inquiry</h2><table cellpadding="6">${rows
    .map(([k, v]) => `<tr><td><strong>${escapeHtml(k)}</strong></td><td>${escapeHtml(v).replace(/\n/g, "<br>")}</td></tr>`)
    .join("")}</table>`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      ...(data.submissionId ? { "Idempotency-Key": data.submissionId } : {}),
    },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL || "Solvera Website <onboarding@resend.dev>",
      to: env.CONTACT_TO_EMAIL!.split(",").map((s) => s.trim()),
      reply_to: data.email,
      subject: `New inquiry: ${data.service} — ${data.fullName}`,
      html,
      text,
    }),
    redirect: "manual",
    signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
  });
  return accepted("resend", res);
}

async function sendToWebhook(data: ContactData, env: NodeJS.ProcessEnv): Promise<DeliveryResult> {
  const { companyFax: _honeypot, startedAt: _startedAt, ...payload } = data;
  void _honeypot;
  void _startedAt;
  const res = await fetch(env.CONTACT_WEBHOOK_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(env.CONTACT_WEBHOOK_SECRET ? { "X-Webhook-Secret": env.CONTACT_WEBHOOK_SECRET } : {}),
      ...(data.submissionId ? { "Idempotency-Key": data.submissionId } : {}),
    },
    body: JSON.stringify({ type: "project_inquiry", receivedAt: new Date().toISOString(), ...payload }),
    // Do not follow redirects: that could forward personal data and the secret to another host.
    redirect: "manual",
    signal: AbortSignal.timeout(DELIVERY_TIMEOUT_MS),
  });
  return accepted("webhook", res);
}

export async function deliverInquiry(data: ContactData, env: NodeJS.ProcessEnv = process.env): Promise<DeliveryResult> {
  const provider = getDeliveryProvider(env);
  if (provider === "none") {
    if (env.CONTACT_WEBHOOK_URL && !isAllowedWebhookUrl(env.CONTACT_WEBHOOK_URL)) {
      console.error("[contact] CONTACT_WEBHOOK_URL is not a valid https URL; inquiries cannot be delivered.");
    }
    return { ok: false, reason: "not_configured" };
  }
  try {
    return provider === "resend" ? await sendWithResend(data, env) : await sendToWebhook(data, env);
  } catch (error) {
    // Timeouts, DNS and TLS failures. Log only the error class — never the payload (personal data).
    const name = typeof (error as { name?: unknown } | null)?.name === "string" ? (error as { name: string }).name : "unknown";
    console.error("[contact] Delivery request failed", { provider, error: name });
    return { ok: false, reason: "delivery_failed" };
  }
}

/* ------------------------------------------------------------------ */
/* Client identification                                               */
/* ------------------------------------------------------------------ */

export const PER_CLIENT_LIMIT = 5;
/** Shared flood backstop used when no trusted client-IP header is configured. */
export const UNATTRIBUTED_LIMIT = 20;
export const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;

/**
 * Identify the client for rate limiting without trusting spoofable headers.
 *
 * `X-Forwarded-For` / `X-Real-IP` sent by a browser or script can be anything, so they are
 * ignored unless you name, in CONTACT_CLIENT_IP_HEADER, the header your own reverse proxy / CDN
 * sets (and overwrites) on every request — e.g. `cf-connecting-ip`, `x-real-ip`,
 * `x-vercel-forwarded-for`, or `x-forwarded-for`. For `x-forwarded-for` the right-most entry
 * (appended by the nearest trusted proxy) is used; for other headers the value is used as-is.
 *
 * When the variable is unset, all requests share one flood-protection bucket with a higher
 * limit. That cannot be bypassed by spoofing, but one abuser can exhaust it for everyone, so
 * configure the header in production.
 */
export function resolveClientKey(headers: Headers, env: NodeJS.ProcessEnv = process.env): { key: string; limit: number } {
  const name = env.CONTACT_CLIENT_IP_HEADER?.trim().toLowerCase();
  if (name) {
    const raw = headers.get(name);
    if (raw) {
      const parts = raw.split(",").map((p) => p.trim()).filter(Boolean);
      const candidate = (name === "x-forwarded-for" ? parts[parts.length - 1] : parts[0]) ?? "";
      if (candidate && candidate.length <= 64 && /^[0-9a-fA-F:.[\]]+$/.test(candidate)) {
        return { key: `ip:${candidate}`, limit: PER_CLIENT_LIMIT };
      }
    }
  }
  return { key: "unattributed", limit: UNATTRIBUTED_LIMIT };
}

/* ------------------------------------------------------------------ */
/* Rate limiting (pluggable store)                                     */
/* ------------------------------------------------------------------ */

/**
 * Storage backend for rate limiting. The default is an in-memory store, which is
 * per server instance only — on serverless or multi-instance hosting, counters are not
 * shared, so limits are only approximate. For production, implement this interface on a
 * shared store you choose (Redis, Postgres, your platform's KV, …) and register it once at
 * startup with `setRateLimitStore()` (for example from `instrumentation.ts`). No specific
 * paid service or dependency is required.
 */
export interface RateLimitStore {
  /** Record one request for `key` and return how many requests (including this one) fall in the current window. */
  hit(key: string, windowMs: number, now: number): Promise<number> | number;
  /** Optional: clear all state (used by tests). */
  reset?(): void;
}

export function createMemoryRateLimitStore(): RateLimitStore {
  const hits = new Map<string, number[]>();
  return {
    hit(key, windowMs, now) {
      const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
      list.push(now);
      hits.set(key, list);
      if (hits.size > 5000) {
        for (const [k, times] of hits) if (times.every((t) => now - t >= windowMs)) hits.delete(k);
        if (hits.size > 5000) hits.clear();
      }
      return list.length;
    },
    reset: () => hits.clear(),
  };
}

let rateLimitStore: RateLimitStore = createMemoryRateLimitStore();
let usingDefaultStore = true;
let warnedAboutMemoryStore = false;

export function setRateLimitStore(store: RateLimitStore) {
  rateLimitStore = store;
  usingDefaultStore = false;
}

export async function isRateLimited(key: string, limit = PER_CLIENT_LIMIT, now = Date.now()): Promise<boolean> {
  if (process.env.NODE_ENV === "production" && usingDefaultStore && !warnedAboutMemoryStore) {
    warnedAboutMemoryStore = true;
    console.warn("[contact] Rate limiting uses per-instance memory. Register a shared store with setRateLimitStore() for multi-instance hosting.");
  }
  try {
    return (await rateLimitStore.hit(key, RATE_LIMIT_WINDOW_MS, now)) > limit;
  } catch {
    // A failing shared store must not take the contact form down; the other protections still apply.
    console.error("[contact] Rate-limit store unavailable; allowing request.");
    return false;
  }
}

/* ------------------------------------------------------------------ */
/* Duplicate-submission protection (per instance)                      */
/* ------------------------------------------------------------------ */

const DUPLICATE_WINDOW_MS = 10 * 60 * 1000;
const delivered = new Map<string, number>();
const inProgress = new Set<string>();

export type SubmissionClaim = "claimed" | "duplicate" | "in_progress";

/**
 * Claim a client-generated submission id before delivering.
 * - "duplicate": this id was already delivered successfully (retry after a lost response).
 * - "in_progress": another request with this id is being delivered right now (double-click / race).
 * Requests without an id cannot be de-duplicated and are always "claimed".
 */
export function claimSubmission(id: string | undefined, now = Date.now()): SubmissionClaim {
  if (!id) return "claimed";
  for (const [k, t] of delivered) if (now - t > DUPLICATE_WINDOW_MS) delivered.delete(k);
  if (delivered.has(id)) return "duplicate";
  if (inProgress.has(id)) return "in_progress";
  inProgress.add(id);
  return "claimed";
}

/** Call when delivery was confirmed (remembers the id) or failed (frees it so the user can retry). */
export function finishSubmission(id: string | undefined, delivered_: boolean, now = Date.now()) {
  if (!id) return;
  inProgress.delete(id);
  if (delivered_) delivered.set(id, now);
}

export function resetContactProtection() {
  rateLimitStore.reset?.();
  delivered.clear();
  inProgress.clear();
}
