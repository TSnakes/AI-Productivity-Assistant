import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarClock, Sparkles, Loader2, Coffee, Users, Target, Inbox } from "lucide-react";
import { mockPlan, type PlanBlock } from "@/lib/mock-ai";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — AI Workplace" },
      { name: "description", content: "Generate a chronological hourly schedule from your task list." },
    ],
  }),
  component: PlannerPage,
});

type Priority = "High" | "Medium" | "Low";

const typeMeta: Record<PlanBlock["type"], { icon: typeof Coffee; label: string; classes: string }> = {
  focus: { icon: Target, label: "Focus", classes: "bg-primary/10 text-primary border-primary/30" },
  meeting: { icon: Users, label: "Meeting", classes: "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/40 dark:text-amber-100" },
  break: { icon: Coffee, label: "Break", classes: "bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-100" },
  admin: { icon: Inbox, label: "Admin", classes: "bg-muted text-muted-foreground border-border" },
};

function PlannerPage() {
  const [tasks, setTasks] = useState("");
  const [priority, setPriority] = useState<Priority>("High");
  const [plan, setPlan] = useState<PlanBlock[] | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tasks.trim()) {
      toast.error("List at least one task.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setPlan(mockPlan(tasks, priority));
      setLoading(false);
    }, 700);
  };

  return (
    <div className="space-y-8">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <CalendarClock className="h-3 w-3" /> Planner
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">AI Task Planner</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          List your tasks, choose a priority, and get an hourly schedule.
        </p>
      </header>

      <form onSubmit={submit} className="grid gap-6 rounded-xl border border-border bg-card p-6 shadow-sm md:grid-cols-[1fr_220px]">
        <div>
          <label className="text-sm font-medium">List your tasks for the day</label>
          <textarea
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            rows={6}
            placeholder={"One per line, e.g.\nDesign review with team\nWrite Q3 report\nReply to investor email\nGym"}
            className="mt-2 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Planning…" : "Build my day"}
          </button>
        </div>
      </form>

      {plan && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold">Your schedule</h2>
          <p className="text-xs text-muted-foreground">Built from {plan.length} blocks · priority: {priority}</p>

          <div className="mt-6 space-y-3">
            {plan.map((b, i) => {
              const meta = typeMeta[b.type];
              const Icon = meta.icon;
              return (
                <div
                  key={i}
                  className="flex items-stretch gap-4 rounded-lg border border-border bg-background p-4 transition-colors hover:bg-accent/30"
                >
                  <div className="w-20 flex-shrink-0 text-right">
                    <div className="text-sm font-semibold text-foreground">{b.time}</div>
                  </div>
                  <div className="w-px bg-border" />
                  <div className="flex flex-1 items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={cn("grid h-9 w-9 place-items-center rounded-lg border", meta.classes)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="text-sm font-medium">{b.task}</div>
                    </div>
                    <span className={cn("rounded-full border px-2 py-0.5 text-xs font-medium", meta.classes)}>
                      {meta.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}