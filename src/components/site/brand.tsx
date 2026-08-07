import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";

export function BrandMark({ className = "" }: { className?: string }) {
  return (
    <span
      className={`grid size-9 shrink-0 place-items-center rounded-xl gradient-brand text-primary-foreground shadow-glow ${className}`}
    >
      <GraduationCap className="size-5" strokeWidth={2.2} />
    </span>
  );
}

export function BrandLogo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="flex min-w-0 items-center gap-2.5">
      <BrandMark />
      <span className="truncate text-lg font-bold tracking-tight">
        StudySpark <span className="gradient-text">AI</span>
      </span>
    </Link>
  );
}

export function AuroraBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 -left-32 size-[32rem] rounded-full bg-primary/25 blur-3xl animate-blob" />
      <div className="absolute -top-24 right-[-10rem] size-[28rem] rounded-full bg-brand-violet/25 blur-3xl animate-blob [animation-delay:-6s]" />
      <div className="absolute bottom-[-14rem] left-1/3 size-[30rem] rounded-full bg-brand-sky/20 blur-3xl animate-blob [animation-delay:-11s]" />
    </div>
  );
}