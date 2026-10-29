import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Accordion } from "@/components/ui/Accordion";
import { ProjectFilters } from "@/components/portfolio/ProjectFilters";
import { ContactForm } from "@/components/forms/ContactForm";
import { projects } from "@/data/projects";

describe("Accordion", () => {
  const items = [
    { question: "First?", answer: "Answer one" },
    { question: "Second?", answer: "Answer two" },
  ];

  it("expands and collapses with aria-expanded", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    const btn = screen.getByRole("button", { name: /First\?/ });
    expect(btn).toHaveAttribute("aria-expanded", "false");
    // A collapsed panel is hidden with CSS (grid-rows 0fr + overflow-hidden), which jsdom does not
    // evaluate (css: false), so assert the semantic mechanism: the panel is `inert` (removed from
    // the tab order and accessibility tree). Real rendering is covered by the browser checks.
    const panel = () => screen.getByText("Answer one").closest("[role=region]");
    expect(panel()).toHaveAttribute("inert");
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "true");
    expect(panel()).not.toHaveAttribute("inert");
    expect(screen.getByRole("region", { name: /First\?/ })).toBeVisible();
    await user.click(btn);
    expect(btn).toHaveAttribute("aria-expanded", "false");
    expect(panel()).toHaveAttribute("inert");
  });

  it("is keyboard operable", async () => {
    const user = userEvent.setup();
    render(<Accordion items={items} />);
    await user.tab();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("button", { name: /First\?/ })).toHaveAttribute("aria-expanded", "true");
  });
});

describe("ProjectFilters", () => {
  beforeEach(() => window.history.replaceState(null, "", "/work"));

  it("filters projects by category without reload and updates the URL", async () => {
    const user = userEvent.setup();
    render(<ProjectFilters projects={projects} />);
    const group = screen.getByRole("group", { name: /project categories/i });
    expect(screen.getAllByRole("link")).toHaveLength(projects.length);

    await user.click(within(group).getByRole("button", { name: /Digital Marketing/ }));
    const expected = projects.filter((p) => p.category === "Digital Marketing");
    expect(screen.getAllByRole("link")).toHaveLength(expected.length);
    expect(within(group).getByRole("button", { name: /Digital Marketing/ })).toHaveAttribute("aria-pressed", "true");
    expect(window.location.search).toBe("?category=Digital+Marketing");

    await user.click(within(group).getByRole("button", { name: /All Projects/ }));
    expect(screen.getAllByRole("link")).toHaveLength(projects.length);
  });

  it("reads the initial category from the URL", () => {
    window.history.replaceState(null, "", "/work?category=AI+Solutions");
    render(<ProjectFilters projects={projects} />);
    const expected = projects.filter((p) => p.category === "AI Solutions");
    expect(screen.getAllByRole("link")).toHaveLength(expected.length);
  });
});

describe("ContactForm", () => {
  it("shows inline errors and does not submit invalid data", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.click(screen.getByRole("button", { name: /send inquiry/i }));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(screen.getByLabelText(/full name/i)).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByLabelText(/full name/i)).toHaveFocus();
    expect(screen.getByRole("alert")).toHaveTextContent(/highlighted fields/i);
  });

  it("keeps entered data and shows a configuration notice when the backend is not configured", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ ok: false, code: "not_configured", message: "Unavailable" }), { status: 503, headers: { "content-type": "application/json" } }),
    );
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/business email/i), "jane@company.com");
    await user.selectOptions(screen.getByLabelText(/service required/i), "Web Development");
    await user.type(screen.getByLabelText(/project description/i), "A new website with a booking integration.");
    await user.click(screen.getByLabelText(/I agree/i));
    await user.click(screen.getByRole("button", { name: /send inquiry/i }));
    expect(await screen.findByText(/not connected yet/i)).toBeInTheDocument();
    expect(screen.queryByText(/has been sent/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toHaveValue("Jane Doe");
  });

  it("shows success only after a confirmed 200 response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } }));
    const user = userEvent.setup();
    render(<ContactForm />);
    await user.type(screen.getByLabelText(/full name/i), "Jane Doe");
    await user.type(screen.getByLabelText(/business email/i), "jane@company.com");
    await user.selectOptions(screen.getByLabelText(/service required/i), "Web Development");
    await user.type(screen.getByLabelText(/project description/i), "A new website with a booking integration.");
    await user.click(screen.getByLabelText(/I agree/i));
    await user.click(screen.getByRole("button", { name: /send inquiry/i }));
    expect(await screen.findByText(/has been sent/i)).toBeInTheDocument();
  });
});
