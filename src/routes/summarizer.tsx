import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText, Sparkles, Loader2, CalendarDays } from "lucide-react";
import { mockSummarize, type SummaryResult } from "@/lib/mock-ai";
import { toast } from "sonner";

export const Route = createFileRoute("/summarizer")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — AI Workplace" },
      { name: "description", content: "Turn raw meeting notes into a summary, action items, and deadlines." },
    ],
  }),
  component: SummarizerPage,
});

function SummarizerPage() {
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<SummaryResult | null>(null);
  const [done, setDone] = useState<Record<number, boolean>>({});
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      toast.error("Paste some meeting notes to summarize.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setResult(mockSummarize(notes));
      setDone({});
      setLoading(false);
    }, 800);
  };

  return (
    <div className="space-y-8">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <FileText className="h-3 w-3" /> Summarizer
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Meeting Notes Summarizer</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste raw notes — get an executive summary, action items, and deadlines.
        </p>
      </header>

      <form onSubmit={submit} className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <label className="text-sm font-medium">Raw meeting notes</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={10}
          placeholder="Paste the meeting transcript or your scribbled notes here…"
          className="mt-2 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-ring"
        />
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Summarizing…" : "Summarize notes"}
          </button>
        </div>
      </form>

      {result && (
        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-border bg-card p-6 shadow-sm lg:col-span-2">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">Executive Summary</h2>
            <p className="mt-3 text-base leading-relaxed text-foreground">{result.summary}</p>
          </section>

          <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">Action Items</h2>
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
            </ul>
          </section>

          <section className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-primary">Deadlines</h2>
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