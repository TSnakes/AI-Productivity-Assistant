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
  User as UserIcon,
  LogOut,
  Crown,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChatWidget } from "@/components/chat-widget";
import { AccountModal } from "@/components/account-modal";
import { useUser, signOut } from "@/lib/user-store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

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
  const [accountOpen, setAccountOpen] = useState(false);
  const user = useUser();
  const isGuest = !user.email;
  const initial = user.email ? user.email.trim()[0]?.toUpperCase() ?? "U" : "";
  const tierLabel = user.tier === "pro" ? "PRO" : user.tier === "standard" ? "STANDARD" : "";

  const handleLogout = () => {
    signOut();
    toast.success("Signed out — back to Guest tier");
  };

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
            "radial-gradient(circle at 20% 0%, oklch(0.696 0.165 162 / 0.18), transparent 60%), radial-gradient(circle at 100% 100%, oklch(0.30 0.06 256 / 0.6), transparent 55%)",
        }}
      >
        <div className="hidden items-center gap-3 px-6 py-6 md:flex">
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-1 ring-white/10">
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
                  "group relative flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/30"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )}
              >
                <Icon className={cn("h-4 w-4 flex-shrink-0 transition-transform group-hover:scale-110", active && "scale-105")} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Upgrade CTA (guests only) */}
        {isGuest && user.tier !== "pro" && (
          <button
            onClick={() => setAccountOpen(true)}
            className="mx-3 mb-2 flex items-center justify-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition-all hover:bg-primary/20"
          >
            <Crown className="h-3.5 w-3.5" />
            Upgrade
          </button>
        )}

        {/* User profile button */}
        <div className="mx-3 mb-4">
          {isGuest ? (
            <button
              onClick={() => setAccountOpen(true)}
              className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-left backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10"
            >
              <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-slate-700/80 text-slate-300 ring-1 ring-white/10">
                <UserIcon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-sidebar-foreground">Guest User</div>
                <div className="truncate text-[11px] text-sidebar-foreground/60">Free Tier · Sign in</div>
              </div>
            </button>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3 text-left backdrop-blur-md transition-all hover:border-white/20 hover:bg-white/10">
                  <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-md">
                    {initial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-sidebar-foreground">
                      {user.email}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-1.5 py-0.5 text-[9px] font-semibold tracking-wide",
                          user.tier === "pro"
                            ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                            : "bg-slate-600/40 text-slate-200 ring-1 ring-white/10",
                        )}
                      >
                        {tierLabel}
                      </span>
                      <span className="text-[10px] text-sidebar-foreground/55">Signed in</span>
                    </div>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="start"
                className="w-56 border-white/10 bg-card p-1.5"
              >
                <button
                  onClick={() => setAccountOpen(true)}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground/90 hover:bg-white/5"
                >
                  <Crown className="h-4 w-4 text-primary" />
                  Change plan
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground/90 hover:bg-white/5"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </button>
              </PopoverContent>
            </Popover>
          )}
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
      <AccountModal open={accountOpen} onOpenChange={setAccountOpen} />
    </div>
  );
}