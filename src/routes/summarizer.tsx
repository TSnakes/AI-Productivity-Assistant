import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { FileText, Sparkles, Loader2, CalendarDays, ArrowRight } from "lucide-react";
import { mockSummarize, type SummaryResult } from "@/lib/mock-ai";
import { setPlannerSeed, getDraft, setDraft } from "@/lib/shared-store";
import { toast } from "sonner";

export const Route = createFileRoute("/summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — TRinko" },
      { name: "description", content: "Turn raw meeting notes into a summary, action items, and deadlines." },
    ],
  }),
  component: SummarizerPage,
});

function SummarizerPage() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState<string>(() => getDraft("summarizer.notes", ""));
  const [result, setResult] = useState<SummaryResult | null>(() =>
    getDraft<SummaryResult | null>("summarizer.result", null),
  );
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => setDraft("summarizer.notes", notes), [notes]);
  useEffect(() => setDraft("summarizer.result", result), [result]);

  const run = (text: string) => {
    setLoading(true);
    setTimeout(() => {
      try {
        setResult(mockSummarize(text));
        setDone({});
      } catch {
        toast.error("We couldn't summarize that just now.", {
          action: { label: "Try again", onClick: () => run(text) },
        });
      } finally {
        setLoading(false);
      }
    }, 800);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = notes.trim();
    if (!trimmed) {
      toast.error("Paste a transcript or bullet notes to summarize.");
      return;
    }
    if (trimmed.length < 50) {
      toast.message("Notes too short", {
        description:
          "To provide an accurate summary, please paste at least a paragraph of notes or a short transcript.",
      });
      return;
    }
    run(trimmed);
  };

  const convertToTasks = () => {
    if (!result || result.actions.length === 0) return;
    setPlannerSeed(result.actions.join("\n"));
    toast.success("Action items sent to Planner");
    navigate({ to: "/planner" });
  };

  return (
    <div className="space-y-8">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <FileText className="h-3 w-3" /> Summarizer
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Meeting Notes Summarizer</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste a transcript or rough notes. TRinko returns a tight summary, owned action items, and the dates you can't miss.
        </p>
      </header>

      <form onSubmit={submit} className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <label className="text-sm font-medium">Raw meeting notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={10}
          placeholder={"Tip: include names where you can — TRinko will route action items by owner.\n\ne.g.\nSarah walked us through the Q3 plan…\nDecision: ship beta to 50 customers by Sept 14\nMaya to follow up with legal on DPA template"}
          className="mt-2 w-full resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-ring"
        />
        <p className="mt-2 text-xs text-muted-foreground">
          {notes.trim().length}/50 characters minimum for an accurate summary.
        </p>
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/30 hover:opacity-90 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Summarizing…" : "Summarize notes"}
          </button>
        </div>
      </form>

      {loading && !result && (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
            <div className="space-y-2">
              <div className="h-4 w-32 animate-pulse rounded bg-muted" />
              <div className="h-3 w-full animate-pulse rounded bg-muted" />
              <div className="h-3 w-11/12 animate-pulse rounded bg-muted" />
              <div className="h-3 w-9/12 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">Executive Summary</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground">{result.summary}</p>
          </section>

          <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">Action Items</h2>
              <button
                onClick={convertToTasks}
                disabled={result.actions.length === 0}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-2.5 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 disabled:opacity-50"
              >
                Convert to tasks <ArrowRight className="h-3 w-3" />
              </button>
            </div>
            <ul className="mt-4 space-y-3">
              {result.actions.map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={!!done[i]}
                    onChange={(e) => setDone((d) => ({ ...d, [i]: e.target.checked }))}
                    className="mt-1 h-4 w-4 cursor-pointer accent-primary"
                  />
                  <span className={done[i] ? "text-sm text-muted-foreground line-through" : "text-sm"}>
                    {a}
                  </span>
                </li>
              ))}
              {result.actions.length === 0 && (
                <li className="text-sm text-muted-foreground">No action items detected.</li>
              )}
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">Decisions / Deadlines</h2>
            <ul className="mt-4 space-y-3">
              {result.deadlines.map((d, i) => (
                <li key={i} className="flex items-center justify-between rounded-lg bg-muted px-3 py-2.5">
                  <span className="flex items-center gap-2 text-sm">
                    <CalendarDays className="h-4 w-4 text-primary" /> {d.label}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">{d.when}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </div>
  );
}