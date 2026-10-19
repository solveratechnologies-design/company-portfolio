import type { Article, ArticleBlock, ArticleCategory } from "@/types/article";

/**
 * Publication dates are intentionally left undefined. Set `publishedAt`
 * (ISO date) when each article is actually published — dates and the
 * Article JSON-LD will then appear automatically.
 */
export const articles: Article[] = [
  {
    slug: "which-business-processes-to-automate",
    title: "How to Identify the Right Business Processes to Automate",
    excerpt:
      "Not every task should be automated. A simple way to find the processes where automation saves real time — and avoid the ones where it creates new problems.",
    category: "Automation",
    author: "Solvera Technologies",
    featured: true,
    cover: { tone: "brand", motif: "nodes" },
    body: [
      { type: "p", text: "Automation is most valuable when it removes repetitive, predictable work from people who should be spending their time on judgement, relationships or craft. It is least valuable when it is applied to a process nobody fully understands, or one that changes every week. The difference between the two is usually visible before a single workflow is built." },
      { type: "h2", id: "start-with-the-work", text: "Start with the work, not the tool" },
      { type: "p", text: "It is tempting to begin with a platform — n8n, Make, Zapier — and look for things to connect. A better starting point is a list of tasks your team repeats every week. Ask each person to note what they copy from one system to another, what reminders they send manually, and what reports they rebuild." },
      { type: "p", text: "You will usually find the same handful of tasks appearing across several people. Those are your candidates." },
      { type: "h2", id: "five-questions", text: "Five questions to score each candidate" },
      { type: "ol", items: [
        "How often does it happen? Daily and weekly tasks pay back faster than quarterly ones.",
        "Are the steps predictable? If the same inputs lead to the same actions, it can be automated. If it depends on judgement every time, it may only be partly automatable.",
        "Where does the data live? Tasks involving tools with good APIs are far easier to automate than those relying on email attachments or paper.",
        "What happens when it goes wrong? Missing a reminder is inconvenient; sending an incorrect invoice is serious. Higher-risk processes need review steps.",
        "Who owns it? Every automation needs a person responsible for noticing when it fails and updating it when the process changes.",
      ] },
      { type: "callout", title: "A useful rule of thumb", text: "If you cannot write the process down as a short list of steps with clear exceptions, it is not ready to automate yet. Document it first — the documentation alone often reveals improvements." },
      { type: "h2", id: "good-first-candidates", text: "Good first candidates" },
      { type: "ul", items: [
        "Capturing leads from website forms and ads into your CRM",
        "Appointment confirmations and reminders",
        "Creating invoices from completed jobs and sending payment reminders",
        "Syncing customer details between your CRM, accounting and support tools",
        "Compiling recurring reports from several data sources",
      ] },
      { type: "h2", id: "what-to-avoid", text: "What to avoid at the start" },
      { type: "p", text: "Avoid automating processes that are still being designed, processes with many one-off exceptions, and anything where a silent failure would cause serious harm. These can often be automated later, once the process has settled and you have experience running simpler workflows." },
      { type: "h2", id: "measure", text: "Measure before and after" },
      { type: "p", text: "Before building anything, estimate how long the task takes today and how often errors occur. After launch, check the same numbers. This keeps the conversation grounded in real outcomes and helps decide what to automate next." },
    ],
  },
  {
    slug: "before-building-a-business-website",
    title: "What to Consider Before Building a Business Website",
    excerpt:
      "Before choosing a design or a platform, get clear on these decisions. They shape the cost, timeline and long-term usefulness of your website.",
    category: "Web Development",
    author: "Solvera Technologies",
    cover: { tone: "ink", motif: "grid" },
    body: [
      { type: "p", text: "A new website is often treated as a design project. In practice, the decisions that most affect its success are made before any design work starts: who it is for, what it should help them do, and how it will be maintained after launch." },
      { type: "h2", id: "define-the-goal", text: "Define the main goal" },
      { type: "p", text: "Most business websites have one primary job — generating enquiries, selling products, taking bookings, or supporting existing customers. Write it down. Every page, section and button should support it, and it gives you a way to measure whether the site works." },
      { type: "h2", id: "know-your-audience", text: "Know who you are speaking to" },
      { type: "p", text: "List the main types of visitors and the questions they arrive with. A prospective client wants to understand what you do and whether you can help. An existing customer wants support information quickly. Designing around these questions produces clearer navigation than designing around your internal structure." },
      { type: "h2", id: "content-first", text: "Plan the content early" },
      { type: "p", text: "Content is the most common cause of website delays. Decide early who will write service descriptions, which projects you can show, and what images you have the rights to use. Designing with real content produces better results than fitting text into a layout afterwards." },
      { type: "h2", id: "integrations", text: "List the integrations" },
      { type: "ul", items: [
        "Where should form submissions go — email, CRM, or both?",
        "Do you need booking, payments or a customer login?",
        "Which analytics and advertising platforms need tracking?",
        "Does anything need to sync with inventory or accounting?",
      ] },
      { type: "callout", title: "Ownership matters", text: "Make sure your domain, hosting, analytics and code repository are in your company's name. It avoids difficult situations if you change providers later." },
      { type: "h2", id: "after-launch", text: "Plan for after launch" },
      { type: "p", text: "Websites need updates: new content, security patches, and improvements based on how people use them. Decide who will make content changes, how technical updates will be handled, and how often you will review performance." },
    ],
  },
  {
    slug: "introducing-ai-into-everyday-workflows",
    title: "Practical Ways to Introduce AI Into Everyday Workflows",
    excerpt:
      "Start small, keep people in the loop, and measure what changes. A grounded approach to adopting AI in a growing business.",
    category: "AI",
    author: "Solvera Technologies",
    cover: { tone: "mint", motif: "rings" },
    body: [
      { type: "p", text: "Most businesses do not need a large AI programme to benefit from AI. They need one or two well-chosen uses where it saves time on repetitive work, with clear boundaries and a person reviewing anything important." },
      { type: "h2", id: "where-ai-helps", text: "Where AI tends to help" },
      { type: "ul", items: [
        "Drafting first versions of routine emails, summaries and reports for review",
        "Answering common questions from your own help content",
        "Extracting information from documents such as invoices and forms",
        "Classifying and routing incoming requests",
        "Searching internal documents in plain language",
      ] },
      { type: "h2", id: "assist-before-automate", text: "Assist before you automate" },
      { type: "p", text: "A practical progression is to let AI suggest, then let a person approve, and only later — for low-risk tasks with a strong track record — let it act on its own. This builds confidence and reveals edge cases before they matter." },
      { type: "callout", title: "Be specific about boundaries", text: "Decide upfront what an AI system is allowed to do, what it must never do, and when it should hand over to a person. Write these rules down and test them." },
      { type: "h2", id: "data", text: "Think carefully about data" },
      { type: "p", text: "Before connecting AI to business data, check what information would be sent to the provider, whether it could be used for training, and whether it includes personal or confidential details. Choose providers and settings that match your obligations, and keep sensitive data out of scope where safeguards are not in place." },
      { type: "h2", id: "measure-quality", text: "Measure quality, not just usage" },
      { type: "p", text: "Collect a set of real examples and check how the system handles them before launch and after every change. Track how often answers are corrected or escalated. These numbers tell you whether the system is helping." },
    ],
  },
  {
    slug: "conversion-tracking-before-ad-spend",
    title: "Why Conversion Tracking Should Come Before Ad Spend",
    excerpt:
      "Increasing an ad budget without reliable tracking makes it harder, not easier, to grow. Here is what to set up first.",
    category: "Digital Marketing",
    author: "Solvera Technologies",
    cover: { tone: "brand", motif: "bars" },
    body: [
      { type: "p", text: "Ad platforms optimize toward the conversions you tell them about. If tracking is missing, duplicated or counts the wrong action, campaigns learn the wrong lessons — and reports become a matter of opinion." },
      { type: "h2", id: "decide-what-counts", text: "Decide what counts as a conversion" },
      { type: "p", text: "Pick the actions that genuinely indicate business value: a submitted enquiry, a booked call, a purchase. Page views and button clicks can be useful signals, but they should not be the primary goal campaigns optimize toward." },
      { type: "h2", id: "setup-checklist", text: "A basic setup checklist" },
      { type: "ul", items: [
        "GA4 installed once, through Google Tag Manager",
        "Form submissions tracked on confirmed success, not on button click",
        "Phone calls tracked where calls are a key channel",
        "Consistent naming for events and campaigns",
        "Conversions imported into ad platforms from a single source of truth",
        "Consent handled according to the regions you operate in",
      ] },
      { type: "h2", id: "test", text: "Test it like software" },
      { type: "p", text: "Submit test enquiries, complete test purchases, and confirm each appears once in analytics and ad platforms. Repeat after any website change. Broken tracking is common and often goes unnoticed for months." },
      { type: "callout", title: "Then scale", text: "Once the numbers can be trusted, budget decisions become straightforward conversations about cost per qualified enquiry rather than guesswork." },
    ],
  },
  {
    slug: "choosing-between-no-code-and-custom-automation",
    title: "Choosing Between No-Code Automation and Custom Integrations",
    excerpt:
      "No-code platforms are fast and flexible, but they are not always the right fit. How to decide which approach suits each workflow.",
    category: "Automation",
    author: "Solvera Technologies",
    cover: { tone: "ink", motif: "nodes" },
    body: [
      { type: "p", text: "Tools like n8n, Make and Zapier make it possible to connect business systems quickly. Custom code offers more control. Neither is universally better — the right choice depends on volume, complexity, data sensitivity and who will maintain the workflow." },
      { type: "h2", id: "when-no-code-fits", text: "When no-code fits well" },
      { type: "ul", items: [
        "The systems involved have well-supported connectors",
        "Volumes are moderate and costs per task stay reasonable",
        "Non-developers need to understand or adjust the workflow",
        "Speed of delivery matters more than fine-grained control",
      ] },
      { type: "h2", id: "when-custom-fits", text: "When custom integrations make sense" },
      { type: "ul", items: [
        "High volumes where per-task pricing becomes expensive",
        "Complex logic, transformations or strict performance needs",
        "Sensitive data that must stay within your own infrastructure",
        "The workflow is core to your product and needs full testing",
      ] },
      { type: "callout", title: "Self-hosting is a middle ground", text: "Some platforms, such as n8n, can be self-hosted. This keeps data in your own environment while retaining a visual editor — useful when data control matters but full custom development is not justified." },
      { type: "h2", id: "maintainability", text: "Plan for maintenance either way" },
      { type: "p", text: "Whichever approach you choose, document each workflow, name an owner, and set up alerts for failures. Most automation problems are not caused by the tool but by changes nobody noticed." },
    ],
  },
  {
    slug: "planning-a-custom-dashboard",
    title: "Planning a Custom Dashboard Your Team Will Actually Use",
    excerpt:
      "Dashboards fail when they show everything. Start from the decisions people make, and design around those.",
    category: "Strategy",
    author: "Solvera Technologies",
    cover: { tone: "mint", motif: "grid" },
    body: [
      { type: "p", text: "Many dashboards are opened once and forgotten. The common cause is that they were designed around available data rather than around the decisions the team makes every day." },
      { type: "h2", id: "start-with-decisions", text: "Start with decisions" },
      { type: "p", text: "Ask each role which decisions they make daily or weekly and what information they need to make them. A dispatcher needs to know which jobs are unassigned; a manager needs to know which are at risk of running late. These lead to different views." },
      { type: "h2", id: "fewer-metrics", text: "Show fewer, clearer metrics" },
      { type: "p", text: "Each metric should have a definition everyone agrees on, a clear source, and a reason to be on the screen. If nobody would act differently when it changes, it probably belongs in a report rather than a dashboard." },
      { type: "h2", id: "data-quality", text: "Fix data quality early" },
      { type: "p", text: "A dashboard exposes inconsistent data immediately. Budget time to clean up how information is captured at the source — usually in forms and workflows — before building charts on top of it." },
      { type: "callout", title: "Make it actionable", text: "The best dashboards let people act directly: assign a job, follow up on a lead, or open the record behind a number." },
    ],
  },
];

export const articleCategories: ArticleCategory[] = ["Automation", "Web Development", "AI", "Digital Marketing", "Strategy"];

function blockText(block: ArticleBlock) {
  switch (block.type) {
    case "ul":
    case "ol":
      return block.items.join(" ");
    case "callout":
      return `${block.title} ${block.text}`;
    default:
      return block.text;
  }
}

export function countWords(article: Pick<Article, "title" | "body">) {
  const text = [article.title, ...article.body.map(blockText)].join(" ");
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Reading time in minutes, at ~220 words per minute, minimum 1. */
export function readingTime(article: Pick<Article, "title" | "body">) {
  return Math.max(1, Math.round(countWords(article) / 220));
}

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}

export function getTableOfContents(article: Article) {
  return article.body.filter((b): b is Extract<ArticleBlock, { type: "h2" }> => b.type === "h2");
}

export function getRelatedArticles(slug: string, limit = 3) {
  const current = getArticle(slug);
  if (!current) return [];
  return [...articles]
    .filter((a) => a.slug !== slug)
    .sort((a, b) => Number(b.category === current.category) - Number(a.category === current.category))
    .slice(0, limit);
}

export function getFeaturedArticle() {
  return articles.find((a) => a.featured) ?? articles[0];
}
