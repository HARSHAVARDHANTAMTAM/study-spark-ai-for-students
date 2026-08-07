import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarCheck, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { generateStudyPlan } from "@/lib/ai.functions";
import type { GeneratedPlan } from "@/lib/ai.server";

export const Route = createFileRoute("/dashboard/planner")({
  component: PlannerPage,
});

function PlannerPage() {
  const today = new Date().toISOString().slice(0, 10);
  const [startDate, setStartDate] = useState(today);
  const [examDate, setExamDate] = useState("2026-08-18");
  const [hours, setHours] = useState("4");
  const [subjects, setSubjects] = useState("Operating Systems, DBMS, Machine Learning");
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState<Record<string, boolean>>({});

  const build = async () => {
    setLoading(true);
    try {
      const result = await generateStudyPlan({
        data: {
          startDate,
          examDate,
          hoursPerDay: Number(hours),
          subjects: subjects.split(",").map((s) => s.trim()).filter(Boolean),
        },
      });
      setPlan(result);
      setDone({});
    } catch {
      toast.error("Couldn't build the plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Study planner</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Get a realistic day-by-day revision schedule built around your exam date.
        </p>
      </header>

      <Card className="rounded-2xl border-border/60 shadow-card">
        <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="start">Start date</Label>
            <Input
              id="start"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exam">Exam date</Label>
            <Input
              id="exam"
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hours">Hours per day</Label>
            <Input
              id="hours"
              type="number"
              min={1}
              max={16}
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subjects">Subjects (comma separated)</Label>
            <Input
              id="subjects"
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>
          <Button
            onClick={build}
            disabled={loading}
            className="h-11 rounded-xl gradient-brand shadow-glow sm:col-span-2"
          >
            {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <CalendarCheck className="mr-2 size-4" />}
            {loading ? "Planning your revision…" : "Generate study plan"}
          </Button>
        </CardContent>
      </Card>

      {plan ? (
        <div className="space-y-4">
          <Card className="rounded-2xl border-border/60 bg-accent/40 shadow-card">
            <CardContent className="p-5 text-sm">{plan.summary}</CardContent>
          </Card>
          {plan.days.map((day) => (
            <Card key={day.date} className="rounded-2xl border-border/60 shadow-card">
              <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <CardTitle className="truncate text-base">{day.focus}</CardTitle>
                <Badge variant="secondary" className="shrink-0 rounded-lg">
                  {day.date}
                </Badge>
              </CardHeader>
              <CardContent className="space-y-2">
                {day.tasks.map((task) => {
                  const key = `${day.date}-${task.title}`;
                  return (
                    <label
                      key={key}
                      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/60 p-3 text-sm"
                    >
                      <Checkbox
                        checked={!!done[key]}
                        onCheckedChange={(checked) =>
                          setDone((prev) => ({ ...prev, [key]: !!checked }))
                        }
                      />
                      <span className={`min-w-0 ${done[key] ? "text-muted-foreground line-through" : ""}`}>
                        <span className="block truncate font-medium">{task.title}</span>
                        <span className="text-xs text-muted-foreground">{task.subject}</span>
                      </span>
                      <span className="shrink-0 text-xs text-muted-foreground">{task.hours}h</span>
                    </label>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  );
}