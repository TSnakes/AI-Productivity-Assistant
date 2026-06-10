import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Copy, Sparkles, Loader2 } from "lucide-react";
import { mockEmail } from "@/lib/mock-ai";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — AI Workplace" },
      { name: "description", content: "Generate on-brand emails in formal, friendly, or persuasive tones." },
    ],
  }),
  component: EmailPage,
});

type Tone = "Formal" | "Friendly" | "Persuasive";

function EmailPage() {
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<Tone>("Formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error("Please add a topic or key points first.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setOutput(mockEmail(topic, tone));
      setLoading(false);
    }, 700);
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success("Email copied to clipboard");
  };

  return (
    <div className="space-y-8">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <Mail className="h-3 w-3" /> Email Generator
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Smart Email Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe what you want to say — we'll draft a starter email you can edit.
        </p>
      </header>

      <form onSubmit={generate} className="grid gap-6 rounded-xl border border-border bg-card p-6 shadow-sm md:grid-cols-[1fr_220px]">
        <div>
          <label className="text-sm font-medium">Topic / Key points</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={5}
            placeholder="e.g. Reschedule Thursday's product review to next Tuesday; ask for updated mockups by Monday EOD."
            className="mt-2 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as Tone)}
              className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option>Formal</option>
              <option>Friendly</option>
              <option>Persuasive</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Generating…" : "Generate email"}
          </button>
        </div>
      </form>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Draft</h2>
            <p className="text-xs text-muted-foreground">Edit freely before sending.</p>
          </div>
          <button
            onClick={copy}
            disabled={!output}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
          >
            <Copy className="h-4 w-4" /> Copy
          </button>
        </div>
        <textarea
          value={output}
          onChange={(e) => setOutput(e.target.value)}
          rows={16}
          placeholder="Your generated email will appear here…"
          className="mt-4 w-full resize-none rounded-lg border border-input bg-background px-4 py-3 font-mono text-sm leading-relaxed outline-none focus:ring-2 focus:ring-ring"
        />
      </div>
    </div>
  );
}