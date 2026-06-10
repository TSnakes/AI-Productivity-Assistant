// Lightweight deterministic mock "AI" so the app feels responsive without a backend.
// Designed to degrade gracefully: missing/huge/garbled inputs still produce a usable result.

const MAX_TOPIC_LEN = 600;
const MAX_NOTES_LEN = 8000;
const MAX_TASKS = 12;
const MAX_TASK_LEN = 140;

function sanitize(input: unknown, max: number): string {
  if (typeof input !== "string") return "";
  // Strip control chars, collapse whitespace, trim, and cap length.
  const cleaned = input
    .replace(/[\u0000-\u0008\u000B-\u001F\u007F]/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  return cleaned.length > max ? cleaned.slice(0, max).trimEnd() + "…" : cleaned;
}

function toSubject(topic: string): string {
  const firstLine = topic.split(/\n/)[0] ?? topic;
  const short = firstLine.length > 70 ? firstLine.slice(0, 67).trimEnd() + "…" : firstLine;
  // Capitalize first letter without altering the rest.
  return short.charAt(0).toUpperCase() + short.slice(1);
}

export type EmailTone = "Formal" | "Friendly" | "Persuasive" | "Direct";

export function mockEmail(
  topic: string,
  tone: EmailTone,
  recipient?: string,
): string {
  const tones: EmailTone[] = ["Formal", "Friendly", "Persuasive", "Direct"];
  const safeTone: EmailTone = tones.includes(tone) ? tone : "Formal";
  const cleaned = sanitize(topic, MAX_TOPIC_LEN);
  const who = sanitize(recipient ?? "", 120);
  const t = cleaned || "our upcoming project update";
  const subject = toSubject(cleaned || "Project update");

  const audience = who || "Team";
  const greeting: Record<EmailTone, string> = {
    Formal: `Dear ${audience},`,
    Friendly: `Hi ${audience.split(/[, ]/)[0] || "team"},`,
    Persuasive: `${audience} —`,
    Direct: `${audience.split(/[, ]/)[0] || "Team"},`,
  };
  const closing: Record<EmailTone, string> = {
    Formal: "Kind regards,\n[Your Name]",
    Friendly: "Thanks so much,\n[Your Name]",
    Persuasive: "Looking forward to your response,\n[Your Name]",
    Direct: "Thanks,\n[Your Name]",
  };

  const body: Record<EmailTone, string> = {
    Formal: `I hope this message finds you well. I am writing to provide an update regarding ${t}. Please review the points below and let me know if you have any questions or require further clarification.\n\n• Context and current status\n• Key milestones and owners\n• Next steps and decisions required\n\nYour timely input would be greatly appreciated.`,
    Friendly: `Quick note about ${t} — wanted to keep everyone in the loop!\n\nHere's where we are:\n• What's done\n• What's in progress\n• What I need from you\n\nLet me know if anything looks off or you'd like to chat through it. 🙌`,
    Persuasive: `I want to share something important about ${t} — and why acting on it this week matters.\n\nWhy now:\n• Momentum is on our side\n• A short delay creates outsized downstream cost\n• A small commitment unlocks a meaningful win\n\nIf you can confirm by Friday, we can move forward immediately and keep this on track.`,
    Direct: `Heads up on ${t}.\n\n• What I need: a clear yes/no by EOD Thursday\n• Why it matters: it unblocks the next milestone\n• What happens next: I'll send the rollout plan once confirmed\n\nIf there are blockers, reply with one line and I'll handle it.`,
  };

  return `Subject: ${subject}\n\n${greeting[safeTone]}\n\n${body[safeTone]}\n\n${closing[safeTone]}`;
}

export interface SummaryResult {
  summary: string;
  actions: string[];
  deadlines: { label: string; when: string }[];
}

export function mockSummarize(notes: string): SummaryResult {
  const text = sanitize(notes, MAX_NOTES_LEN);
  if (!text) {
    return {
      summary: "No notes provided. Paste a transcript or bullet points to generate a summary.",
      actions: [],
      deadlines: [],
    };
  }

  const sentences = text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.replace(/^[\s•\-–*\d.)]+/, "").trim())
    .filter((s) => s.length >= 3);

  // Fallback when input has no sentence-like structure (single phrase, no punctuation).
  if (sentences.length === 0) {
    const oneLiner = text.length > 160 ? text.slice(0, 157) + "…" : text;
    return {
      summary: `Notes captured: ${oneLiner}`,
      actions: [`Review and expand: ${oneLiner}`],
      deadlines: defaultDeadlines(),
    };
  }

  const lead = sentences.slice(0, 2).join(". ").replace(/\.+$/, "");
  const summary =
    sentences.length > 2
      ? `${lead}. The team aligned on next steps and ownership across ${sentences.length} discussion points.`
      : `${lead}.`;

  const verbs = ["Follow up on", "Draft", "Review", "Schedule", "Share", "Confirm"];
  const seen = new Set<string>();
  const actions: string[] = [];
  for (const s of sentences) {
    if (actions.length >= 5) break;
    const trimmed = s.length > 80 ? s.slice(0, 80).trimEnd() + "…" : s;
    const key = trimmed.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    actions.push(`${verbs[actions.length % verbs.length]} ${trimmed}`);
  }

  return { summary, actions, deadlines: defaultDeadlines() };
}

function defaultDeadlines() {
  const today = new Date();
  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  return [
    { label: "Initial draft circulated", when: fmt(addDays(today, 2)) },
    { label: "Stakeholder review complete", when: fmt(addDays(today, 5)) },
    { label: "Final sign-off", when: fmt(addDays(today, 9)) },
  ];
}

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export interface PlanBlock {
  time: string;
  task: string;
  type: "focus" | "meeting" | "break" | "admin";
}

export function mockPlan(tasks: string, priority: "High" | "Medium" | "Low"): PlanBlock[] {
  const safePriority: "High" | "Medium" | "Low" =
    priority === "High" || priority === "Medium" || priority === "Low" ? priority : "Medium";
  const raw = sanitize(tasks, 4000);
  const items = raw
    .split(/\n|,|;/)
    .map((t) => t.replace(/^[\s•\-–*\d.)]+/, "").trim())
    .filter(Boolean)
    .map((t) => (t.length > MAX_TASK_LEN ? t.slice(0, MAX_TASK_LEN - 1).trimEnd() + "…" : t))
    .slice(0, MAX_TASKS);
  if (items.length === 0) return [];

  const startHour = safePriority === "High" ? 8 : safePriority === "Medium" ? 9 : 10;
  const blocks: PlanBlock[] = [];
  let hour = startHour;

  blocks.push({ time: fmtHour(hour++), task: "Morning planning & inbox triage", type: "admin" });

  items.forEach((task, i) => {
    if (i > 0 && i % 2 === 0) {
      blocks.push({ time: fmtHour(hour++), task: "Short break — stretch & water", type: "break" });
    }
    const type: PlanBlock["type"] = /meet|call|sync|standup/i.test(task) ? "meeting" : "focus";
    blocks.push({ time: fmtHour(hour++), task, type });
  });

  blocks.push({ time: fmtHour(hour++), task: "Wrap-up & tomorrow's prep", type: "admin" });
  return blocks;
}

function fmtHour(h: number): string {
  const hour = h % 24;
  const ampm = hour < 12 ? "AM" : "PM";
  const display = hour % 12 === 0 ? 12 : hour % 12;
  return `${display}:00 ${ampm}`;
}

export function mockChat(prompt: string): string {
  const p = prompt.toLowerCase().trim();
  if (!p) return "Ask me anything about your work day.";
  if (/email|write|draft/.test(p))
    return "Try the Email Gen tab for a structured draft — pick a tone and I'll generate a starter email you can edit.";
  if (/summar|notes|meeting/.test(p))
    return "Paste your meeting notes into the Summarizer and I'll extract a summary, action items, and deadlines.";
  if (/plan|schedule|task|day/.test(p))
    return "Head to the Planner — list your tasks and I'll arrange them into an hourly schedule based on priority.";
  if (/research|article|topic|learn/.test(p))
    return "Drop a topic or URL into the Research Assistant — I'll return structured notes with key takeaways.";
  if (/hello|hi|hey/.test(p)) return "Hey! How can I help you stay productive today?";
  return `Here's a quick take on "${prompt}": break it into 2–3 concrete next steps, timebox the first one to 25 minutes, and revisit after a short break. (Always double-check anything important — I'm an AI.)`;
}

export interface ResearchResult {
  topic: string;
  sections: { heading: string; bullets: string[] }[];
  takeaways: string[];
  sources: { title: string; url: string }[];
}

export function mockResearch(query: string): ResearchResult {
  const q = sanitize(query, 300) || "the requested topic";
  const isUrl = /^https?:\/\//i.test(q);
  const topic = isUrl ? q.replace(/^https?:\/\//i, "").split("/")[0] : q;
  return {
    topic,
    sections: [
      {
        heading: "Overview",
        bullets: [
          `${topic} is a fast-moving area with active development across industry and academia.`,
          "Recent shifts emphasize practical deployment, measurable outcomes, and lower operating cost.",
          "Most credible coverage converges on a small set of patterns worth adopting early.",
        ],
      },
      {
        heading: "What's working",
        bullets: [
          "Teams that start small with clear success metrics ship within weeks, not quarters.",
          "Pairing automation with a human-in-the-loop reduces error rates without slowing throughput.",
          "Documentation and onboarding playbooks are the strongest predictors of long-term success.",
        ],
      },
      {
        heading: "Watch-outs",
        bullets: [
          "Vendor lock-in is the most common regret reported 12 months in.",
          "Hidden costs cluster around data prep, evaluation, and ongoing review.",
          "Compliance and privacy reviews should run in parallel, not after launch.",
        ],
      },
    ],
    takeaways: [
      `Pilot ${topic} on one workflow with a 4-week measurable goal.`,
      "Budget 30% of effort for evaluation and iteration after launch.",
      "Pick tools with open formats and clear data-export paths.",
      "Make a human review step part of the system, not an afterthought.",
    ],
    sources: [
      { title: `Primer on ${topic}`, url: "https://example.com/primer" },
      { title: `${topic}: 2026 landscape`, url: "https://example.com/landscape" },
      { title: `Field notes from early adopters`, url: "https://example.com/field-notes" },
    ],
  };
}