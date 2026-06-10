// Lightweight deterministic mock "AI" so the app feels responsive without a backend.

export function mockEmail(topic: string, tone: "Formal" | "Friendly" | "Persuasive"): string {
  const t = topic.trim() || "our upcoming project update";
  const greeting =
    tone === "Formal" ? "Dear Team," : tone === "Friendly" ? "Hi team," : "Team —";
  const closing =
    tone === "Formal"
      ? "Kind regards,\n[Your Name]"
      : tone === "Friendly"
        ? "Thanks so much,\n[Your Name]"
        : "Looking forward to your response,\n[Your Name]";

  const body: Record<typeof tone, string> = {
    Formal: `I hope this message finds you well. I am writing to provide an update regarding ${t}. Please review the points below and let me know if you have any questions or require further clarification.\n\n• Context and current status\n• Key milestones and owners\n• Next steps and decisions required\n\nYour timely input would be greatly appreciated.`,
    Friendly: `Quick note about ${t} — wanted to keep everyone in the loop!\n\nHere's where we are:\n• What's done\n• What's in progress\n• What I need from you\n\nLet me know if anything looks off or you'd like to chat through it. 🙌`,
    Persuasive: `I want to share something important about ${t} — and why acting on it this week matters.\n\nWhy now:\n• Momentum is on our side\n• A short delay creates outsized downstream cost\n• A small commitment unlocks a meaningful win\n\nIf you can confirm by Friday, we can move forward immediately and keep this on track.`,
  };

  return `Subject: Update — ${t}\n\n${greeting}\n\n${body[tone]}\n\n${closing}`;
}

export interface SummaryResult {
  summary: string;
  actions: string[];
  deadlines: { label: string; when: string }[];
}

export function mockSummarize(notes: string): SummaryResult {
  const text = notes.trim();
  if (!text) {
    return { summary: "No notes provided.", actions: [], deadlines: [] };
  }
  const sentences = text
    .split(/[.!?\n]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const summary =
    sentences.slice(0, 2).join(". ") +
    (sentences.length > 2 ? `. The team aligned on next steps and ownership for ${sentences.length} discussion points.` : ".");

  const verbs = ["Follow up on", "Draft", "Review", "Schedule", "Share", "Confirm"];
  const actions = sentences.slice(0, Math.min(5, sentences.length)).map((s, i) => {
    const trimmed = s.length > 80 ? s.slice(0, 80) + "…" : s;
    return `${verbs[i % verbs.length]} ${trimmed}`;
  });

  const today = new Date();
  const fmt = (d: Date) =>
    d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
  const deadlines = [
    { label: "Initial draft circulated", when: fmt(addDays(today, 2)) },
    { label: "Stakeholder review complete", when: fmt(addDays(today, 5)) },
    { label: "Final sign-off", when: fmt(addDays(today, 9)) },
  ];

  return { summary, actions, deadlines };
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
  const items = tasks
    .split(/\n|,/)
    .map((t) => t.trim())
    .filter(Boolean);
  if (items.length === 0) return [];

  const startHour = priority === "High" ? 8 : priority === "Medium" ? 9 : 10;
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
  if (/hello|hi|hey/.test(p)) return "Hey! How can I help you stay productive today?";
  return `Here's a quick take on "${prompt}": break it into 2–3 concrete next steps, timebox the first one to 25 minutes, and revisit after a short break. (Always double-check anything important — I'm an AI.)`;
}