import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Sparkles, Loader2, Mail, Bookmark, ExternalLink } from "lucide-react";
import { mockResearch, type ResearchResult } from "@/lib/mock-ai";
import { setEmailSeed } from "@/lib/shared-store";
import { toast } from "sonner";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — TRinko" },
      { name: "description", content: "Topic or URL in, structured notes with key takeaways out." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast.error("Enter a topic or paste an article URL.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setResult(mockResearch(query));
      setLoading(false);
    }, 900);
  };

  const shareViaEmail = () => {
    if (!result) return;
    const body = [
      `Quick research summary on: ${result.topic}`,
      "",
      "Key takeaways:",
      ...result.takeaways.map((t) => `• ${t}`),
    ].join("\n");
    setEmailSeed(body);
    toast.success("Research sent to Email Generator");
    navigate({ to: "/email" });
  };

  return (
    <div className="space-y-8">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <Search className="h-3 w-3" /> Research
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">AI Research Assistant</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drop a topic or URL — TRinko returns structured notes with sources and the takeaways that matter.
        </p>
      </header>

      <form onSubmit={submit} className="rounded-xl border border-border bg-card p-3 shadow-sm">
        <div className="flex items-center gap-2">
          <Search className="ml-3 h-4 w-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Topic or URL — e.g. ‘usage-based pricing for AI startups’ or https://…"
            className="flex-1 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-primary to-[oklch(0.55_0.18_280)] px-4 py-2 text-sm font-medium text-primary-foreground shadow-md shadow-primary/30 hover:opacity-90 disabled:opacity-60"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {loading ? "Researching…" : "Research"}
          </button>
        </div>
      </form>

      {loading && !result && (
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            {[0, 1, 2].map((i) => (
              <div key={i} className="space-y-2">
                <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-full animate-pulse rounded bg-muted" />
                <div className="h-3 w-11/12 animate-pulse rounded bg-muted" />
                <div className="h-3 w-9/12 animate-pulse rounded bg-muted" />
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
            <div className="mt-4 space-y-2">
              <div className="h-3 w-full animate-pulse rounded bg-muted" />
              <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
              <div className="h-3 w-4/6 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      )}

      {result && (
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <article className="space-y-6 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">Research brief</div>
                <h2 className="text-2xl font-semibold tracking-tight">{result.topic}</h2>
              </div>
              <button
                onClick={shareViaEmail}
                className="inline-flex items-center gap-1.5 rounded-lg border border-primary/30 bg-primary/5 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10"
              >
                <Mail className="h-3.5 w-3.5" /> Share via email
              </button>
            </div>

            {result.sections.map((s) => (
              <section key={s.heading}>
                <h3 className="text-base font-semibold tracking-tight">{s.heading}</h3>
                <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-foreground">
                  {s.bullets.map((b, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-primary" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            <section>
              <h3 className="text-base font-semibold tracking-tight">Sources</h3>
              <ul className="mt-2 space-y-1.5 text-sm">
                {result.sources.map((s, i) => (
                  <li key={i}>
                    <a href={s.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-primary hover:underline">
                      {s.title} <ExternalLink className="h-3 w-3" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </article>

          <aside className="h-fit rounded-xl border border-primary/30 bg-gradient-to-br from-primary/5 to-transparent p-6 shadow-sm lg:sticky lg:top-6">
            <div className="flex items-center gap-2">
              <Bookmark className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">Key Takeaways</h3>
            </div>
            <ol className="mt-4 space-y-3 text-sm">
              {result.takeaways.map((t, i) => (
                <li key={i} className="flex gap-3">
                  <span className="grid h-5 w-5 flex-shrink-0 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{t}</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      )}
    </div>
  );
}