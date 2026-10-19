import {
  BarChart3,
  Bot,
  Braces,
  Brain,
  CalendarClock,
  Code2,
  FileSearch,
  FileText,
  Gauge,
  GitBranch,
  Globe,
  Layers,
  LayoutDashboard,
  LineChart,
  MapPin,
  Megaphone,
  MessagesSquare,
  MonitorSmartphone,
  PenLine,
  Receipt,
  RefreshCw,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Target,
  Users,
  Workflow,
  Wrench,
} from "lucide-react";
import type { Service, ServiceSlug } from "@/types/service";

export const services: Service[] = [
  {
    slug: "web-development",
    title: "Web Development",
    href: "/services/web-development",
    icon: Code2,
    accent: "brand",
    menuDescription: "Websites, web apps, e-commerce and custom software.",
    summary:
      "High-performance websites, web applications, e-commerce platforms, and custom software experiences.",
    overview:
      "We design and build websites and web applications that load quickly, read clearly, and stay easy to maintain. Whether you need a focused marketing site or a custom application your team uses every day, we start from your business goals and work back to the right architecture.",
    useCases: [
      "Replace an outdated website that is slow or hard to update",
      "Launch an online store with a clean checkout experience",
      "Build a client portal or internal dashboard",
      "Connect your website to a CRM, payment or booking system",
    ],
    offerings: [
      { title: "Business websites", description: "Fast, accessible, content-managed websites that explain what you do and turn visitors into conversations.", icon: Globe },
      { title: "Landing pages", description: "Focused campaign pages built for a single goal, with clean tracking and quick iteration.", icon: Target },
      { title: "E-commerce", description: "Storefronts with clear product discovery, reliable checkout, and integrations with inventory and fulfilment.", icon: ShoppingBag },
      { title: "Web applications", description: "Custom applications with authentication, roles, and the workflows your business actually runs on.", icon: Layers },
      { title: "Dashboards & portals", description: "Internal tools and client portals that bring scattered data and tasks into one place.", icon: LayoutDashboard },
      { title: "API integrations", description: "Reliable connections between your website and the services behind it — CRMs, payments, and data.", icon: Braces },
    ],
    benefits: [
      { title: "Performance", description: "Lean pages, optimized images and modern rendering so users are not kept waiting.", icon: Gauge },
      { title: "Usability", description: "Clear navigation, readable content, and interfaces designed around real tasks.", icon: Users },
      { title: "Responsive by default", description: "Layouts that work from small phones to wide desktop screens.", icon: MonitorSmartphone },
      { title: "Maintainability", description: "Typed, documented code and a structure your team or future developers can work with.", icon: Wrench },
      { title: "Scalable architecture", description: "Foundations chosen for where your product is heading, not just launch day.", icon: Layers },
      { title: "Secure foundations", description: "Sensible defaults for authentication, data handling, and dependency hygiene.", icon: ShieldCheck },
    ],
    process: [
      { title: "Discovery", description: "Goals, audience, content, integrations and constraints are mapped before anything is designed." },
      { title: "Design", description: "Wireframes and interface designs are reviewed with you, starting with the most important journeys." },
      { title: "Implementation", description: "We build in small, reviewable increments on a staging environment you can access." },
      { title: "Testing", description: "Functionality, responsiveness, accessibility and performance are checked before launch." },
      { title: "Deployment", description: "We launch, monitor, and hand over documentation and access to everything we built." },
    ],
    faqs: [
      { question: "How long does a website project take?", answer: "A focused business website typically takes a few weeks; web applications and e-commerce builds take longer depending on features and integrations. We give you a timeline after discovery, once the scope is clear, rather than guessing upfront." },
      { question: "How is scope defined?", answer: "After an initial conversation we document pages, features, integrations and responsibilities in a written scope. Anything outside it is discussed and agreed before work starts, so there are no surprises." },
      { question: "How many revisions are included?", answer: "Design rounds are planned into the project and agreed in the scope. We prefer to review early and often, which usually reduces the need for large late-stage revisions." },
      { question: "Can you maintain the website after launch?", answer: "Yes. We can provide ongoing maintenance, updates and improvements, or hand the project over to your internal team with documentation." },
      { question: "Do we own the code and accounts?", answer: "Yes. Domains, hosting, repositories and third-party accounts should be in your name. At handover you receive access to everything we built." },
    ],
  },
  {
    slug: "ai-solutions",
    title: "AI Solutions",
    href: "/services/ai-solutions",
    icon: Brain,
    accent: "mint",
    menuDescription: "Assistants, agents, document processing and AI integrations.",
    summary:
      "AI assistants, conversational systems, intelligent document processing, and practical AI integrations.",
    overview:
      "We help you apply AI where it saves real time — answering repetitive questions, finding information, extracting data from documents, or drafting first versions for a person to review. Every solution is scoped around a specific problem, tested against your own examples, and designed with clear boundaries.",
    useCases: [
      "Answer common customer questions from your own knowledge base",
      "Qualify and route incoming leads before a person follows up",
      "Search internal documents and policies in plain language",
      "Extract structured data from invoices, forms and PDFs",
      "Draft summaries and reports for review",
    ],
    offerings: [
      { title: "AI assistants", description: "Assistants that help customers or staff find answers, grounded in your approved content.", icon: Bot },
      { title: "Conversational agents", description: "Chat and messaging flows that collect information, answer questions, and hand over to a person when needed.", icon: MessagesSquare },
      { title: "Retrieval-augmented generation", description: "Answers sourced from your documents with references, so responses can be checked.", icon: FileSearch },
      { title: "Document processing", description: "Extraction and classification of documents into structured data your systems can use.", icon: FileText },
      { title: "AI integrations", description: "AI capabilities added to the tools you already use — CRM, helpdesk, spreadsheets and internal apps.", icon: Sparkles },
    ],
    benefits: [
      { title: "Faster responses", description: "Routine questions can be answered or drafted immediately, at any hour.", icon: MessagesSquare },
      { title: "Less manual data entry", description: "Information is extracted from documents instead of being retyped.", icon: FileText },
      { title: "Human oversight", description: "Review steps and escalation rules are built in where decisions matter.", icon: Users },
      { title: "Measured quality", description: "Solutions are evaluated against real examples before and after launch.", icon: LineChart },
    ],
    process: [
      { title: "Problem selection", description: "We identify a specific, repetitive task where AI can help and define what a good outcome looks like." },
      { title: "Data assessment", description: "We review the content and data available, its quality, and what must stay private." },
      { title: "Prototyping", description: "A working prototype is tested with real examples so you can judge usefulness early." },
      { title: "Evaluation", description: "Responses are checked against test cases for accuracy, tone and failure handling." },
      { title: "Deployment", description: "The solution is integrated into your systems with access controls and fallbacks." },
      { title: "Monitoring", description: "Usage, quality and cost are reviewed so the system can be improved over time." },
    ],
    faqs: [
      { question: "Is our business data kept private?", answer: "We design around your data requirements: choosing providers and settings that do not train on your data, limiting what is sent to models, and keeping sensitive information out of scope when appropriate safeguards are not in place." },
      { question: "How accurate will the AI be?", answer: "No AI system is perfectly accurate. We test against your real examples, ground answers in approved sources, and add human review or escalation for decisions that carry risk. You see evaluation results before anything goes live." },
      { question: "Can it work with our existing tools?", answer: "Usually, yes. Most CRMs, helpdesks, databases and messaging platforms offer APIs we can connect to. We confirm integration options during discovery." },
      { question: "What affects the cost?", answer: "The main factors are the complexity of the task, the number of integrations, the volume of usage, and the level of evaluation required. Model usage costs are ongoing and are estimated with you upfront." },
      { question: "Does an AI solution need maintenance?", answer: "Yes. Content changes, models are updated, and usage patterns shift. We recommend periodic reviews of quality and cost, and can provide ongoing support." },
    ],
  },
  {
    slug: "business-automation",
    title: "Business Automation",
    href: "/services/business-automation",
    icon: Workflow,
    accent: "brand",
    menuDescription: "Connected workflows, CRM automation and integrations.",
    summary:
      "Connected workflows, CRM automation, API integrations, and repetitive task automation.",
    overview:
      "Many businesses run on manual handoffs: copying data between tools, chasing reminders, and building the same report every week. We map how work actually moves through your business and connect the systems involved, so routine steps happen consistently and your team can focus on the work that needs judgement.",
    useCases: [
      "Capture leads from forms and ads directly into your CRM",
      "Send appointment confirmations and reminders automatically",
      "Generate invoices and follow up on overdue payments",
      "Keep customer data in sync across tools",
      "Produce recurring reports without manual exports",
    ],
    offerings: [
      { title: "CRM workflows", description: "Pipelines that update themselves as leads and customers move through each stage.", icon: Users },
      { title: "Lead management", description: "Capture, enrich, assign and follow up on new leads without manual copying.", icon: Target },
      { title: "Invoicing & payment reminders", description: "Invoices created from completed work and polite reminders sent on schedule.", icon: Receipt },
      { title: "Appointment workflows", description: "Booking confirmations, reminders, rescheduling links and post-visit follow-ups.", icon: CalendarClock },
      { title: "Reporting", description: "Data gathered from multiple tools into scheduled reports or live dashboards.", icon: BarChart3 },
      { title: "Data synchronization", description: "Records kept consistent between your CRM, spreadsheets, accounting and support tools.", icon: RefreshCw },
    ],
    benefits: [
      { title: "Less repetitive effort", description: "Routine steps run automatically instead of being repeated by hand.", icon: RefreshCw },
      { title: "Fewer manual handoffs", description: "Information moves between tools without being retyped or forgotten.", icon: GitBranch },
      { title: "Better visibility", description: "Every step is logged, so you can see where work is and what happened.", icon: LineChart },
      { title: "Consistent processes", description: "The same steps happen the same way, every time.", icon: ShieldCheck },
    ],
    process: [
      { title: "Discovery", description: "We learn how the process works today, who is involved, and where time is lost." },
      { title: "Workflow mapping", description: "The process is documented step by step, including exceptions and decision points." },
      { title: "Build", description: "We implement the workflow using the most suitable tool for your stack and budget." },
      { title: "Testing", description: "Workflows are tested with realistic data, including edge cases and failure scenarios." },
      { title: "Deployment", description: "We go live gradually, with your team briefed on what changed." },
      { title: "Monitoring & error handling", description: "Failures trigger alerts and retries, so problems are visible instead of silent." },
    ],
    faqs: [
      { question: "Which automation tools do you use?", answer: "We choose based on your existing systems, data sensitivity and budget. Options include n8n, Make, Zapier, GoHighLevel, or custom code using platform APIs when a no-code tool is not the right fit." },
      { question: "What happens when an automation fails?", answer: "Workflows include error handling: failed steps are retried where safe, logged, and reported to a named person so issues are fixed quickly rather than discovered weeks later." },
      { question: "Will our team need to change how they work?", answer: "Usually only slightly. The goal is to remove repetitive steps, not to impose a new process. We document changes and walk your team through them." },
      { question: "Can automations be changed later?", answer: "Yes. We document each workflow so it can be adjusted as your process evolves, either by us or by your team." },
    ],
  },
  {
    slug: "digital-marketing",
    title: "Digital Marketing",
    href: "/services/digital-marketing",
    icon: Megaphone,
    accent: "mint",
    menuDescription: "SEO, paid campaigns, analytics and conversion growth.",
    summary:
      "Search optimization, paid campaigns, analytics, and conversion-focused digital growth.",
    overview:
      "Visibility only matters if it brings the right people to a page that helps them act. We connect search, paid campaigns, content and analytics into one measurable system — so you know where enquiries come from and what to improve next.",
    useCases: [
      "Improve visibility in search for the services you offer",
      "Appear for local searches in the areas you serve",
      "Launch paid campaigns with clean conversion tracking",
      "Understand which channels actually generate enquiries",
    ],
    offerings: [
      { title: "Technical & on-page SEO", description: "Site structure, performance, metadata and content improvements that help search engines understand your pages.", icon: Search },
      { title: "Local SEO", description: "Location pages, citations and on-site signals for businesses serving specific areas.", icon: MapPin },
      { title: "Google Business Profile", description: "Profile optimization, categories, services and posting guidance for local visibility.", icon: Globe },
      { title: "Google Ads", description: "Search and Performance Max campaigns structured around intent and measured on enquiries.", icon: Target },
      { title: "Meta Ads", description: "Audience-led campaigns on Facebook and Instagram with creative testing.", icon: Megaphone },
      { title: "Content strategy", description: "Topics and formats planned around the questions your customers actually ask.", icon: PenLine },
      { title: "Analytics", description: "GA4, Tag Manager and conversion tracking set up so the numbers can be trusted.", icon: BarChart3 },
    ],
    benefits: [
      { title: "Clear measurement", description: "Conversions are tracked consistently, so decisions are based on data.", icon: LineChart },
      { title: "Better-qualified traffic", description: "Targeting focused on intent rather than volume alone.", icon: Target },
      { title: "Joined-up channels", description: "Search, ads and content work together instead of in isolation.", icon: GitBranch },
      { title: "Continuous improvement", description: "Regular reviews turn results into specific next actions.", icon: RefreshCw },
    ],
    process: [
      { title: "Research", description: "Audience, competitors, search demand and your current performance are reviewed." },
      { title: "Launch", description: "Campaigns, content and tracking are set up against agreed goals." },
      { title: "Monitor", description: "Performance is tracked weekly, with spend and quality checked closely early on." },
      { title: "Analyze", description: "We look at what is driving enquiries and what is not." },
      { title: "Improve", description: "Budgets, keywords, creative and pages are refined based on evidence." },
    ],
    faqs: [
      { question: "Can you guarantee first-page rankings?", answer: "No one can honestly guarantee rankings — search engines control them. We focus on the factors within your control: technical quality, relevant content, local signals and a site that converts visitors." },
      { question: "What will we receive each month?", answer: "Deliverables depend on the agreed plan, and typically include a summary of work completed, key metrics against goals, what we learned, and the next actions we recommend." },
      { question: "How do you measure success?", answer: "We agree on measurable goals at the start — usually qualified enquiries, bookings or sales — and set up tracking so those numbers are reliable before scaling spend." },
      { question: "What affects results?", answer: "Competition, budget, your offer, website quality, seasonality and how quickly leads are followed up all play a role. We are transparent about which of these are holding results back." },
    ],
  },
];

export const serviceMap = Object.fromEntries(services.map((s) => [s.slug, s])) as Record<ServiceSlug, Service>;

export function getService(slug: ServiceSlug): Service {
  return serviceMap[slug];
}

export const integrationGroups = [
  { label: "Automation platforms", items: ["n8n", "Make", "Zapier", "GoHighLevel"] },
  { label: "CRMs & sales", items: ["HubSpot", "Pipedrive", "Salesforce", "Zoho CRM"] },
  { label: "Data & spreadsheets", items: ["Google Sheets", "Airtable", "PostgreSQL", "Excel / OneDrive"] },
  { label: "Communication", items: ["Gmail / Outlook", "Slack", "WhatsApp Business API", "SMS gateways"] },
] as const;

export const techStack = [
  { label: "Frontend", items: ["Next.js", "React", "TypeScript", "Tailwind CSS"] },
  { label: "Backend", items: ["Node.js", "Python", "REST & GraphQL APIs", "PostgreSQL"] },
  { label: "AI", items: ["LLM APIs", "Embeddings & vector search", "Document extraction", "Evaluation tooling"] },
  { label: "Commerce & CMS", items: ["Shopify", "WooCommerce", "Headless CMS", "Stripe"] },
  { label: "Marketing & data", items: ["GA4", "Google Tag Manager", "Google Ads", "Meta Ads"] },
] as const;

