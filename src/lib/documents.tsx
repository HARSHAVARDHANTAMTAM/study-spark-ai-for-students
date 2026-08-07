import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { initialDocuments, type StudyDoc } from "./mock-data";

const KEY = "studyspark.docs";

type DocsContextValue = {
  docs: StudyDoc[];
  addDocs: (files: { name: string; sizeKb: number }[]) => void;
  removeDoc: (id: string) => void;
};

const DocsContext = createContext<DocsContextValue | null>(null);

function extToType(name: string): StudyDoc["type"] {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "PDF";
  if (ext === "docx" || ext === "doc") return "DOCX";
  if (ext === "ppt" || ext === "pptx") return "PPT";
  return "TXT";
}

export function DocumentsProvider({ children }: { children: React.ReactNode }) {
  const [docs, setDocs] = useState<StudyDoc[]>(initialDocuments);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setDocs(JSON.parse(raw) as StudyDoc[]);
    } catch {
      /* ignore */
    }
  }, []);

  const persist = useCallback((next: StudyDoc[]) => {
    setDocs(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo<DocsContextValue>(
    () => ({
      docs,
      addDocs: (files) => {
        const created: StudyDoc[] = files.map((file, i) => ({
          id: `doc-${Date.now()}-${i}`,
          name: file.name,
          type: extToType(file.name),
          pages: Math.max(1, Math.round(file.sizeKb / 55)),
          uploadedAt: new Date().toISOString().slice(0, 10),
          status: "Processed",
          sizeKb: file.sizeKb,
          excerpt: `Uploaded study material: ${file.name}. StudySpark AI has indexed this file and can now explain, quiz and summarise it.`,
        }));
        persist([...created, ...docs]);
      },
      removeDoc: (id) => persist(docs.filter((d) => d.id !== id)),
    }),
    [docs, persist],
  );

  return <DocsContext.Provider value={value}>{children}</DocsContext.Provider>;
}

export function useDocuments() {
  const ctx = useContext(DocsContext);
  if (!ctx) throw new Error("useDocuments must be used inside DocumentsProvider");
  return ctx;
}