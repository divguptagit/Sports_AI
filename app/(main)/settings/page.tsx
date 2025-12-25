"use client";

import { useState } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  Shield,
  Clock,
  Bell,
  CheckCircle,
  Sun,
  Moon,
  Monitor,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [ageVerified, setAgeVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldownHours, setCooldownHours] = useState("");
  const [settingCooldown, setSettingCooldown] = useState(false);

  const handleAgeVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setVerifying(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      dateOfBirth: formData.get("dateOfBirth"),
      agreedToTerms: formData.get("agreedToTerms") === "on",
    };

    try {
      const response = await fetch("/api/responsible/verify-age", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        alert(error.error?.message || "Verification failed");
        return;
      }

      setAgeVerified(true);
    } catch (_error) {
      alert("Failed to verify age");
    } finally {
      setVerifying(false);
    }
  };

  const handleCooldownSet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSettingCooldown(true);

    try {
      // TODO: Implement cooldown API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      alert(`Cooldown set for ${cooldownHours} hours`);
      setCooldownHours("");
    } catch (_error) {
      alert("Failed to set cooldown");
    } finally {
      setSettingCooldown(false);
    }
  };

  const handleReminderSettings = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      dailyReminderEnabled: formData.get("dailyReminderEnabled") === "on",
      reminderTime: formData.get("reminderTime"),
    };

    try {
      const response = await fetch("/api/responsible/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update settings");
      }

      alert("Reminder settings updated!");
    } catch (_error) {
      alert("Failed to update settings");
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Settings"
        description="Manage your account and responsible-use preferences"
      />

      {/* Age Verification */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Age Verification
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ageVerified ? (
            <div className="flex items-start gap-3 rounded-lg border border-success/50 bg-success/10 p-4">
              <CheckCircle className="h-5 w-5 flex-shrink-0 text-success" />
              <div className="flex-1">
                <div className="font-medium text-success-foreground">
                  Age Verified
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  You have access to view odds and create simulated picks.
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 rounded-lg border border-warning/50 bg-warning/10 p-4">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-warning" />
                <div className="flex-1">
                  <div className="font-medium text-warning-foreground">
                    Verification Required
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    You must be 21 or older to access odds and create picks.
                  </div>
                </div>
              </div>

              <form onSubmit={handleAgeVerification} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Date of Birth
                  </label>
                  <Input
                    type="date"
                    name="dateOfBirth"
                    required
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full max-w-xs"
                  />
                </div>

                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    name="agreedToTerms"
                    required
                    className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                  />
                  <label className="text-sm text-muted-foreground">
                    I confirm that I am 21 or older and agree to the terms of
                    service. I understand this platform is for analytics only
                    and does not facilitate real wagering.
                  </label>
                </div>

                <Button type="submit" loading={verifying}>
                  Verify Age
                </Button>
              </form>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Theme */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Appearance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <label className="mb-3 block text-sm font-medium">Theme</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setTheme("light")}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors",
                  theme === "light"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <Sun className="h-5 w-5" />
                <span className="text-sm font-medium">Light</span>
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors",
                  theme === "dark"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <Moon className="h-5 w-5" />
                <span className="text-sm font-medium">Dark</span>
              </button>
              <button
                onClick={() => setTheme("system")}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border-2 p-4 transition-colors",
                  theme === "system"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                )}
              >
                <Monitor className="h-5 w-5" />
                <span className="text-sm font-medium">System</span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cooldown Period */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Cooldown Period
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Set a cooldown period to temporarily prevent creating new simulated
            picks. This helps you take a break when needed.
          </p>

          <form onSubmit={handleCooldownSet} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Cooldown Duration (hours)
              </label>
              <div className="flex items-center gap-3">
                <Input
                  type="number"
                  min="1"
                  max="168"
                  value={cooldownHours}
                  onChange={(e) => setCooldownHours(e.target.value)}
                  placeholder="24"
                  className="w-32"
                  required
                />
                <span className="text-sm text-muted-foreground">
                  hours (max 7 days)
                </span>
              </div>
            </div>

            <Button type="submit" loading={settingCooldown}>
              Set Cooldown
            </Button>
          </form>

          <div className="rounded-lg border border-muted bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> During cooldown, you can still view odds
              and analytics, but cannot create new picks. Contact support if you
              need to remove a cooldown early.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Daily Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Daily Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleReminderSettings} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Set a daily reminder to help you manage your time on the platform.
            </p>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="dailyReminderEnabled"
                defaultChecked
                className="mt-1 h-4 w-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
              />
              <label className="text-sm">Enable daily reminder</label>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Reminder Time
              </label>
              <Input
                type="time"
                name="reminderTime"
                defaultValue="20:00"
                className="w-48"
              />
              <p className="mt-1 text-xs text-muted-foreground">
                You'll see a banner reminder at this time each day
              </p>
            </div>

            <Button type="submit">Save Reminder Settings</Button>
          </form>
        </CardContent>
      </Card>

      {/* Responsible Use Notice */}
      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 flex-shrink-0 text-warning" />
            <div className="space-y-2 text-sm">
              <p className="font-medium text-warning-foreground">
                Analytics Only Platform
              </p>
              <p className="text-muted-foreground">
                This platform is for educational and analytical purposes only.
                We do not facilitate real money betting, deposits, withdrawals,
                or any form of gambling. All picks are simulated for tracking
                analytical predictions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
