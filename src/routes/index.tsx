import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  AlertTriangle,
  Mail,
  FileText,
  CalendarClock,
  TrendingUp,
  Clock,
  CheckCircle2,
  Zap,
  X,
  Search,
  Circle,
} from "lucide-react";
import { Sparkline } from "@/components/sparkline";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — TRinko" },
      { name: "description", content: "TRinko is your AI workspace for emails, summaries, research, and planning." },
      { property: "og:title", content: "TRinko — AI Workspace" },
      { property: "og:description", content: "Your AI workspace for emails, summaries, research, and planning." },
    ],
  }),
  component: Index,
});

function Index() {
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  const stats = [
    { label: "Tasks saved today", value: "14", icon: CheckCircle2, hint: "+22% vs yesterday", spark: [3, 5, 4, 7, 6, 9, 8, 12, 14] },
    { label: "Emails generated", value: "37", icon: Mail, hint: "Across 4 tones", spark: [10, 12, 9, 15, 14, 18, 22, 30, 37] },
    { label: "Notes summarized", value: "9", icon: FileText, hint: "≈ 2.4 hrs saved", spark: [1, 2, 2, 4, 3, 5, 6, 8, 9] },
    { label: "Hours planned", value: "62", icon: Clock, hint: "This week", spark: [4, 8, 12, 18, 28, 38, 48, 56, 62] },
  ];

  const recentEmails = [
    { to: "Sarah Chen", subject: "Re: Q3 launch checklist", preview: "Confirming the dry-run on Thursday — happy to share my notes…", tone: "Friendly" },
    { to: "Investor update", subject: "August traction snapshot", preview: "Quick read on August: ARR up 14%, NPS held steady at 62…", tone: "Formal" },
  ];
  const todaySchedule = [
    { time: "9:00", task: "Deep work — Q3 roadmap draft", priority: "High" as const },
    { time: "11:30", task: "Sync with design on onboarding", priority: "High" as const },
    { time: "14:00", task: "Review summarized board notes", priority: "Medium" as const },
  ];
  const recentResearch = [
    { topic: "Agentic workflows in B2B", insight: "Pilot one workflow, measure for 4 weeks." },
    { topic: "Pricing usage-based AI", insight: "Hybrid seat + usage outperforms pure usage." },
    { topic: "Onboarding retention", insight: "Day-1 \"aha\" beats day-30 emails." },
  ];

  const priorityClass = (p: "High" | "Medium" | "Low") =>
    p === "High"
      ? "bg-rose-500/15 text-rose-700 ring-1 ring-rose-500/30 dark:text-rose-300"
      : p === "Medium"
        ? "bg-amber-500/15 text-amber-800 ring-1 ring-amber-500/30 dark:text-amber-200"
        : "bg-emerald-500/15 text-emerald-800 ring-1 ring-emerald-500/30 dark:text-emerald-200";

  return (
    <div className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <Zap className="h-3 w-3" /> Welcome back, Alex
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Your TRinko workspace</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A snapshot of today — drafts in flight, what's on your calendar, and what TRinko has been learning for you.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="group relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {s.label}
              </span>
              <div className="relative grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <div className="absolute inset-0 rounded-lg bg-primary/30 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100" />
                <s.icon className="relative h-4 w-4" />
              </div>
            </div>
            <div className="mt-3 flex items-end justify-between gap-2">
              <div className="text-3xl font-semibold tracking-tight">{s.value}</div>
              <Sparkline data={s.spark} className="h-6 w-20 text-primary" stroke="currentColor" />
            </div>
            <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <TrendingUp className="h-3 w-3" /> {s.hint}
            </div>
          </div>
        ))}
      </div>

      {/* Jump back in - real widgets */}
      <div>
        <h2 className="mb-4 text-lg font-semibold">Jump back in</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {/* Email Drafts */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Mail className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold">Email drafts</h3>
              </div>
              <Link to="/email" className="text-xs font-medium text-primary hover:underline">Open →</Link>
            </div>
            <ul className="space-y-3">
              {recentEmails.map((e, i) => (
                <li key={i} className="rounded-lg border border-border/60 bg-background p-3 transition-colors hover:border-primary/40">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-xs font-medium text-muted-foreground">To: {e.to}</div>
                    <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-foreground">{e.tone}</span>
                  </div>
                  <div className="mt-1 truncate text-sm font-semibold">{e.subject}</div>
                  <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">{e.preview}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Today's Schedule */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <CalendarClock className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold">Today's schedule</h3>
              </div>
              <Link to="/planner" className="text-xs font-medium text-primary hover:underline">Open →</Link>
            </div>
            <ul className="space-y-2">
              {todaySchedule.map((t, i) => (
                <li key={i} className="flex items-center gap-3 rounded-lg border border-border/60 bg-background p-3">
                  <div className="w-12 text-xs font-semibold tabular-nums text-muted-foreground">{t.time}</div>
                  <div className="h-8 w-px bg-border" />
                  <div className="flex-1 truncate text-sm">{t.task}</div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${priorityClass(t.priority)}`}>{t.priority}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Recent Research */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <Search className="h-4 w-4" />
                </div>
                <h3 className="text-sm font-semibold">Recent research</h3>
              </div>
              <Link to="/research" className="text-xs font-medium text-primary hover:underline">Open →</Link>
            </div>
            <ul className="space-y-2">
              {recentResearch.map((r, i) => (
                <li key={i} className="flex items-start gap-2 rounded-lg border border-border/60 bg-background p-3">
                  <Circle className="mt-1 h-2 w-2 flex-shrink-0 fill-primary text-primary" />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold">{r.topic}</div>
                    <div className="line-clamp-2 text-xs text-muted-foreground">{r.insight}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Responsible AI Disclaimer - dismissible banner moved below */}
      {showDisclaimer && (
        <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/40 p-4 text-sm shadow-sm">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="flex-1 leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Responsible AI.</span>{" "}
            Outputs are AI-generated and may be inaccurate. Review and fact-check before
            acting on them — especially for financial, legal, medical, or HR decisions.
          </div>
          <button
            onClick={() => setShowDisclaimer(false)}
            className="grid h-7 w-7 flex-shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            aria-label="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
