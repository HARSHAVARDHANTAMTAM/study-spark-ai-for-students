import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowUpRight,
  CalendarCheck,
  FileUp,
  Flame,
  Layers,
  ListChecks,
  MessageSquareText,
  Sparkle,
  Timer,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useDocuments } from "@/lib/documents";
import { recentActivity, upcomingExams } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/")({
  component: DashboardHome,
});

const quickActions = [
  { to: "/dashboard/upload", label: "Upload notes", icon: FileUp },
  { to: "/dashboard/chat", label: "Ask AI", icon: MessageSquareText },
  { to: "/dashboard/quiz", label: "Generate quiz", icon: ListChecks },
  { to: "/dashboard/flashcards", label: "Flashcards", icon: Layers },
  { to: "/dashboard/planner", label: "Plan revision", icon: CalendarCheck },
] as const;

function DashboardHome() {
  const { user } = useAuth();
  const { docs } = useDocuments();

  const stats = [
    { label: "Materials uploaded", value: String(docs.length), icon: FileUp, trend: "+2 this week" },
    { label: "Quizzes attempted", value: "24", icon: ListChecks, trend: "avg 78%" },
    { label: "Study streak", value: "12 days", icon: Flame, trend: "personal best" },
    { label: "Hours this week", value: "23.3", icon: Timer, trend: "+4.1 vs last" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <section className="overflow-hidden rounded-3xl border border-border/60 gradient-brand p-6 text-primary-foreground sm:p-8">
        <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-widest opacity-80">
              Welcome back
            </p>
            <h1 className="mt-1 truncate text-2xl font-bold sm:text-3xl">
              {user?.name?.split(" ")[0] ?? "Student"}, let's make today count
            </h1>
            <p className="mt-2 max-w-xl text-sm opacity-90">
              You're 72% ready for Operating Systems. Two focused sessions today keeps you on track.
            </p>
          </div>
          <Button asChild variant="secondary" className="h-11 shrink-0 rounded-xl font-semibold">
            <Link to="/dashboard/chat">
              <Sparkle className="mr-2 size-4" /> Start studying
            </Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, trend }) => (
          <Card key={label} className="rounded-2xl border-border/60 shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <Icon className="size-4" />
                </span>
                <span className="text-xs font-medium text-muted-foreground">{trend}</span>
              </div>
              <p className="mt-4 text-2xl font-bold">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Quick actions</h2>
        <div className="flex flex-wrap gap-2.5">
          {quickActions.map(({ to, label, icon: Icon }) => (
            <Button
              key={to}
              asChild
              variant="outline"
              className="h-11 rounded-xl border-border/70 bg-card/70"
            >
              <Link to={to}>
                <Icon className="mr-2 size-4 text-primary" /> {label}
              </Link>
            </Button>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-2xl border-border/60 shadow-card lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-base">Recent activity</CardTitle>
            <Link
              to="/dashboard/progress"
              className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              View progress <ArrowUpRight className="size-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-1">
            {recentActivity.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-accent/60"
              >
                <span className="mt-1 size-2 shrink-0 rounded-full gradient-brand" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.meta}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="size-4 text-primary" /> Exam readiness
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {upcomingExams.map((exam) => (
              <div key={exam.subject}>
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{exam.subject}</p>
                  <Badge variant="secondary" className="shrink-0 rounded-lg text-xs">
                    {exam.daysLeft}d left
                  </Badge>
                </div>
                <Progress value={exam.readiness} className="mt-2 h-2" />
                <p className="mt-1 text-xs text-muted-foreground">{exam.readiness}% ready</p>
              </div>
            ))}
            <Button asChild variant="outline" className="w-full rounded-xl">
              <Link to="/dashboard/planner">Rebuild my plan</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}