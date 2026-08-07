import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { AuroraBackdrop, BrandLogo } from "@/components/site/brand";

export function AuthProviderGate({ children }: { children: React.ReactNode }) {
  const { user, ready } = useAuth();

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative grid min-h-screen place-items-center bg-background px-4">
        <AuroraBackdrop />
        <div className="w-full max-w-sm rounded-3xl border border-border/60 glass p-8 text-center shadow-card">
          <div className="flex justify-center">
            <BrandLogo />
          </div>
          <h1 className="mt-6 text-xl font-semibold">Log in to open your workspace</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your notes, quizzes and study plan are waiting behind the door.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Button asChild className="h-11 rounded-xl gradient-brand shadow-glow">
              <Link to="/login">Log in</Link>
            </Button>
            <Button asChild variant="outline" className="h-11 rounded-xl">
              <Link to="/signup">Create an account</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}