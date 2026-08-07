import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import {
  REASONING_OPTIONS,
  STUDYSPARK_MODEL,
  createStudySparkAi,
  getLovableAiGatewayRunId,
} from "@/lib/ai-gateway.server";

const SYSTEM_PROMPT = `You are StudySpark AI, a warm, encouraging AI study buddy for students.
- Explain concepts clearly, step by step, adapting to the requested level.
- Use markdown: short paragraphs, bold key terms, bullet lists, tables and fenced code blocks when useful.
- When asked for questions, quizzes or revision notes, produce well-structured study-ready output.
- Keep answers focused; end with a short "Next step" suggestion when helpful.`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = (await request.json()) as { messages?: unknown };
        if (!Array.isArray(body.messages)) {
          return new Response("Messages are required", { status: 400 });
        }

        try {
          const initialRunId = getLovableAiGatewayRunId(request);
          const { provider } = createStudySparkAi(initialRunId);
          const messages = body.messages as UIMessage[];

          const result = streamText({
            model: provider.responses(STUDYSPARK_MODEL),
            system: SYSTEM_PROMPT,
            messages: await convertToModelMessages(messages),
            providerOptions: REASONING_OPTIONS,
          });

          return result.toUIMessageStreamResponse({
            originalMessages: messages,
            sendReasoning: true,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "AI request failed";
          return new Response(message, { status: 500 });
        }
      },
    },
  },
});