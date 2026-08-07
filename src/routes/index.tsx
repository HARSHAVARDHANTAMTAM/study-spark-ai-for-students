import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  BrainCircuit,
  CalendarCheck,
  FileText,
  Layers,
  LineChart,
  MessageSquareText,
  Quote,
  Sparkle,
  Star,
} from "lucide-react";
import { AuroraBackdrop, BrandLogo } from "@/components/site/brand";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "StudySpark AI — Learn Smarter with AI" },
      {
        name: "description",
        content:
          "Upload your notes and let AI explain concepts, answer questions, generate quizzes, and create personalized study plans.",
      },
      { property: "og:title", content: "StudySpark AI — Learn Smarter with AI" },
      {
        property: "og:description",
        content:
          "Your AI study buddy: instant explanations, quizzes, flashcards, revision plans and progress tracking.",
      },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: FileText,
    title: "Upload any material",
    body: "Drop PDFs, DOCX, PPT or TXT notes. StudySpark reads them and gets ready to teach.",
  },
  {
    icon: MessageSquareText,
    title: "Ask anything, anytime",
    body: "A ChatGPT-style tutor that explains hard chapters simply — with examples and code.",
  },
  {
    icon: BrainCircuit,
    title: "AI quiz generator",
    body: "MCQs, true/false, fill in the blanks and short answers at your chosen difficulty.",
  },
  {
    icon: Layers,
    title: "Smart flashcards",
    body: "Auto-generated cards with flip animations and bookmarks for tough concepts.",
  },
  {
    icon: CalendarCheck,
    title: "Personalized planner",
    body: "Give your exam date and free hours — get a balanced day-by-day revision calendar.",
  },
  {
    icon: LineChart,
    title: "Progress insights",
    body: "Track study hours, quiz scores, weak areas and streaks with beautiful charts.",
  },
];

const testimonials = [
  {
    name: "Priya Nair",
    role: "B.Tech CSE, Semester 6",
    quote:
      "I uploaded four units of DBMS and had a full revision plan plus 60 practice questions in ten minutes. My score went from 61 to 88.",
  },
  {
    name: "Rahul Verma",
    role: "NEET Aspirant",
    quote:
      "The 'explain like I'm 10' prompt is unreal. Concepts I avoided for months finally clicked in one evening.",
  },
  {
    name: "Ananya Iyer",
    role: "MBA, Finance",
    quote:
      "Flashcards plus the weak-areas chart tell me exactly what to revise. It feels like a tutor who actually knows me.",
  },
];

const faqs = [
  {
    q: "Which file types can I upload?",
    a: "PDF, DOCX, PPT and TXT files are supported. Each upload shows its page count, date and processing status.",
  },
  {
    q: "How does the AI understand my notes?",
    a: "Your material is parsed into study context that the AI references when explaining concepts, generating quizzes, flashcards and revision plans.",
  },
  {
    q: "Can I choose quiz difficulty and length?",
    a: "Yes. Pick easy, medium or hard, choose question types, and set how many questions you want — then take it with a live timer and instant scoring.",
  },
  {
    q: "Does it track my progress?",
    a: "The Progress page charts study hours, quiz scores, topics completed, weak areas and your daily streak.",
  },
  {
    q: "Is StudySpark AI free to start?",
    a: "You can create an account and explore every workspace feature — uploads, chat, quizzes, flashcards and planning — at no cost.",
  },
];

function Landing() {
  const { user } = useAuth();
  const primaryTo = user ? "/dashboard" : "/signup";

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <AuroraBackdrop />

      <header className="sticky top-0 z-40 border-b border-border/60 glass">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6">
          <BrandLogo />
          <nav className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Log in
            </Link>
            <Button asChild className="rounded-full gradient-brand shadow-glow">
              <Link to={primaryTo}>{user ? "Open dashboard" : "Get started"}</Link>
            </Button>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 pt-16 pb-20 text-center sm:px-6 sm:pt-24">
          <Badge
            variant="secondary"
            className="mb-6 rounded-full border border-border/70 bg-card/70 px-4 py-1.5 text-xs font-medium"
          >
            <Sparkle className="mr-1.5 size-3.5 text-primary" /> Powered by AI · built for students
          </Badge>
          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-[1.05] sm:text-6xl">
            Learn Smarter <span className="gradient-text">with AI</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Upload your notes and let AI explain concepts, answer questions, generate quizzes, and
            create personalized study plans.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full gradient-brand px-7 text-base shadow-glow"
            >
              <Link to={primaryTo}>
                Start learning free <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-full border-border/70 bg-card/60 px-7 text-base backdrop-blur"
            >
              <Link to="/login">I already have an account</Link>
            </Button>
          </div>

          <div className="mt-16 animate-fade-up">
            <div className="mx-auto max-w-4xl rounded-3xl border border-border/60 glass p-3 shadow-glow">
              <div className="rounded-2xl border border-border/60 bg-card/80 p-6 text-left">
                <div className="flex items-center gap-2 pb-4">
                  <span className="size-2.5 rounded-full bg-destructive/70" />
                  <span className="size-2.5 rounded-full bg-warning/80" />
                  <span className="size-2.5 rounded-full bg-success/80" />
                  <span className="ml-3 text-xs text-muted-foreground">
                    studyspark.ai / ai-chat
                  </span>
                </div>
                <div className="space-y-4 text-sm">
                  <p className="ml-auto w-fit max-w-[85%] rounded-2xl bg-primary px-4 py-2.5 text-primary-foreground">
                    Explain deadlock avoidance like I'm 10, then quiz me.
                  </p>
                  <div className="max-w-[92%] space-y-2 text-muted-foreground">
                    <p className="font-medium text-foreground">
                      Imagine four kids each holding one puzzle piece…
                    </p>
                    <p>
                      A deadlock is when everyone waits for someone else forever. The Banker's
                      algorithm is the teacher who only hands out pieces when a safe finish is
                      guaranteed.
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {["4 conditions", "Safe state", "3 practice MCQs"].map((chip) => (
                        <span
                          key={chip}
                          className="rounded-full border border-border/70 bg-accent/60 px-3 py-1 text-xs font-medium text-accent-foreground"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">
            Everything you need to revise
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
            One workspace that turns messy notes into understanding, practice and a plan.
          </p>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="group surface-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow"
              >
                <span className="grid size-11 place-items-center rounded-2xl bg-accent text-accent-foreground transition-colors group-hover:gradient-brand group-hover:text-primary-foreground">
                  <Icon className="size-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">Loved by students</h2>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {testimonials.map((t) => (
              <figure key={t.name} className="surface-card flex h-full flex-col p-6">
                <Quote className="size-6 text-primary/70" />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {t.quote}
                </blockquote>
                <div className="mt-5 flex items-center gap-1 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-3.5 fill-current" />
                  ))}
                </div>
                <figcaption className="mt-3">
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h2 className="text-center text-3xl font-bold sm:text-4xl">Questions, answered</h2>
          <Accordion type="single" collapsible className="mt-10 space-y-3">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`faq-${i}`}
                className="surface-card border-b px-5 data-[state=open]:shadow-glow"
              >
                <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <div className="relative overflow-hidden rounded-3xl gradient-brand px-6 py-14 text-center shadow-glow">
            <h2 className="text-3xl font-extrabold text-primary-foreground sm:text-4xl">
              Your next exam starts today
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-primary-foreground/85">
              Join thousands of students revising with an AI buddy that never gets tired of
              explaining.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-8 h-12 rounded-full bg-card px-7 text-base text-foreground hover:bg-card/90"
            >
              <Link to={primaryTo}>Create my free account</Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-card/50">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <BrandLogo />
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              The AI study buddy for notes, quizzes, flashcards, planning and progress.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Product</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>AI Chat</li>
              <li>Quiz Generator</li>
              <li>Study Planner</li>
              <li>Flashcards</li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Company</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>About</li>
              <li>Privacy</li>
              <li>Terms</li>
              <li>support@studyspark.ai</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
          © 2026 StudySpark AI. Built for curious students.
        </div>
      </footer>
    </div>
  );
}
