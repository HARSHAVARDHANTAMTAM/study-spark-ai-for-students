import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  FileText,
  Loader2,
  Sparkle,
  Trash2,
  UploadCloud,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useDocuments } from "@/lib/documents";
import { summarizeNotes } from "@/lib/ai.functions";
import type { StudyDoc } from "@/lib/mock-data";

export const Route = createFileRoute("/dashboard/upload")({
  component: UploadPage,
});

function UploadPage() {
  const { docs, addDocs, removeDoc } = useDocuments();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [summaryFor, setSummaryFor] = useState<StudyDoc | null>(null);
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    addDocs(
      Array.from(files).map((f) => ({ name: f.name, sizeKb: Math.max(1, Math.round(f.size / 1024)) })),
    );
    toast.success(`${files.length} file${files.length > 1 ? "s" : ""} uploaded and indexed`);
  };

  const summarise = async (doc: StudyDoc) => {
    setSummaryFor(doc);
    setSummary("");
    setLoading(true);
    try {
      const res = await summarizeNotes({ data: { title: doc.name, content: doc.excerpt } });
      setSummary(res.summary);
    } catch {
      toast.error("AI summary failed. Please try again.");
      setSummaryFor(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Upload notes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drop PDFs, slides or docs — StudySpark AI indexes them for chat, quizzes and flashcards.
        </p>
      </header>

      <Card
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={`rounded-3xl border-2 border-dashed shadow-card transition-colors ${
          dragging ? "border-primary bg-accent/60" : "border-border/70 bg-card/60"
        }`}
      >
        <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
          <span className="grid size-14 place-items-center rounded-2xl gradient-brand text-primary-foreground shadow-glow">
            <UploadCloud className="size-6" />
          </span>
          <p className="text-base font-semibold">Drag & drop your study material</p>
          <p className="text-sm text-muted-foreground">PDF, DOCX, PPT or TXT — up to 20MB each</p>
          <Button
            onClick={() => inputRef.current?.click()}
            className="mt-2 h-11 rounded-xl gradient-brand shadow-glow"
          >
            Browse files
          </Button>
          <input
            ref={inputRef}
            type="file"
            multiple
            hidden
            accept=".pdf,.doc,.docx,.ppt,.pptx,.txt"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/60 shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Your materials ({docs.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {docs.map((doc) => (
            <div
              key={doc.id}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border/60 p-3 sm:gap-4"
            >
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
                <FileText className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{doc.name}</p>
                <p className="text-xs text-muted-foreground">
                  {doc.type} · {doc.pages} pages · {(doc.sizeKb / 1024).toFixed(1)} MB ·{" "}
                  {doc.uploadedAt}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5">
                <Badge
                  variant={doc.status === "Processed" ? "secondary" : "outline"}
                  className="hidden rounded-lg sm:inline-flex"
                >
                  {doc.status}
                </Badge>
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-xl"
                  onClick={() => summarise(doc)}
                >
                  <Sparkle className="size-4 text-primary" />
                  <span className="ml-1 hidden sm:inline">Summarise</span>
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Delete"
                  className="rounded-xl text-muted-foreground hover:text-destructive"
                  onClick={() => {
                    removeDoc(doc.id);
                    toast.success("Material removed");
                  }}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
          {docs.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No materials yet — upload your first file above.
            </p>
          ) : null}
        </CardContent>
      </Card>

      {summaryFor ? (
        <Card className="rounded-2xl border-border/60 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">AI summary — {summaryFor.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" /> Reading your notes…
              </p>
            ) : (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{summary}</ReactMarkdown>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}