import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { buildFlashcards, buildPlan, buildQuiz, buildSummary } from "./ai.server";

export const generateQuiz = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        topic: z.string().min(2),
        types: z.array(z.string()).min(1),
        difficulty: z.string(),
        count: z.number().min(1).max(20),
      })
      .parse(input),
  )
  .handler(async ({ data }) => buildQuiz(data));

export const generateFlashcards = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ topic: z.string().min(2), count: z.number().min(1).max(20) }).parse(input),
  )
  .handler(async ({ data }) => buildFlashcards(data));

export const generateStudyPlan = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        examDate: z.string(),
        startDate: z.string(),
        hoursPerDay: z.number().min(1).max(16),
        subjects: z.array(z.string()).min(1),
      })
      .parse(input),
  )
  .handler(async ({ data }) => buildPlan(data));

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ title: z.string(), content: z.string().min(1) }).parse(input),
  )
  .handler(async ({ data }) => ({ summary: await buildSummary(data) }));