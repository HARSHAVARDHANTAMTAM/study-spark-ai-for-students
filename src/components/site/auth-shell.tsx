import { Link } from "@tanstack/react-router";
import { CheckCircle2 } from "lucide-react";
import { AuroraBackdrop, BrandLogo } from "./brand";

const highlights = [
  "Upload notes and get instant explanations",
  "AI quizzes with timer and scoring",
  "Personalized day-by-day revision plans",
  "Progress charts, streaks and weak areas",
];

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative grid min-h-screen bg-background lg:grid-cols-2">
      <AuroraBackdrop />

      <div className="flex flex-col justify-center px-5 py-12 sm:px-10">
        <div className="mx-auto w-full max-w-md">
          <BrandLogo />
          <h1 className="mt-9 text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8 rounded-3xl border border-border/60 glass p-6 shadow-card">
            {children}
          </div>
          {footer ? <div className="mt-6 text-center text-sm">{footer}</div> : null}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>

      <div className="relative hidden items-center justify-center overflow-hidden gradient-brand p-12 lg:flex">
        <div className="max-w-sm text-primary-foreground">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] opacity-80">
            StudySpark AI
          </p>
          <h2 className="mt-4 text-4xl font-extrabold leading-tight">
            Turn your notes into a private tutor.
          </h2>
          <ul className="mt-8 space-y-4">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm opacity-95">
                <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-10 rounded-2xl bg-primary-foreground/10 p-5 text-sm backdrop-blur">
            <p className="font-semibold">“Went from 61% to 88% in one semester.”</p>
            <p className="mt-1 opacity-80">Priya N. · B.Tech CSE</p>
          </div>
        </div>
        <div className="absolute -bottom-24 -right-24 size-72 rounded-full bg-primary-foreground/10 blur-2xl animate-float" />
      </div>
    </div>
  );
}

export function GoogleButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:bg-accent"
    >
      <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
        <path
          fill="#4285F4"
          d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.4a5.5 5.5 0 0 1-2.4 3.6v3h3.9c2.3-2.1 3.6-5.2 3.6-8.7Z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.9-3c-1.1.7-2.4 1.2-4 1.2a7 7 0 0 1-6.5-4.8H1.5v3.1A11.9 11.9 0 0 0 12 24Z"
        />
        <path fill="#FBBC05" d="M5.5 14.5a7.2 7.2 0 0 1 0-4.9V6.5H1.5a12 12 0 0 0 0 11l4-3Z" />
        <path
          fill="#EA4335"
          d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.4-3.4A11.6 11.6 0 0 0 12 0 11.9 11.9 0 0 0 1.5 6.5l4 3.1A7 7 0 0 1 12 4.8Z"
        />
      </svg>
      {label}
    </button>
  );
}