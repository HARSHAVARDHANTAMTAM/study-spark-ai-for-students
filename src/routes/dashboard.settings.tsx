import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/dashboard/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const [prefs, setPrefs] = useState({
    reminders: true,
    weeklyDigest: true,
    aiSuggestions: true,
    darkMode: false,
  });

  const toggle = (key: keyof typeof prefs) => (value: boolean) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
    if (key === "darkMode") {
      document.documentElement.classList.toggle("dark", value);
    }
  };

  const rows: { key: keyof typeof prefs; title: string; detail: string }[] = [
    { key: "reminders", title: "Study reminders", detail: "Daily nudge to keep your streak alive" },
    { key: "weeklyDigest", title: "Weekly digest", detail: "A Sunday email with your progress" },
    { key: "aiSuggestions", title: "AI suggestions", detail: "Let AI recommend what to revise next" },
    { key: "darkMode", title: "Dark mode", detail: "Easier on the eyes for late-night revision" },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Tune notifications, appearance and AI behaviour.
        </p>
      </header>

      <Card className="rounded-2xl border-border/60 shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1">
          {rows.map((row) => (
            <div
              key={row.key}
              className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-xl p-3 hover:bg-accent/50"
            >
              <div className="min-w-0">
                <Label className="text-sm font-medium">{row.title}</Label>
                <p className="text-xs text-muted-foreground">{row.detail}</p>
              </div>
              <Switch checked={prefs[row.key]} onCheckedChange={toggle(row.key)} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-border/60 shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Data</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="rounded-xl"
            onClick={() => toast.success("Export started — you'll get an email shortly")}
          >
            Export my data
          </Button>
          <Button
            variant="outline"
            className="rounded-xl text-destructive"
            onClick={() => toast.success("Account deletion is disabled in this demo")}
          >
            Delete account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}