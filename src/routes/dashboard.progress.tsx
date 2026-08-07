import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { quizScores, studyHours, topicSplit, weakAreas } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/progress")({
  component: ProgressPage,
});

const PIE_COLORS = ["var(--primary)", "var(--brand-sky)", "var(--muted)"];

function ProgressPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Progress</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Study hours, quiz trends and the topics that still need work.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl border-border/60 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Study hours this week</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studyHours}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="day" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} />
                <Tooltip />
                <Bar dataKey="hours" radius={[8, 8, 0, 0]} fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Quiz score trend</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={quizScores}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                <XAxis dataKey="attempt" stroke="var(--muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="var(--primary)"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Syllabus coverage</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={topicSplit} dataKey="value" nameKey="name" innerRadius={55} outerRadius={85}>
                  {topicSplit.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Weak areas to revisit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {weakAreas.map((area) => (
              <div key={area.topic}>
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium">{area.topic}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">{area.score}%</span>
                </div>
                <Progress value={area.score} className="mt-2 h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}