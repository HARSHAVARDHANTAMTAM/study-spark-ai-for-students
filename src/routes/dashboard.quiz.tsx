import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, RotateCcw, Timer, XCircle } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateQuiz } from "@/lib/ai.functions";
import type { GeneratedQuiz } from "@/lib/ai.server";

export const Route = createFileRoute("/dashboard/quiz")({
  component: QuizPage,
});

const TYPES = [
  { id: "mcq", label: "Multiple choice" },
  { id: "true_false", label: "True / False" },
  { id: "fill_blank", label: "Fill in the blank" },
  { id: "short_answer", label: "Short answer" },
];

function QuizPage() {
  const [topic, setTopic] = useState("Operating Systems — Deadlocks");
  const [difficulty, setDifficulty] = useState("medium");
  const [count, setCount] = useState("5");
  const [types, setTypes] = useState<string[]>(["mcq", "true_false"]);
  const [loading, setLoading] = useState(false);
  const [quiz, setQuiz] = useState<GeneratedQuiz | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!quiz || submitted) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [quiz, submitted]);

  const create = async () => {
    if (types.length === 0) {
      toast.error("Pick at least one question type");
      return;
    }
    setLoading(true);
    setQuiz(null);
    setAnswers({});
    setSubmitted(false);
    setSeconds(0);
    try {
      const result = await generateQuiz({
        data: { topic, types, difficulty, count: Number(count) },
      });
      setQuiz(result);
    } catch {
      toast.error("Couldn't generate the quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const correctCount =
    quiz?.questions.reduce(
      (total, q, i) =>
        total +
        (answers[i]?.trim().toLowerCase() === q.answer.trim().toLowerCase() ? 1 : 0),
      0,
    ) ?? 0;
  const score = quiz?.questions.length ? Math.round((correctCount / quiz.questions.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Quiz generator</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Turn any topic into an exam-style quiz with instant scoring and explanations.
        </p>
      </header>

      <Card className="rounded-2xl border-border/60 shadow-card">
        <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="topic">Topic or chapter</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>
          <div className="space-y-2">
            <Label>Difficulty</Label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Number of questions</Label>
            <Select value={count} onValueChange={setCount}>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["5", "10", "15"].map((n) => (
                  <SelectItem key={n} value={n}>
                    {n} questions
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Question types</Label>
            <div className="flex flex-wrap gap-3">
              {TYPES.map((t) => (
                <label
                  key={t.id}
                  className="flex items-center gap-2 rounded-xl border border-border/70 px-3 py-2 text-sm"
                >
                  <Checkbox
                    checked={types.includes(t.id)}
                    onCheckedChange={(checked) =>
                      setTypes((prev) =>
                        checked ? [...prev, t.id] : prev.filter((x) => x !== t.id),
                      )
                    }
                  />
                  {t.label}
                </label>
              ))}
            </div>
          </div>
          <Button
            onClick={create}
            disabled={loading}
            className="h-11 rounded-xl gradient-brand shadow-glow sm:col-span-2"
          >
            {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
            {loading ? "Building your quiz…" : "Generate quiz"}
          </Button>
        </CardContent>
      </Card>

      {quiz ? (
        <Card className="rounded-2xl border-border/60 shadow-card">
          <CardHeader className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <CardTitle className="truncate text-base">{quiz.title}</CardTitle>
            <Badge variant="secondary" className="shrink-0 rounded-lg">
              <Timer className="mr-1 size-3" />
              {String(Math.floor(seconds / 60)).padStart(2, "0")}:
              {String(seconds % 60).padStart(2, "0")}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-6">
            {submitted ? (
              <div className="rounded-2xl border border-border/60 bg-accent/50 p-5">
                <p className="text-sm text-muted-foreground">Your score</p>
                <p className="text-3xl font-bold">{score}%</p>
                <Progress value={score} className="mt-3 h-2" />
                <p className="mt-2 text-xs text-muted-foreground">
                  {correctCount} of {quiz.questions.length} correct
                </p>
              </div>
            ) : null}

            {quiz.questions.map((q, i) => {
              const given = answers[i] ?? "";
              const isCorrect = given.trim().toLowerCase() === q.answer.trim().toLowerCase();
              return (
                <div key={i} className="rounded-2xl border border-border/60 p-4">
                  <p className="text-sm font-semibold">
                    {i + 1}. {q.question}
                  </p>
                  {q.options.length > 0 ? (
                    <div className="mt-3 grid gap-2">
                      {q.options.map((option) => {
                        const selected = given === option;
                        const showRight = submitted && option === q.answer;
                        const showWrong = submitted && selected && option !== q.answer;
                        return (
                          <button
                            key={option}
                            type="button"
                            disabled={submitted}
                            onClick={() => setAnswers((prev) => ({ ...prev, [i]: option }))}
                            className={`rounded-xl border px-3 py-2 text-left text-sm transition-colors ${
                              showRight
                                ? "border-success bg-success/10"
                                : showWrong
                                  ? "border-destructive bg-destructive/10"
                                  : selected
                                    ? "border-primary bg-accent"
                                    : "border-border/70 hover:bg-accent/60"
                            }`}
                          >
                            {option}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <Input
                      value={given}
                      disabled={submitted}
                      placeholder="Type your answer"
                      onChange={(e) => setAnswers((prev) => ({ ...prev, [i]: e.target.value }))}
                      className="mt-3 h-11 rounded-xl"
                    />
                  )}

                  {submitted ? (
                    <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
                      {isCorrect ? (
                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                      ) : (
                        <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                      )}
                      <span>
                        <span className="font-medium text-foreground">Answer: {q.answer}. </span>
                        {q.explanation}
                      </span>
                    </div>
                  ) : null}
                </div>
              );
            })}

            <div className="flex flex-wrap gap-2">
              {submitted ? (
                <Button onClick={create} variant="outline" className="h-11 rounded-xl">
                  <RotateCcw className="mr-2 size-4" /> New quiz
                </Button>
              ) : (
                <Button
                  onClick={() => setSubmitted(true)}
                  className="h-11 rounded-xl gradient-brand shadow-glow"
                >
                  Submit answers
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}