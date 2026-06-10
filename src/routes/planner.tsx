import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CalendarClock, Sparkles, Loader2, Coffee, Users, Target, Inbox } from "lucide-react";
import { mockPlan, type PlanBlock } from "@/lib/mock-ai";
import { takePlannerSeed } from "@/lib/shared-store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — TRinko" },
      { name: "description", content: "Generate a chronological hourly schedule from your task list." },
    ],
  }),
  component: PlannerPage,
});

type Priority = "High" | "Medium" | "Low";
type View = "Day" | "Week";

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
  const [view, setView] = useState<View>("Day");
  const [completed, setCompleted] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const seed = takePlannerSeed();
    if (seed) {
      setTasks(seed);
      toast.success("Loaded from Summarizer — tap Build my day.");
    }
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tasks.trim()) {
      toast.error("List at least one task.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setPlan(mockPlan(tasks, priority));
      setCompleted({});
      setLoading(false);
    }, 700);
  };

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

  return (
    <div className="space-y-8">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <CalendarClock className="h-3 w-3" /> Planner
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">AI Task Planner</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          List today's tasks, pick a priority, and TRinko lays out an hour-by-hour plan you can check off.
        </p>
      </header>

      <form onSubmit={submit} className="grid gap-6 rounded-xl border border-border bg-card p-6 shadow-sm md:grid-cols-[1fr_220px]">
        <div>
          <label className="text-sm font-medium">List your tasks for the day</label>
          <textarea
            value={tasks}
            onChange={(e) => setTasks(e.target.value)}
            rows={6}
            placeholder={"One per line — TRinko spots meetings vs focus work automatically.\n\ne.g.\nDesign review with team\nWrite Q3 report\nReply to investor email\nGym"}
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
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-[oklch(0.55_0.18_280)] px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md shadow-primary/30 hover:opacity-90 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Planning…" : "Build my day"}
          </button>
        </div>
      </form>

      {loading && !plan && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="space-y-3">
            {[0,1,2,3,4].map(i => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-4 w-16 animate-pulse rounded bg-muted" />
                <div className="h-12 flex-1 animate-pulse rounded-lg bg-muted" />
              </div>
            ))}
          </div>
        </div>
      )}

      {plan && (
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Your schedule</h2>
              <p className="text-xs text-muted-foreground">
                {plan.length} blocks · priority: <span className="font-medium text-foreground">{priority}</span>
              </p>
            </div>
            <div className="inline-flex rounded-lg border border-border bg-muted/40 p-0.5">
              {(["Day", "Week"] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn(
                    "rounded-md px-3 py-1 text-xs font-medium transition-colors",
                    view === v ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {view === "Day" ? (
            <div className="mt-6 space-y-2">
              {plan.map((b, i) => {
                const meta = typeMeta[b.type];
                const Icon = meta.icon;
                const isDone = !!completed[i];
                return (
                  <div
                    key={i}
                    className={cn(
                      "flex items-stretch gap-4 rounded-lg border border-border bg-background p-3.5 transition-all hover:-translate-y-px hover:border-primary/40 hover:shadow-sm",
                      isDone && "opacity-60",
                    )}
                  >
                    <div className="flex w-20 flex-shrink-0 items-center justify-end">
                      <div className="text-sm font-semibold tabular-nums text-foreground">{b.time}</div>
                    </div>
                    <div className="w-px bg-border" />
                    <div className="flex flex-1 items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isDone}
                        onChange={(e) => setCompleted((c) => ({ ...c, [i]: e.target.checked }))}
                        className="h-4 w-4 cursor-pointer accent-primary"
                      />
                      <div className={cn("grid h-9 w-9 place-items-center rounded-lg border", meta.classes)}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className={cn("flex-1 text-sm font-medium", isDone && "line-through")}>{b.task}</div>
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide", meta.classes)}>
                        {meta.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-5 gap-2">
              {weekDays.map((day, di) => (
                <div key={day} className="rounded-lg border border-border bg-background p-3">
                  <div className="mb-2 flex items-center justify-between">
                    <div className="text-sm font-semibold">{day}</div>
                    {di === 0 && <div className="rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-medium text-primary-foreground">TODAY</div>}
                  </div>
                  <div className="space-y-1.5">
                    {plan.slice(0, 3 + di).map((b, i) => {
                      const meta = typeMeta[b.type];
                      return (
                        <div key={i} className={cn("rounded border px-2 py-1.5 text-[11px] leading-tight", meta.classes)}>
                          <div className="font-semibold tabular-nums opacity-80">{b.time}</div>
                          <div className="truncate font-medium">{b.task}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}