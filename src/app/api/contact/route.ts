import { NextResponse, type NextRequest } from "next/server";
import { looksLikeSpam, validateContact } from "@/lib/validation";
import { claimSubmission, deliverInquiry, finishSubmission, isRateLimited, resolveClientKey } from "@/lib/contact";
import type { ContactResponse } from "@/types/contact";

const MAX_BODY_BYTES = 20_000;

function json(body: ContactResponse, status: number) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  // Same-origin check: reject cross-site form posts.
  const origin = req.headers.get("origin");
  if (origin && origin !== req.nextUrl.origin) {
    return json({ ok: false, code: "bad_request", message: "Invalid request origin." }, 403);
  }

  if (!req.headers.get("content-type")?.includes("application/json")) {
    return json({ ok: false, code: "bad_request", message: "Expected a JSON request body." }, 415);
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, code: "bad_request", message: "Your message is too long. Please shorten it and try again." }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, code: "bad_request", message: "The request could not be read. Please try again." }, 400);
  }

  const client = resolveClientKey(req.headers);
  if (await isRateLimited(client.key, client.limit)) {
    return json(
      { ok: false, code: "rate_limited", message: "You've sent several inquiries in a short time. Please wait a few minutes and try again." },
      429,
    );
  }

  const result = validateContact(body);
  if (!result.success) {
    return json({ ok: false, code: "validation", message: "Please correct the highlighted fields.", fieldErrors: result.fieldErrors }, 422);
  }

  const data = result.data;

  if (looksLikeSpam(data)) {
    return json({ ok: false, code: "spam", message: "We couldn't verify this submission. Please wait a moment and try again." }, 400);
  }

  // Duplicate protection: a retry of an already-delivered id is acknowledged without sending again,
  // and a concurrent request with the same id (double-click / race) is rejected while the first is in flight.
  const claim = claimSubmission(data.submissionId);
  if (claim === "duplicate") return json({ ok: true }, 200);
  if (claim === "in_progress") {
    return json({ ok: false, code: "in_progress", message: "Your inquiry is already being sent. Please wait a moment." }, 409);
  }

  // The claim is always released: remembered on confirmed delivery, freed otherwise so the visitor can retry.
  let delivery: Awaited<ReturnType<typeof deliverInquiry>> = { ok: false, reason: "delivery_failed" };
  try {
    delivery = await deliverInquiry(data);
  } finally {
    finishSubmission(data.submissionId, delivery.ok);
  }

  if (!delivery.ok) {
    if (delivery.reason === "not_configured") {
      return json(
        {
          ok: false,
          code: "not_configured",
          message: "Our inquiry form is temporarily unavailable, and your message was not sent. Please try again later.",
        },
        503,
      );
    }
    return json(
      { ok: false, code: "delivery_failed", message: "We couldn't send your inquiry right now. Your details are still in the form — please try again shortly." },
      502,
    );
  }

  // Success is reported only after the provider confirmed acceptance (2xx).
  return json({ ok: true }, 200);
}

export function GET() {
  return NextResponse.json({ ok: false, message: "Method not allowed." }, { status: 405, headers: { Allow: "POST", "Cache-Control": "no-store" } });
}
