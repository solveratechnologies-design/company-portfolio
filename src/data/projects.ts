import type { Project, ProjectCategory, ProjectStatus } from "@/types/project";

/**
 * IMPORTANT: Every project below is a clearly labeled concept project or
 * internal prototype. None represent commissioned client work, and none
 * include outcome metrics. When verified client work is available, add it
 * with status "client" and populate `results` only with approved figures.
 */
export const projects: Project[] = [
  {
    slug: "clinic-intake-automation",
    title: "Clinic Booking & Intake Automation",
    category: "Business Automation",
    status: "concept",
    featured: true,
    services: ["business-automation", "web-development"],
    summary:
      "A connected booking flow that confirms appointments, collects intake forms before the visit, and keeps the front desk's schedule current.",
    problem:
      "Small clinics often juggle phone bookings, paper intake forms and manual reminder calls. Front-desk time goes into repetitive admin, missed appointments are common, and patient details are retyped into several systems.",
    goals: [
      "Reduce manual reminder calls and data re-entry",
      "Collect intake information before the appointment",
      "Give staff one reliable view of the day's schedule",
    ],
    constraints: [
      "Patient information must stay within systems approved for health data",
      "Staff need a simple fallback when a patient cannot use online forms",
      "Must work with an existing scheduling tool rather than replacing it",
    ],
    solution:
      "An online booking page feeds the existing scheduling system. Each confirmed booking triggers a confirmation message and a secure intake form link. Reminders go out at set intervals, and completed forms attach to the appointment record so the front desk sees what is outstanding at a glance.",
    approach: [
      { title: "Process mapping", description: "Documented the current booking journey from first contact to post-visit follow-up, including every manual step and exception." },
      { title: "Workflow design", description: "Defined triggers, timing rules and fallback paths — for example, when a form is not completed 24 hours before a visit." },
      { title: "Integration build", description: "Connected the booking page, scheduler and messaging service through an automation platform with logging on every step." },
      { title: "Staff dashboard", description: "Designed a daily view showing confirmations, outstanding forms and reschedule requests." },
    ],
    technologies: ["Next.js", "n8n", "Scheduling API", "Transactional email & SMS", "PostgreSQL"],
    cover: { kind: "workflow", caption: "Booking-to-intake workflow with automated confirmations and reminders" },
    gallery: [
      { kind: "workflow", caption: "Automation flow: booking, confirmation, intake, and reminders" },
      { kind: "dashboard", caption: "Front-desk view of today's appointments and outstanding forms" },
    ],
    lessons: [
      "Fallback paths for people who do not complete online forms matter as much as the automated path.",
      "Reminder timing should be configurable by staff, not hardcoded.",
      "A future version could add waitlist handling to fill cancelled slots.",
    ],
  },
  {
    slug: "knowledge-base-ai-assistant",
    title: "Knowledge-Base AI Support Assistant",
    category: "AI Solutions",
    status: "prototype",
    featured: true,
    services: ["ai-solutions"],
    summary:
      "An internal prototype of a support assistant that answers questions from approved help articles, cites its sources, and hands over to a person when unsure.",
    problem:
      "Support teams answer the same questions repeatedly, while the answers already exist in help articles and policy documents that customers rarely find.",
    goals: [
      "Answer common questions using only approved content",
      "Show sources so answers can be verified",
      "Escalate to a person when confidence is low or the request is sensitive",
    ],
    constraints: [
      "Must not invent policies or prices that are not in the source content",
      "Conversations should not be used to train third-party models",
      "Clear handover path to a human agent",
    ],
    solution:
      "Help articles are split into passages, embedded and stored in a vector index. For each question, the most relevant passages are retrieved and given to the language model with strict instructions to answer only from them and cite the article. Questions outside the content, or about refunds and account changes, are routed to a person with the conversation attached.",
    approach: [
      { title: "Content preparation", description: "Cleaned and structured the help content, removing outdated articles before indexing." },
      { title: "Retrieval pipeline", description: "Built chunking, embedding and retrieval with source references attached to every passage." },
      { title: "Guardrails", description: "Added topic boundaries, refusal behavior and escalation rules for sensitive requests." },
      { title: "Evaluation set", description: "Created a test set of real-style questions to measure answer quality and correct escalation before any changes ship." },
    ],
    technologies: ["Python", "LLM API", "Vector database", "Next.js", "Evaluation harness"],
    cover: { kind: "chat", caption: "Assistant answering a question with cited help-centre sources" },
    gallery: [
      { kind: "chat", caption: "Conversation view with source citations and human handover" },
      { kind: "document", caption: "Source passages retrieved for a question" },
    ],
    lessons: [
      "Answer quality depends more on clean source content than on model choice.",
      "An evaluation set is essential for making changes safely.",
      "Next step: connect to a helpdesk so escalations create tickets automatically.",
    ],
  },
  {
    slug: "storefront-performance-rebuild",
    title: "Performance-First E-commerce Storefront",
    category: "Web Development",
    status: "concept",
    featured: true,
    services: ["web-development", "digital-marketing"],
    summary:
      "A headless storefront concept focused on fast product discovery, a simplified checkout, and clean analytics from day one.",
    problem:
      "Template-based stores often become slow as apps and scripts accumulate. Product pages load heavy assets, filters are frustrating on mobile, and tracking is too inconsistent to tell which campaigns drive sales.",
    goals: [
      "Fast product and category pages on mobile connections",
      "Filtering and search that work well on small screens",
      "Reliable e-commerce tracking for marketing decisions",
    ],
    constraints: [
      "Keep the existing commerce platform for orders and inventory",
      "Non-technical staff must be able to edit content and promotions",
    ],
    solution:
      "A headless front end renders category and product pages statically and refreshes them when products change. Images are served responsively, third-party scripts are audited and deferred, and a consistent analytics data layer tracks product views, add-to-cart and purchases.",
    approach: [
      { title: "Audit", description: "Reviewed page weight, scripts, navigation patterns and checkout drop-off points." },
      { title: "Information architecture", description: "Reorganized categories and filters around how customers shop." },
      { title: "Front-end build", description: "Built reusable product, collection and cart components with accessible interactions." },
      { title: "Measurement", description: "Defined a single e-commerce event schema shared by analytics and ad platforms." },
    ],
    technologies: ["Next.js", "TypeScript", "Headless commerce API", "Headless CMS", "GA4", "Google Tag Manager"],
    cover: { kind: "storefront", caption: "Product listing page with mobile-friendly filters" },
    gallery: [
      { kind: "storefront", caption: "Collection page with filters and quick add-to-cart" },
      { kind: "analytics", caption: "Illustrative e-commerce funnel report (sample data)" },
    ],
    lessons: [
      "Most performance gains come from removing what is not needed rather than adding optimizations.",
      "Agreeing on an event schema early prevents months of unreliable reporting.",
    ],
  },
  {
    slug: "field-service-operations-portal",
    title: "Field Service Operations Portal",
    category: "Custom Software",
    status: "concept",
    featured: true,
    services: ["web-development", "business-automation"],
    summary:
      "A custom portal concept for scheduling jobs, tracking technician progress, and giving customers live status updates.",
    problem:
      "Service businesses often coordinate jobs through spreadsheets, phone calls and group chats. Managers lack a real-time view, technicians repeat updates in several places, and customers call to ask where things stand.",
    goals: [
      "One source of truth for jobs, assignments and status",
      "Simple mobile updates for technicians in the field",
      "Automatic status updates for customers",
    ],
    constraints: [
      "Technicians may have poor connectivity on site",
      "Must export to the existing accounting software",
    ],
    solution:
      "A role-based web application with a manager dashboard, a mobile-friendly technician view and a customer status page. Job status changes trigger customer notifications, and completed jobs are pushed to accounting for invoicing.",
    approach: [
      { title: "Role mapping", description: "Defined what managers, technicians and customers each need to see and do." },
      { title: "Data model", description: "Designed jobs, sites, assets and visit records around real scheduling scenarios." },
      { title: "Interface design", description: "Prioritized one-handed mobile updates for technicians and an at-a-glance board for managers." },
      { title: "Integrations", description: "Planned accounting export and notification triggers on status changes." },
    ],
    technologies: ["Next.js", "TypeScript", "PostgreSQL", "Role-based access control", "Accounting API", "Webhooks"],
    cover: { kind: "portal", caption: "Manager board showing jobs by status and technician" },
    gallery: [
      { kind: "portal", caption: "Job board grouped by status" },
      { kind: "dashboard", caption: "Operations overview with workload and schedule" },
    ],
    lessons: [
      "Offline-tolerant updates for technicians should be designed in from the start.",
      "Customer-facing status pages can significantly reduce inbound calls — something to measure in a real deployment.",
    ],
  },
  {
    slug: "local-growth-measurement-framework",
    title: "Local Growth & Measurement Framework",
    category: "Digital Marketing",
    status: "concept",
    featured: false,
    services: ["digital-marketing"],
    summary:
      "A concept marketing framework for multi-location service businesses, combining local SEO, paid search and call tracking in one report.",
    problem:
      "Businesses with several locations often run marketing without knowing which location, channel or campaign produces enquiries. Profiles are inconsistent and calls are not attributed.",
    goals: [
      "Consistent local presence across every location",
      "Attribute calls and forms to channels and locations",
      "A single monthly report that leads to clear actions",
    ],
    constraints: ["Each location has a different budget", "Reports must be understandable for non-marketers"],
    solution:
      "Location pages and Google Business Profiles are standardized, paid search campaigns are structured by location, and calls and forms are tracked to source. A shared dashboard shows enquiries by location and channel with notes on what changed.",
    approach: [
      { title: "Audit", description: "Reviewed profiles, location pages, citations and existing tracking." },
      { title: "Structure", description: "Designed a location-based campaign and page structure." },
      { title: "Tracking", description: "Planned form and call tracking with consistent naming." },
      { title: "Reporting", description: "Designed a monthly report focused on enquiries and next actions." },
    ],
    technologies: ["Google Business Profile", "Google Ads", "GA4", "Google Tag Manager", "Call tracking", "Looker Studio"],
    cover: { kind: "analytics", caption: "Illustrative enquiries-by-location report (sample data)" },
    gallery: [{ kind: "analytics", caption: "Illustrative channel and location report (sample data)" }],
    lessons: ["Clean tracking has to come before budget increases.", "Location-level reporting exposes where follow-up speed is the real constraint."],
  },
  {
    slug: "real-estate-lead-qualification",
    title: "Real Estate Lead Qualification Workflow",
    category: "AI Solutions",
    status: "prototype",
    featured: false,
    services: ["ai-solutions", "business-automation"],
    summary:
      "An internal prototype that classifies incoming property enquiries, asks follow-up questions, and routes qualified leads to the right agent.",
    problem:
      "Property enquiries arrive from portals, forms and messages in inconsistent formats. Agents spend time sorting and following up on enquiries that are incomplete or not a fit.",
    goals: ["Standardize enquiries from every source", "Collect missing details automatically", "Route qualified leads quickly"],
    constraints: ["A person must make the final call on qualification", "Messages must be clearly identified as automated"],
    solution:
      "Each enquiry is normalized and classified by intent, budget and location. Missing details are requested with a short automated message. Qualified leads are created in the CRM and assigned by area, with a summary the agent can review before calling.",
    approach: [
      { title: "Classification", description: "Defined intent categories and tested AI classification against sample enquiries." },
      { title: "Follow-up logic", description: "Designed short, clearly automated follow-up questions." },
      { title: "CRM routing", description: "Mapped assignment rules by area and enquiry type." },
      { title: "Review", description: "Added a summary card for agents to confirm before contact." },
    ],
    technologies: ["LLM API", "n8n", "CRM API", "Messaging API"],
    cover: { kind: "pipeline", caption: "Lead pipeline with AI-classified enquiries" },
    gallery: [{ kind: "pipeline", caption: "CRM pipeline with qualification summaries" }],
    lessons: ["Classification works best with a small, well-defined set of categories.", "Agents trusted the system more when the AI's reasoning summary was visible."],
  },
  {
    slug: "invoice-data-extraction",
    title: "Invoice Data Extraction Pipeline",
    category: "AI Solutions",
    status: "prototype",
    featured: false,
    services: ["ai-solutions", "business-automation"],
    summary:
      "An internal prototype that extracts supplier, totals and line items from PDF invoices into structured data for review.",
    problem:
      "Finance teams retype supplier invoices into accounting software. Layouts vary between suppliers, making simple templates unreliable.",
    goals: ["Extract key fields from varied invoice layouts", "Flag low-confidence fields for review", "Export approved data to accounting"],
    constraints: ["Every extracted invoice is reviewed before posting", "Documents must be stored securely"],
    solution:
      "Uploaded invoices are converted to text and layout data, then key fields and line items are extracted into a fixed schema. Validation checks totals and tax, and any inconsistency is highlighted in a review screen before export.",
    approach: [
      { title: "Schema", description: "Defined the exact fields and validation rules finance needs." },
      { title: "Extraction", description: "Combined layout parsing with AI extraction into the schema." },
      { title: "Validation", description: "Added arithmetic and format checks to catch errors automatically." },
      { title: "Review UI", description: "Designed a side-by-side review of document and extracted data." },
    ],
    technologies: ["Python", "Document parsing", "LLM API", "Next.js", "Accounting API"],
    cover: { kind: "document", caption: "Invoice with extracted fields ready for review" },
    gallery: [{ kind: "document", caption: "Side-by-side review of source invoice and extracted data" }],
    lessons: ["Validation rules catch more errors than model upgrades.", "Keeping a person in the loop is essential for financial data."],
  },
];

export const projectCategories: ProjectCategory[] = [
  "Web Development",
  "Custom Software",
  "AI Solutions",
  "Business Automation",
  "Digital Marketing",
];

export const statusLabel: Record<ProjectStatus, string> = {
  concept: "Concept Project",
  prototype: "Internal Prototype",
  client: "Client Project",
};

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(limit = 4) {
  return projects.filter((p) => p.featured).slice(0, limit);
}

export function getRelatedProjects(slug: string, limit = 2) {
  const current = getProject(slug);
  if (!current) return [];
  return projects
    .filter((p) => p.slug !== slug)
    .map((p) => ({
      p,
      score: (p.category === current.category ? 2 : 0) + p.services.filter((s) => current.services.includes(s)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ p }) => p);
}

export function getProjectsByService(service: Project["services"][number], limit = 3) {
  return projects.filter((p) => p.services.includes(service)).slice(0, limit);
}

export function filterProjects(list: Project[], category: ProjectCategory | "All") {
  return category === "All" ? list : list.filter((p) => p.category === category);
}
