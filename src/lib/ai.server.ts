import { Output, streamText, NoObjectGeneratedError } from "ai";
import { z } from "zod";
import {
  NO_REASONING_OPTIONS,
  STUDYSPARK_MODEL,
  createStudySparkAi,
} from "./ai-gateway.server";

export const quizSchema = z.object({
  title: z.string(),
  questions: z.array(
    z.object({
      type: z.enum(["mcq", "true_false", "fill_blank", "short_answer"]),
      question: z.string(),
      options: z.array(z.string()),
      answer: z.string(),
      explanation: z.string(),
    }),
  ),
});
export type GeneratedQuiz = z.infer<typeof quizSchema>;

export const flashcardsSchema = z.object({
  cards: z.array(z.object({ front: z.string(), back: z.string(), topic: z.string() })),
});
export type GeneratedFlashcards = z.infer<typeof flashcardsSchema>;

export const planSchema = z.object({
  summary: z.string(),
  days: z.array(
    z.object({
      date: z.string(),
      focus: z.string(),
      tasks: z.array(
        z.object({ title: z.string(), subject: z.string(), hours: z.number() }),
      ),
    }),
  ),
});
export type GeneratedPlan = z.infer<typeof planSchema>;

async function generateStructured<T>(schema: z.ZodType<T>, prompt: string, system: string) {
  const { provider } = createStudySparkAi();
  try {
    const result = streamText({
      model: provider.responses(STUDYSPARK_MODEL),
      system,
      prompt,
      output: Output.object({ schema }),
      providerOptions: NO_REASONING_OPTIONS,
    });
    return await result.output;
  } catch (error) {
    if (NoObjectGeneratedError.isInstance(error) && error.text) {
      const match = error.text.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = schema.safeParse(JSON.parse(match[0]));
        if (parsed.success) return parsed.data;
      }
    }
    throw error;
  }
}

export function buildQuiz(input: {
  topic: string;
  types: string[];
  difficulty: string;
  count: number;
}) {
  return generateStructured(
    quizSchema,
    `Create a ${input.difficulty} difficulty quiz with exactly ${input.count} questions about: ${input.topic}.
Use only these question types: ${input.types.join(", ")}.
For mcq give 4 options; for true_false give options ["True","False"]; for fill_blank and short_answer give an empty options array.
"answer" must exactly match the correct option text for mcq/true_false. Keep explanations to one or two sentences.`,
    "You are an expert exam setter creating fair, curriculum-accurate quizzes for students.",
  );
}

export function buildFlashcards(input: { topic: string; count: number }) {
  return generateStructured(
    flashcardsSchema,
    `Create exactly ${input.count} study flashcards about: ${input.topic}. Fronts are short prompts or terms; backs are concise 1-3 sentence explanations. Topic is a 1-3 word tag.`,
    "You create high-retention spaced-repetition flashcards for students.",
  );
}

export function buildPlan(input: {
  examDate: string;
  hoursPerDay: number;
  subjects: string[];
  startDate: string;
}) {
  return generateStructured(
    planSchema,
    `Build a day-by-day revision plan from ${input.startDate} to the exam on ${input.examDate}.
The student can study ${input.hoursPerDay} hours per day. Subjects: ${input.subjects.join(", ")}.
Return at most 21 days. "date" must be an ISO date (YYYY-MM-DD). Total task hours per day must not exceed the available hours. Include revision and mock-test days near the exam. "summary" is 2 sentences of strategy.`,
    "You are an academic coach who builds realistic, balanced revision schedules.",
  );
}

export function buildSummary(input: { title: string; content: string }) {
  const { provider } = createStudySparkAi();
  const result = streamText({
    model: provider.responses(STUDYSPARK_MODEL),
    system: "You summarise student study material into revision-ready markdown notes.",
    prompt: `Summarise the study material titled "${input.title}" into markdown revision notes with a short overview, key concepts as bullets, formulas/definitions if any, and 3 likely exam questions.\n\nMaterial:\n${input.content}`,
    providerOptions: NO_REASONING_OPTIONS,
  });
  return result.text;
}