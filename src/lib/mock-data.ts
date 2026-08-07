export type StudyDoc = {
  id: string;
  name: string;
  type: "PDF" | "DOCX" | "PPT" | "TXT";
  pages: number;
  uploadedAt: string;
  status: "Processed" | "Processing" | "Failed";
  sizeKb: number;
  excerpt: string;
};

export const initialDocuments: StudyDoc[] = [
  {
    id: "doc-1",
    name: "Operating Systems — Unit 3 Deadlocks.pdf",
    type: "PDF",
    pages: 24,
    uploadedAt: "2026-08-02",
    status: "Processed",
    sizeKb: 1840,
    excerpt:
      "Deadlock arises when four conditions hold simultaneously: mutual exclusion, hold and wait, no preemption and circular wait. Banker's algorithm avoids deadlock by simulating allocation.",
  },
  {
    id: "doc-2",
    name: "DBMS Normalization Notes.docx",
    type: "DOCX",
    pages: 12,
    uploadedAt: "2026-07-29",
    status: "Processed",
    sizeKb: 640,
    excerpt:
      "Normalization decomposes relations to reduce redundancy. 1NF removes repeating groups, 2NF removes partial dependencies, 3NF removes transitive dependencies, BCNF strengthens 3NF.",
  },
  {
    id: "doc-3",
    name: "Machine Learning Lecture 7.ppt",
    type: "PPT",
    pages: 38,
    uploadedAt: "2026-07-25",
    status: "Processed",
    sizeKb: 4210,
    excerpt:
      "Gradient descent minimises a loss function by stepping opposite the gradient. Learning rate controls step size; too large diverges, too small converges slowly.",
  },
  {
    id: "doc-4",
    name: "Discrete Maths Formula Sheet.txt",
    type: "TXT",
    pages: 4,
    uploadedAt: "2026-07-21",
    status: "Processing",
    sizeKb: 58,
    excerpt:
      "Permutations nPr = n!/(n-r)!, Combinations nCr = n!/(r!(n-r)!), inclusion-exclusion principle, pigeonhole principle.",
  },
];

export const upcomingExams = [
  { subject: "Operating Systems", date: "2026-08-18", daysLeft: 11, readiness: 72 },
  { subject: "DBMS", date: "2026-08-24", daysLeft: 17, readiness: 58 },
  { subject: "Machine Learning", date: "2026-09-02", daysLeft: 26, readiness: 41 },
];

export const recentActivity = [
  { title: "Generated 15 MCQs on Deadlocks", meta: "Quiz Generator · 2h ago", kind: "quiz" },
  { title: "Asked AI to explain B+ Trees like I'm 10", meta: "AI Chat · 5h ago", kind: "chat" },
  { title: "Uploaded Machine Learning Lecture 7.ppt", meta: "Upload · Yesterday", kind: "upload" },
  { title: "Completed 3 planner tasks", meta: "Study Planner · Yesterday", kind: "plan" },
  { title: "Bookmarked 6 tough flashcards", meta: "Flashcards · 2 days ago", kind: "cards" },
];

export const studyHours = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 3.2 },
  { day: "Wed", hours: 1.8 },
  { day: "Thu", hours: 4.1 },
  { day: "Fri", hours: 3.6 },
  { day: "Sat", hours: 5.2 },
  { day: "Sun", hours: 2.9 },
];

export const quizScores = [
  { attempt: "Q1", score: 62 },
  { attempt: "Q2", score: 70 },
  { attempt: "Q3", score: 66 },
  { attempt: "Q4", score: 78 },
  { attempt: "Q5", score: 85 },
  { attempt: "Q6", score: 91 },
];

export const topicSplit = [
  { name: "Mastered", value: 42 },
  { name: "In progress", value: 31 },
  { name: "Not started", value: 27 },
];

export const weakAreas = [
  { topic: "Deadlock Avoidance", score: 44 },
  { topic: "Normalization (BCNF)", score: 51 },
  { topic: "Gradient Descent Math", score: 38 },
  { topic: "Graph Traversals", score: 58 },
];

export const suggestedPrompts = [
  "Explain this chapter like I'm 10",
  "Summarize my notes",
  "Generate important questions",
  "Explain with examples",
  "Create revision notes",
];

export const achievements = [
  { title: "12-Day Streak", detail: "Studied every day for 12 days" },
  { title: "Quiz Master", detail: "Scored 90%+ on 5 quizzes" },
  { title: "Note Ninja", detail: "Uploaded 20+ documents" },
  { title: "Deep Diver", detail: "100 AI conversations" },
];

export const certificates = [
  { title: "Foundations of Machine Learning", issuer: "StudySpark Academy", date: "Jul 2026" },
  { title: "Database Systems Specialist", issuer: "StudySpark Academy", date: "May 2026" },
  { title: "Operating Systems Essentials", issuer: "StudySpark Academy", date: "Feb 2026" },
];