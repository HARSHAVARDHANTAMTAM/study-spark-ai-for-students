import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Award, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { achievements, certificates } from "@/lib/mock-data";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/dashboard/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    college: user?.college ?? "",
    branch: user?.branch ?? "",
    semester: user?.semester ?? "",
  });

  const initials = form.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Your student details, achievements and certificates.
        </p>
      </header>

      <Card className="rounded-2xl border-border/60 shadow-card">
        <CardContent className="grid gap-4 p-5 sm:grid-cols-2">
          <div className="flex items-center gap-4 sm:col-span-2">
            <Avatar className="size-16 border border-border">
              <AvatarFallback className="gradient-brand text-lg font-semibold text-primary-foreground">
                {initials || "SA"}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold">{form.name}</p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <GraduationCap className="size-3.5" /> {form.branch}
              </p>
            </div>
          </div>

          {(
            [
              ["name", "Full name"],
              ["email", "Email"],
              ["college", "College"],
              ["branch", "Branch"],
              ["semester", "Semester"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-2">
              <Label htmlFor={key}>{label}</Label>
              <Input
                id={key}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                className="h-11 rounded-xl"
              />
            </div>
          ))}

          <Button
            onClick={() => {
              updateUser(form);
              toast.success("Profile updated");
            }}
            className="h-11 rounded-xl gradient-brand shadow-glow sm:col-span-2"
          >
            Save changes
          </Button>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="rounded-2xl border-border/60 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Achievements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {achievements.map((a) => (
              <div key={a.title} className="flex items-start gap-3 rounded-xl border border-border/60 p-3">
                <Award className="mt-0.5 size-4 shrink-0 text-primary" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.detail}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60 shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Certificates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {certificates.map((c) => (
              <div key={c.title} className="rounded-xl border border-border/60 p-3">
                <p className="truncate text-sm font-medium">{c.title}</p>
                <p className="text-xs text-muted-foreground">
                  {c.issuer} · {c.date}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}