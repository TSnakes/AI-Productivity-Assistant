import { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { signIn } from "@/lib/user-store";
import { toast } from "sonner";

type PlanId = "standard" | "pro";

const plans: Array<{
  id: PlanId;
  name: string;
  price: string;
  blurb: string;
  features: string[];
  popular?: boolean;
}> = [
  {
    id: "standard",
    name: "Standard",
    price: "$15",
    blurb: "Everyday productivity essentials.",
    features: ["Email Generator", "Meeting Summarizer", "Daily Planner"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$35",
    blurb: "Everything, with priority AI speeds.",
    features: [
      "All Standard features",
      "Research Assistant + Chatbot",
      "Cross-feature integrations",
      "Priority AI response speeds",
    ],
    popular: true,
  },
];

export function AccountModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [plan, setPlan] = useState<PlanId>("pro");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !trimmed.includes("@")) {
      toast.error("Enter a valid email address.");
      return;
    }
    if (password.length < 4) {
      toast.error("Password must be at least 4 characters.");
      return;
    }
    signIn(trimmed, plan);
    toast.success(`Welcome to TRinko ${plan === "pro" ? "Pro" : "Standard"}`);
    setEmail("");
    setPassword("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl border-white/10 bg-card p-0 sm:rounded-2xl">
        <div className="space-y-6 p-6 md:p-8">
          <DialogHeader>
            <div className="mb-2 inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
              <Sparkles className="h-3 w-3" /> Unlock TRinko
            </div>
            <DialogTitle className="text-2xl tracking-tight">Choose a plan</DialogTitle>
            <DialogDescription>
              Pick the workspace that fits, then sign in to start.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            {plans.map((p) => {
              const selected = plan === p.id;
              return (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => setPlan(p.id)}
                  className={cn(
                    "group relative rounded-2xl border bg-background/40 p-5 text-left transition-all",
                    selected
                      ? "border-primary shadow-lg shadow-primary/20 ring-1 ring-primary/40"
                      : "border-white/10 hover:border-white/25",
                  )}
                >
                  {p.popular && (
                    <span className="absolute -top-2.5 right-4 rounded-full border border-primary/40 bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground shadow">
                      Most Popular
                    </span>
                  )}
                  <div className="flex items-baseline justify-between">
                    <div className="text-base font-semibold">{p.name}</div>
                    <div className="text-right">
                      <span className="text-2xl font-bold tracking-tight">{p.price}</span>
                      <span className="text-xs text-muted-foreground">/mo</span>
                    </div>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{p.blurb}</p>
                  <ul className="mt-4 space-y-1.5">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-foreground/85">
                        <Check
                          className={cn(
                            "h-3.5 w-3.5 flex-shrink-0",
                            selected ? "text-primary" : "text-muted-foreground",
                          )}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              );
            })}
          </div>

          <form onSubmit={submit} className="space-y-3">
            <div className="grid gap-3 md:grid-cols-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                className="w-full rounded-lg border border-white/10 bg-background/60 px-4 py-3 text-sm placeholder:text-muted-foreground/70 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoComplete="current-password"
                className="w-full rounded-lg border border-white/10 bg-background/60 px-4 py-3 text-sm placeholder:text-muted-foreground/70 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <Button
              type="submit"
              className="h-11 w-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:bg-primary/90"
            >
              Sign In / Start {plan === "pro" ? "Pro" : "Standard"} Plan
            </Button>
            <p className="text-center text-[11px] text-muted-foreground">
              Mock authentication for demo purposes. No payment is taken.
            </p>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}