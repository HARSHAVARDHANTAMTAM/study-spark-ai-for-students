import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight, Layers, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { generateFlashcards } from "@/lib/ai.functions";
import type { GeneratedFlashcards } from "@/lib/ai.server";

export const Route = createFileRoute("/dashboard/flashcards")({
  component: FlashcardsPage,
});

function FlashcardsPage() {
  const [topic, setTopic] = useState("DBMS Normalization");
  const [cards, setCards] = useState<GeneratedFlashcards["cards"]>([]);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);

  const build = async () => {
    setLoading(true);
    try {
      const result = await generateFlashcards({ data: { topic, count: 8 } });
      setCards(result.cards);
      setIndex(0);
      setFlipped(false);
    } catch {
      toast.error("Couldn't create flashcards. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const card = cards[index];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Flashcards</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Flip through AI-made cards for fast, active recall.
        </p>
      </header>

      <Card className="rounded-2xl border-border/60 shadow-card">
        <CardContent className="grid gap-4 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>
          <Button
            onClick={build}
            disabled={loading}
            className="h-11 rounded-xl gradient-brand shadow-glow"
          >
            {loading ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Layers className="mr-2 size-4" />}
            Generate cards
          </Button>
        </CardContent>
      </Card>

      {card ? (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => setFlipped((f) => !f)}
            className="w-full [perspective:1200px]"
            aria-label="Flip card"
          >
            <div
              className="relative h-64 w-full transition-transform duration-500 [transform-style:preserve-3d]"
              style={{ transform: flipped ? "rotateY(180deg)" : undefined }}
            >
              <div className="absolute inset-0 grid place-items-center rounded-3xl border border-border/60 gradient-brand p-8 text-center text-primary-foreground shadow-glow [backface-visibility:hidden]">
                <p className="text-lg font-semibold">{card.front}</p>
              </div>
              <div
                className="absolute inset-0 grid place-items-center rounded-3xl border border-border/60 bg-card p-8 text-center shadow-card [backface-visibility:hidden]"
                style={{ transform: "rotateY(180deg)" }}
              >
                <p className="text-sm">{card.back}</p>
              </div>
            </div>
          </button>

          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                setIndex((i) => Math.max(0, i - 1));
                setFlipped(false);
              }}
              aria-label="Previous card"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <div className="text-center text-xs text-muted-foreground">
              <Badge variant="secondary" className="rounded-lg">
                {card.topic}
              </Badge>
              <p className="mt-1">
                Card {index + 1} of {cards.length} · tap to flip
              </p>
            </div>
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => {
                setIndex((i) => Math.min(cards.length - 1, i + 1));
                setFlipped(false);
              }}
              aria-label="Next card"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}