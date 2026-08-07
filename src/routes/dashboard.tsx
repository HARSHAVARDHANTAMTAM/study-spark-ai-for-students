import { Link, Outlet, createFileRoute, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Bell,
  CalendarCheck,
  FileUp,
  LayoutDashboard,
  Layers,
  LineChart,
  ListChecks,
  LogOut,
  Menu,
  MessageSquareText,
  Search,
  Settings,
  User,
  X,
} from "lucide-react";
import { BrandMark } from "@/components/site/brand";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AuthProviderGate } from "@/components/dashboard/auth-gate";
import { DocumentsProvider } from "@/lib/documents";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — StudySpark AI" },
      {
        name: "description",
        content: "Your AI study workspace: notes, chats, quizzes, planner and progress.",
      },
      { property: "og:title", content: "Dashboard — StudySpark AI" },
      { property: "og:description", content: "Track notes, quizzes, streaks and revision plans." },
    ],
  }),
  component: DashboardLayout,
});

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/dashboard/upload", label: "Upload Notes", icon: FileUp },
  { to: "/dashboard/chat", label: "AI Chat", icon: MessageSquareText },
  { to: "/dashboard/quiz", label: "Quiz Generator", icon: ListChecks },
  { to: "/dashboard/planner", label: "Study Planner", icon: CalendarCheck },
  { to: "/dashboard/flashcards", label: "Flashcards", icon: Layers },
  { to: "/dashboard/progress", label: "Progress", icon: LineChart },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
  { to: "/dashboard/profile", label: "Profile", icon: User },
] as const;

const notifications = [
  { title: "Operating Systems exam in 11 days", meta: "Planner reminder" },
  { title: "Your DBMS quiz score improved to 91%", meta: "2 hours ago" },
  { title: "6 flashcards are due for review today", meta: "This morning" },
];

function DashboardLayout() {
  return (
    <AuthProviderGate>
      <DocumentsProvider>
        <Shell />
      </DocumentsProvider>
    </AuthProviderGate>
  );
}

function Shell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => setMobileOpen(false), [pathname]);

  const initials = (user?.name ?? "SA")
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  const sidebar = (
    <div className="flex h-full flex-col gap-2 p-4">
      <Link to="/dashboard" className="mb-4 flex items-center gap-2.5 px-1">
        <BrandMark />
        <span className="text-base font-bold">
          StudySpark <span className="gradient-text">AI</span>
        </span>
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {navItems.map(({ to, label, icon: Icon, exact }) => {
          const active = exact ? pathname === to : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "gradient-brand text-primary-foreground shadow-glow"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`}
            >
              <Icon className="size-4 shrink-0" />
              <span className="truncate">{label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="rounded-2xl border border-sidebar-border bg-sidebar-accent/50 p-4">
        <p className="text-xs font-semibold">🔥 12-day streak</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Study 30 more minutes today to keep it alive.
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-background">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
        {sidebar}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 border-r border-sidebar-border bg-sidebar">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-4 rounded-lg p-1.5 hover:bg-sidebar-accent"
            >
              <X className="size-4" />
            </button>
            {sidebar}
          </aside>
        </div>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border/60 glass">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 sm:px-6">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="rounded-xl p-2 hover:bg-accent lg:hidden"
            >
              <Menu className="size-4" />
            </button>
            <div className="relative min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search notes, quizzes, topics…"
                className="h-10 w-full rounded-xl border-border/70 bg-card/70 pl-9"
              />
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-label="Notifications"
                    className="relative rounded-xl p-2.5 hover:bg-accent"
                  >
                    <Bell className="size-4" />
                    <span className="absolute right-2 top-2 size-2 rounded-full bg-destructive" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-80 rounded-2xl p-2">
                  <p className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                    Notifications
                  </p>
                  {notifications.map((n) => (
                    <div key={n.title} className="rounded-xl p-2.5 hover:bg-accent">
                      <p className="text-sm font-medium">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.meta}</p>
                    </div>
                  ))}
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button type="button" className="rounded-full" aria-label="Profile menu">
                    <Avatar className="size-9 border border-border">
                      <AvatarFallback className="gradient-brand text-xs font-semibold text-primary-foreground">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl">
                  <DropdownMenuLabel>
                    <p className="text-sm font-semibold">{user?.name}</p>
                    <p className="text-xs font-normal text-muted-foreground">{user?.email}</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/profile">
                      <User className="mr-2 size-4" /> Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard/settings">
                      <Settings className="mr-2 size-4" /> Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      signOut();
                      navigate({ to: "/" });
                    }}
                  >
                    <LogOut className="mr-2 size-4" /> Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}