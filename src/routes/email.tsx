import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Mail, Copy, Sparkles, Loader2, RefreshCw, Bold, Italic, List, Link2 } from "lucide-react";
import { mockEmail, type EmailTone } from "@/lib/mock-ai";
import { takeEmailSeed } from "@/lib/shared-store";
import { toast } from "sonner";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — TRinko" },
      { name: "description", content: "Generate on-brand emails in formal, friendly, persuasive, or direct tones." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [recipient, setRecipient] = useState("");
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<EmailTone>("Formal");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const seed = takeEmailSeed();
    if (seed) {
      setTopic(seed.topic);
      if (seed.recipient) setRecipient(seed.recipient);
      toast.success("Loaded from Research — review and generate.");
    }
  }, []);

  const run = (current: { topic: string; tone: EmailTone; recipient: string }) => {
    setLoading(true);
    setTimeout(() => {
      setOutput(mockEmail(current.topic, current.tone, current.recipient));
      setLoading(false);
    }, 700);
  };

  const generate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error("Add the key points first — TRinko works best with 2-3 bullet ideas.");
      return;
    }
    run({ topic, tone, recipient });
  };

  const regenerate = () => {
    if (!topic.trim()) return;
    run({ topic, tone, recipient });
    toast.info("Regenerating draft…");
  };

  const copy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    toast.success("Draft copied to clipboard");
  };

  return (
    <div className="space-y-8">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <Mail className="h-3 w-3" /> Email Generator
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">Smart Email Generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell TRinko who it's for and what to say. Pick a tone — get a polished starter draft.
        </p>
      </header>

      <form onSubmit={generate} className="grid gap-6 rounded-xl border border-border bg-card p-6 shadow-sm md:grid-cols-[1fr_240px]">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Recipient context</label>
            <input
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Sarah, Head of Design at Northwind — busy, prefers brevity"
              className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Key points</label>
          <textarea
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            rows={6}
            placeholder={"Strong prompt = clear ask + context + outcome.\n\ne.g.\n• Reschedule Thursday's product review to next Tuesday\n• Need updated mockups by Monday EOD\n• Mention we'll share user testing notes ahead of time"}
            className="mt-2 w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm font-medium">Tone</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value as EmailTone)}
              className="mt-2 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              <option>Formal</option>
              <option>Friendly</option>
              <option>Persuasive</option>
              <option>Direct</option>
            </select>
            <p className="mt-2 text-xs text-muted-foreground">
              {tone === "Formal" && "Buttoned-up — execs, external partners."}
              {tone === "Friendly" && "Warm and informal — teammates."}
              {tone === "Persuasive" && "Drives a decision — urgency + value."}
              {tone === "Direct" && "No fluff — clear ask, fast read."}
            </p>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="mt-auto inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-[oklch(0.55_0.18_280)] px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-md shadow-primary/30 transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Drafting…" : "Generate draft"}
          </button>
        </div>
      </form>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Draft</h2>
            <p className="text-xs text-muted-foreground">Edit freely before sending.</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={regenerate}
              disabled={!output || loading}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Regenerate
            </button>
            <button
              onClick={copy}
              disabled={!output}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium hover:bg-accent disabled:opacity-50"
            >
              <Copy className="h-4 w-4" /> Copy
            </button>
          </div>
        </div>

        {/* Faux rich-text editor frame */}
        <div className="mt-4 overflow-hidden rounded-lg border border-input">
          <div className="flex items-center gap-1 border-b border-border bg-muted/50 px-3 py-1.5 text-muted-foreground">
            <button type="button" className="grid h-7 w-7 place-items-center rounded hover:bg-accent" aria-label="Bold"><Bold className="h-3.5 w-3.5" /></button>
            <button type="button" className="grid h-7 w-7 place-items-center rounded hover:bg-accent" aria-label="Italic"><Italic className="h-3.5 w-3.5" /></button>
            <button type="button" className="grid h-7 w-7 place-items-center rounded hover:bg-accent" aria-label="List"><List className="h-3.5 w-3.5" /></button>
            <button type="button" className="grid h-7 w-7 place-items-center rounded hover:bg-accent" aria-label="Link"><Link2 className="h-3.5 w-3.5" /></button>
            <div className="ml-auto text-[11px] uppercase tracking-wider">{tone}</div>
          </div>
          {loading && !output ? (
            <div className="space-y-3 p-5">
              <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
              <div className="h-3 w-full animate-pulse rounded bg-muted" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
              <div className="h-3 w-4/6 animate-pulse rounded bg-muted" />
              <div className="h-3 w-3/6 animate-pulse rounded bg-muted" />
            </div>
          ) : (
            <textarea
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              rows={16}
              placeholder="Your generated email will appear here — then edit it like a doc."
              className="block w-full resize-none border-0 bg-background px-5 py-4 text-sm leading-relaxed outline-none"
            />
          )}
        </div>
      </div>
    </div>
  );
}