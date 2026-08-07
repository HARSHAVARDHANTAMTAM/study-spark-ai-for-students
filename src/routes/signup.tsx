import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthShell, GoogleButton } from "@/components/site/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your account — StudySpark AI" },
      {
        name: "description",
        content: "Sign up free and turn your notes into explanations, quizzes and study plans.",
      },
      { property: "og:title", content: "Create your account — StudySpark AI" },
      {
        property: "og:description",
        content: "Start learning smarter with your personal AI study buddy.",
      },
    ],
  }),
  component: SignupPage,
});

function SignupPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const enter = (email: string, name?: string) => {
    setLoading(true);
    setTimeout(() => {
      signIn(email, name);
      toast.success("Account created — welcome to StudySpark AI!");
      navigate({ to: "/dashboard" });
    }, 800);
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Free to start. No credit card, no setup."
      footer={
        <span className="text-muted-foreground">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Log in
          </Link>
        </span>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.name || !form.email || form.password.length < 6) {
            toast.error("Fill every field (password needs 6+ characters)");
            return;
          }
          enter(form.email, form.name);
        }}
      >
        <div className="space-y-2">
          <Label htmlFor="name">Full name</Label>
          <Input
            id="name"
            placeholder="Aarav Sharma"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="h-11 rounded-xl bg-card"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@college.edu"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="h-11 rounded-xl bg-card"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="At least 6 characters"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="h-11 rounded-xl bg-card"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-xl gradient-brand shadow-glow"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Create account"}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>
      <GoogleButton label="Sign up with Google" onClick={() => enter("student@gmail.com")} />
    </AuthShell>
  );
}