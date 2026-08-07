import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";
import { Loader2, SendHorizonal, Sparkle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { BrandMark } from "@/components/site/brand";
import { suggestedPrompts } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/chat")({
  component: ChatPage,
});

function ChatPage() {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: () => toast.error("The AI tutor is unavailable right now. Please try again."),
  });

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (!busy) inputRef.current?.focus();
  }, [busy]);

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || busy) return;
    void sendMessage({ text: value });
    setInput("");
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-9rem)] max-w-3xl flex-col">
      <header className="pb-4">
        <h1 className="text-2xl font-bold">AI Chat</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ask anything about your subjects — powered by StudySpark AI.
        </p>
      </header>

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto pr-1">
        {messages.length === 0 ? (
          <Card className="rounded-3xl border-border/60 p-8 text-center shadow-card">
            <div className="flex justify-center">
              <BrandMark className="size-12" />
            </div>
            <h2 className="mt-4 text-lg font-semibold">What are we learning today?</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Try one of these to get started.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  onClick={() => submit(prompt)}
                  className="rounded-xl border border-border/70 bg-card/70 px-3 py-2 text-xs font-medium transition-colors hover:bg-accent"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </Card>
        ) : null}

        {messages.map((message) => {
          const text = message.parts
            .map((part) => (part.type === "text" ? part.text : ""))
            .join("");
          const isUser = message.role === "user";
          return (
            <div key={message.id} className={isUser ? "flex justify-end" : "flex gap-3"}>
              {!isUser ? <BrandMark className="mt-0.5 size-8 shrink-0" /> : null}
              <div
                className={
                  isUser
                    ? "max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground"
                    : "prose prose-sm min-w-0 max-w-none flex-1 text-foreground dark:prose-invert"
                }
              >
                {isUser ? (
                  <p className="whitespace-pre-wrap">{text}</p>
                ) : (
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{text}</ReactMarkdown>
                )}
              </div>
            </div>
          );
        })}

        {status === "submitted" ? (
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <BrandMark className="size-8" />
            <span className="flex items-center gap-2">
              <Sparkle className="size-4 animate-pulse text-primary" /> Thinking…
            </span>
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="mt-4 rounded-2xl border border-border/60 bg-card/80 p-2 shadow-card"
      >
        <Textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              submit(input);
            }
          }}
          placeholder="Explain deadlock avoidance with a simple example…"
          className="max-h-40 min-h-[52px] resize-none border-0 bg-transparent shadow-none focus-visible:ring-0"
        />
        <div className="flex justify-end px-1 pb-1">
          <Button
            type="submit"
            size="icon"
            disabled={busy || !input.trim()}
            className="size-9 rounded-xl gradient-brand"
            aria-label="Send message"
          >
            {busy ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <SendHorizonal className="size-4" />
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}