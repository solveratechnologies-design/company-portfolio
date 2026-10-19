import "server-only";
import type { ContactData } from "./validation";

/**
 * Delivery for project inquiries.
 *
 * Supported providers (configure ONE in .env.local):
 *   1. Resend email API  — RESEND_API_KEY + CONTACT_TO_EMAIL (+ CONTACT_FROM_EMAIL)
 *   2. Generic webhook   — CONTACT_WEBHOOK_URL (+ optional CONTACT_WEBHOOK_SECRET)
 *      Works with n8n, Make, Zapier, GoHighLevel inbound webhooks, or your own CRM endpoint.
 *
 * If nothing is configured, deliverInquiry() reports "not_configured" and the
 * API returns 503. The form never shows a success state unless delivery succeeded.
 */

export type DeliveryProvider = "resend" | "webhook" | "none";

export function getDeliveryProvider(env: NodeJS.ProcessEnv = process.env): DeliveryProvider {
  if (env.RESEND_API_KEY && env.CONTACT_TO_EMAIL) return "resend";
  if (env.CONTACT_WEBHOOK_URL) return "webhook";
  return "none";
}

export type DeliveryResult = { ok: true } | { ok: false; reason: "not_configured" | "delivery_failed" };

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
    signal: AbortSignal.timeout(10_000),
  });
  return res.ok ? { ok: true } : { ok: false, reason: "delivery_failed" };
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
    },
    body: JSON.stringify({ type: "project_inquiry", receivedAt: new Date().toISOString(), ...payload }),
    signal: AbortSignal.timeout(10_000),
  });
  return res.ok ? { ok: true } : { ok: false, reason: "delivery_failed" };
}

export async function deliverInquiry(data: ContactData, env: NodeJS.ProcessEnv = process.env): Promise<DeliveryResult> {
  const provider = getDeliveryProvider(env);
  try {
    if (provider === "resend") return await sendWithResend(data, env);
    if (provider === "webhook") return await sendToWebhook(data, env);
    return { ok: false, reason: "not_configured" };
  } catch {
    // Intentionally not logging the payload: it contains personal data.
    console.error("[contact] Delivery request failed for provider:", provider);
    return { ok: false, reason: "delivery_failed" };
  }
}

/* ------------------------------------------------------------------ */
/* Lightweight in-memory protection. Per server instance only — for   */
/* multi-instance or serverless deployments, use a shared store       */
/* (e.g. Upstash Redis) as described in the README.                   */
/* ------------------------------------------------------------------ */

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const hits = new Map<string, number[]>();
const recentSubmissions = new Map<string, number>();

export function isRateLimited(key: string, now = Date.now()) {
  const list = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) hits.clear();
  return list.length > MAX_REQUESTS;
}

export function isDuplicateSubmission(id: string | undefined, now = Date.now()) {
  if (!id) return false;
  for (const [k, t] of recentSubmissions) if (now - t > WINDOW_MS) recentSubmissions.delete(k);
  return recentSubmissions.has(id);
}

export function rememberSubmission(id: string | undefined, now = Date.now()) {
  if (id) recentSubmissions.set(id, now);
}

export function resetContactProtection() {
  hits.clear();
  recentSubmissions.clear();
}
