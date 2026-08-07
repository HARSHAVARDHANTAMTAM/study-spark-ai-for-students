import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { AuthShell, GoogleButton } from "@/components/site/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — StudySpark AI" },
      { name: "description", content: "Log in to your StudySpark AI study workspace." },
      { property: "og:title", content: "Log in — StudySpark AI" },
      { property: "og:description", content: "Access your AI study buddy, notes and quizzes." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const enter = (mail: string) => {
    setLoading(true);
    setTimeout(() => {
      signIn(mail);
      toast.success("Welcome back to StudySpark AI");
      navigate({ to: "/dashboard" });
    }, 700);
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue your revision streak."
      footer={
        <span className="text-muted-foreground">
          New here?{" "}
          <Link to="/signup" className="font-semibold text-primary hover:underline">
            Create an account
          </Link>
        </span>
      }
    >
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!email || !password) {
            toast.error("Enter your email and password");
            return;
          }
          enter(email);
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
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 rounded-xl bg-card"
          />
        </div>
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <Checkbox defaultChecked /> Remember me
          </label>
          <Link to="/forgot-password" className="font-medium text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-xl gradient-brand shadow-glow"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Log in"}
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
      </div>
      <GoogleButton
        label="Continue with Google"
        onClick={() => enter("student@gmail.com")}
      />
    </AuthShell>
  );
}