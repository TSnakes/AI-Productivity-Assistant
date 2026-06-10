import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Mail,
  FileText,
  CalendarClock,
  Sparkles,
  Menu,
  X,
  Search,
  MessagesSquare,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChatWidget } from "@/components/chat-widget";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/email", label: "Email Gen", icon: Mail },
  { to: "/summarizer", label: "Summarizer", icon: FileText },
  { to: "/planner", label: "Planner", icon: CalendarClock },
  { to: "/research", label: "Research", icon: Search },
  { to: "/chat", label: "Chatbot", icon: MessagesSquare },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-card/80 px-4 backdrop-blur-md md:hidden">
        <div className="flex items-center gap-2">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-[oklch(0.65_0.18_280)] text-primary-foreground shadow-md shadow-primary/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <span className="text-sm font-semibold tracking-tight">TRinko</span>
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="grid h-9 w-9 place-items-center rounded-md border border-border"
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-sidebar text-sidebar-foreground shadow-2xl transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0",
          open ? "translate-x-0 pt-14" : "-translate-x-full md:pt-0",
        )}
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 0%, oklch(0.30 0.08 270 / 0.6), transparent 60%), radial-gradient(circle at 100% 100%, oklch(0.25 0.10 280 / 0.4), transparent 50%)",
        }}
      >
        <div className="hidden items-center gap-3 px-6 py-6 md:flex">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-sidebar-primary to-[oklch(0.70_0.20_295)] text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/40 ring-1 ring-white/10">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="text-base font-semibold leading-tight tracking-tight">TRinko</div>
            <div className="text-[11px] uppercase tracking-[0.18em] opacity-60">AI Workspace</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const active = pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className={cn(
                  "group relative flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-gradient-to-r from-sidebar-primary/90 to-[oklch(0.62_0.18_285)]/90 text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/30"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className={cn("h-4 w-4 transition-transform group-hover:scale-110", active && "scale-105")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User profile */}
        <div className="mx-3 mb-4 rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-gradient-to-br from-[oklch(0.65_0.18_15)] to-[oklch(0.55_0.20_295)] text-sm font-semibold text-white shadow-md">
              AM
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-medium text-sidebar-foreground">Alex Morgan</div>
              <div className="truncate text-[11px] text-sidebar-foreground/60">Pro plan · alex@trinko.ai</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <main className="flex-1 pt-14 md:pt-0">
        <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8 md:py-10">
          {children}
        </div>
      </main>

      <ChatWidget />
    </div>
  );
}