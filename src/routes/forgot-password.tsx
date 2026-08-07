import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2, MailCheck } from "lucide-react";
import { toast } from "sonner";
import { AuthShell } from "@/components/site/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — StudySpark AI" },
      {
        name: "description",
        content: "Request a reset link and get back into your StudySpark AI workspace.",
      },
      { property: "og:title", content: "Reset your password — StudySpark AI" },
      { property: "og:description", content: "Recover access to your AI study workspace." },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="We'll email you a secure link to set a new one."
      footer={
        <span className="text-muted-foreground">
          Remembered it?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Back to log in
          </Link>
        </span>
      }
    >
      {sent ? (
        <div className="py-4 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-accent text-accent-foreground">
            <MailCheck className="size-6" />
          </span>
          <h2 className="mt-4 text-lg font-semibold">Check your inbox</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            If <span className="font-medium text-foreground">{email}</span> is registered, a reset
            link is on its way.
          </p>
          <Button
            variant="outline"
            className="mt-6 rounded-xl"
            onClick={() => {
              setSent(false);
              setEmail("");
            }}
          >
            Use a different email
          </Button>
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (!email) {
              toast.error("Enter your email address");
              return;
            }
            setLoading(true);
            setTimeout(() => {
              setLoading(false);
              setSent(true);
              toast.success("Reset link sent");
            }, 800);
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@college.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-xl bg-card"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="h-11 w-full rounded-xl gradient-brand shadow-glow"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Send reset link"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}