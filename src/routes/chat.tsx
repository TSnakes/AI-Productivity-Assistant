import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, MessagesSquare } from "lucide-react";
import { mockChat } from "@/lib/mock-ai";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Chatbot — TRinko" },
      { name: "description", content: "Full-screen AI workspace chat — drafts, plans, summaries, research." },
    ],
  }),
  component: ChatPage,
});

interface Msg {
  role: "user" | "assistant";
  text: string;
}

const SUGGESTIONS = [
  "Draft a weekly progress report outline",
  "Summarize standard corporate email etiquette",
  "Create a 45-minute meeting agenda template",
  "How do I securely handle sensitive workplace data?",
];

function ChatPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      text: "Hi, I'm TRinko. Ask me to draft, summarize, research, or plan — or pick one of the suggestions below.",
    },
  ]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, pending]);

  const send = (override?: string) => {
    const text = (override ?? input).trim();
    if (!text || pending) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setPending(true);
    setTimeout(() => {
      setMsgs((m) => [...m, { role: "assistant", text: mockChat(text) }]);
      setPending(false);
    }, 600);
  };

  return (
    <div className="flex h-[calc(100vh-7rem)] flex-col gap-4 md:h-[calc(100vh-5rem)]">
      <header>
        <div className="inline-flex items-center gap-2 rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          <MessagesSquare className="h-3 w-3" /> Chatbot
        </div>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">TRinko Chat</h1>
      </header>

      <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex-1 space-y-4 overflow-y-auto p-6">
          {msgs.map((m, i) => (
            <div key={i} className={cn("flex gap-3", m.role === "user" ? "justify-end" : "justify-start")}>
              {m.role === "assistant" && (
                <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg bg-gradient-to-br from-primary to-[oklch(0.60_0.20_290)] text-primary-foreground shadow">
                  <Sparkles className="h-4 w-4" />
                </div>
              )}
              <div
                className={cn(
                  "max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
                  m.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground",
                )}
              >
                {m.text}
              </div>
            </div>
          ))}
          {pending && (
            <div className="flex gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-[oklch(0.60_0.20_290)] text-primary-foreground shadow">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="rounded-2xl bg-muted px-4 py-3">
                <div className="flex gap-1">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" />
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        <div className="border-t border-border bg-background/50 p-3">
          <div className="mb-2 flex flex-wrap gap-1.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:bg-accent hover:text-accent-foreground"
              >
                {s}
              </button>
            ))}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send();
            }}
            className="flex items-center gap-2 rounded-xl border border-input bg-background p-1.5 shadow-sm focus-within:ring-2 focus-within:ring-ring"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Message TRinko… (e.g. ‘Draft a friendly follow-up to Sarah about the design review’)"
              className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}