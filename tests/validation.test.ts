import { describe, expect, it } from "vitest";
import { looksLikeSpam, MIN_FILL_TIME_MS, validateContact } from "@/lib/validation";

const valid = {
  fullName: "Jane Doe",
  email: "jane@company.com",
  company: "",
  website: "",
  service: "AI Solutions",
  budget: "",
  timeline: "",
  message: "We want to automate lead qualification for our sales team.",
  consent: true,
};

describe("validateContact", () => {
  it("accepts a valid submission and strips empty optional fields", () => {
    const r = validateContact(valid);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.company).toBeUndefined();
      expect(r.data.budget).toBeUndefined();
      expect(r.data.website).toBeUndefined();
    }
  });

  it("requires name, email, service, message and consent", () => {
    const r = validateContact({ fullName: "", email: "", service: "", message: "", consent: false });
    expect(r.success).toBe(false);
    if (!r.success) {
      expect(Object.keys(r.fieldErrors).sort()).toEqual(["consent", "email", "fullName", "message", "service"]);
    }
  });

  it("rejects malformed emails", () => {
    const r = validateContact({ ...valid, email: "not-an-email" });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.fieldErrors.email).toMatch(/valid email/i);
  });

  it("rejects a service that is not in the list", () => {
    const r = validateContact({ ...valid, service: "Hacking" });
    expect(r.success).toBe(false);
  });

  it("normalizes website URLs and rejects invalid ones", () => {
    const ok = validateContact({ ...valid, website: "example.com" });
    expect(ok.success && ok.data.website).toBe("https://example.com/");
    const bad = validateContact({ ...valid, website: "not a url" });
    expect(bad.success).toBe(false);
  });

  it("trims whitespace and enforces a minimum description length", () => {
    const r = validateContact({ ...valid, message: "   too short   " });
    expect(r.success).toBe(false);
    if (!r.success) expect(r.fieldErrors.message).toBeDefined();
  });
});

describe("looksLikeSpam", () => {
  it("flags a filled honeypot", () => {
    expect(looksLikeSpam({ companyFax: "123" })).toBe(true);
  });
  it("flags instant submissions", () => {
    const now = 1_000_000;
    expect(looksLikeSpam({ startedAt: now - 500 }, now)).toBe(true);
    expect(looksLikeSpam({ startedAt: now - MIN_FILL_TIME_MS - 1 }, now)).toBe(false);
  });
});
