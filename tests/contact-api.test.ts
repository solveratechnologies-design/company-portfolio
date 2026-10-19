import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/contact/route";
import { resetContactProtection } from "@/lib/contact";

const body = (overrides: Record<string, unknown> = {}) => ({
  fullName: "Jane Doe",
  email: "jane@company.com",
  service: "Business Automation",
  message: "We would like to automate our appointment reminders.",
  consent: true,
  startedAt: Date.now() - 10_000,
  submissionId: crypto.randomUUID(),
  ...overrides,
});

function request(payload: unknown, headers: Record<string, string> = {}) {
  return new NextRequest("http://localhost:3000/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", origin: "http://localhost:3000", "x-forwarded-for": `10.0.0.${Math.floor(Math.random() * 250)}`, ...headers },
    body: typeof payload === "string" ? payload : JSON.stringify(payload),
  });
}

describe("POST /api/contact", () => {
  const env = { ...process.env };
  beforeEach(() => {
    resetContactProtection();
    delete process.env.RESEND_API_KEY;
    delete process.env.CONTACT_TO_EMAIL;
    delete process.env.CONTACT_WEBHOOK_URL;
  });
  afterEach(() => {
    process.env = { ...env };
    vi.restoreAllMocks();
  });

  it("returns 422 with field errors for invalid data", async () => {
    const res = await POST(request(body({ email: "nope" })));
    expect(res.status).toBe(422);
    const json = await res.json();
    expect(json.ok).toBe(false);
    expect(json.fieldErrors.email).toBeDefined();
  });

  it("never reports success when no delivery provider is configured", async () => {
    const res = await POST(request(body()));
    expect(res.status).toBe(503);
    expect((await res.json()).code).toBe("not_configured");
  });

  it("rejects honeypot submissions", async () => {
    const res = await POST(request(body({ companyFax: "spam" })));
    expect(res.status).toBe(400);
    expect((await res.json()).code).toBe("spam");
  });

  it("rejects cross-origin requests", async () => {
    const res = await POST(request(body(), { origin: "https://evil.example" }));
    expect(res.status).toBe(403);
  });

  it("rejects malformed JSON", async () => {
    const res = await POST(request("{not json"));
    expect(res.status).toBe(400);
  });

  it("delivers to the webhook and returns success only after a 2xx", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.com/inquiry";
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("ok", { status: 200 }));
    const res = await POST(request(body()));
    expect(res.status).toBe(200);
    expect((await res.json()).ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledOnce();
    const sent = JSON.parse(fetchMock.mock.calls[0][1]!.body as string);
    expect(sent.companyFax).toBeUndefined();
    expect(sent.email).toBe("jane@company.com");
  });

  it("returns 502 when the provider fails", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.com/inquiry";
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("err", { status: 500 }));
    const res = await POST(request(body()));
    expect(res.status).toBe(502);
  });

  it("does not deliver the same submission twice", async () => {
    process.env.CONTACT_WEBHOOK_URL = "https://hooks.example.com/inquiry";
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("ok", { status: 200 }));
    const payload = body();
    await POST(request(payload));
    const second = await POST(request(payload));
    expect(second.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("rate limits repeated submissions from one client", async () => {
    const headers = { "x-forwarded-for": "203.0.113.9" };
    let last: Response | undefined;
    for (let i = 0; i < 6; i++) last = await POST(request(body(), headers));
    expect(last!.status).toBe(429);
  });
});
