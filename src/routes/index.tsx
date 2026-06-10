import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, Mail, FileText, CalendarClock, TrendingUp, Clock, CheckCircle2, Zap } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      { name: "description", content: "Your AI-powered workspace for emails, summaries, and planning." },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      { property: "og:description", content: "Your AI-powered workspace for emails, summaries, and planning." },
    ],
  }),
  component: Index,
});

function Index() {
  const stats = [
    { label: "Tasks saved today", value: "14", icon: CheckCircle2, hint: "+22% vs yesterday" },
    { label: "Emails generated", value: "37", icon: Mail, hint: "Across 4 tones" },
    { label: "Notes summarized", value: "9", icon: FileText, hint: "≈ 2.4 hrs saved" },
    { label: "Hours planned", value: "62", icon: Clock, hint: "This week" },
  ];

  const tools = [
    { to: "/email", label: "Smart Email Generator", desc: "Draft on-brand emails in any tone.", icon: Mail },
    { to: "/summarizer", label: "Meeting Notes Summarizer", desc: "Turn raw notes into action items.", icon: FileText },
    { to: "/planner", label: "AI Task Planner", desc: "Build an hourly schedule from your task list.", icon: CalendarClock },
  ] as const;

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <Zap className="h-3 w-3" /> Good to see you back
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A snapshot of your AI-assisted productivity today.
        </p>
      </div>

      {/* Responsible AI Disclaimer */}
      <div className="flex gap-3 rounded-xl border border-amber-300/60 bg-amber-50 p-4 text-amber-900 shadow-sm dark:bg-amber-950/40 dark:text-amber-100">
        <AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
        <div className="text-sm leading-relaxed">
          <div className="font-semibold">Responsible AI Disclaimer</div>
          Outputs from this assistant are AI-generated and may be inaccurate or out of date. Always
          review, fact-check, and edit before sending, sharing, or acting on them — especially for
          financial, legal, medical, or HR decisions.
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {s.label}
              </span>
              <s.icon className="h-4 w-4 text-primary" />
            </div>
            <div className="mt-3 text-3xl font-semibold tracking-tight">{s.value}</div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" /> {s.hint}
            </div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-lg font-semibold">Jump back in</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {tools.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
            >
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <t.icon className="h-5 w-5" />
              </div>
              <div className="mt-4 font-semibold">{t.label}</div>
              <div className="mt-1 text-sm text-muted-foreground">{t.desc}</div>
              <div className="mt-4 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Open →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
