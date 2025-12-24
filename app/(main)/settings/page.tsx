"use client";

import { useState } from "react";
// Layout is now in root layout.tsx
import { Button } from "@/components/ui/Button";
import { Shield, Clock, Bell, CheckCircle } from "lucide-react";

export default function SettingsPage() {
  const [ageVerified, setAgeVerified] = useState(false);
  const [verifying, setVerifying] = useState(false);

  async function handleAgeVerification(e: React.FormEvent<HTMLFormElement>) {
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
      alert("Age verified successfully!");
    } catch (error) {
      alert("Failed to verify age");
    } finally {
      setVerifying(false);
    }
  }

  async function handleSettingsUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      dailyTimeLimit: formData.get("dailyTimeLimit")
        ? parseInt(formData.get("dailyTimeLimit") as string)
        : undefined,
      sessionTimeLimit: formData.get("sessionTimeLimit")
        ? parseInt(formData.get("sessionTimeLimit") as string)
        : undefined,
      enableBreakReminders: formData.get("enableBreakReminders") === "on",
      breakReminderInterval: formData.get("breakReminderInterval")
        ? parseInt(formData.get("breakReminderInterval") as string)
        : undefined,
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

      alert("Settings updated successfully!");
    } catch (error) {
      alert("Failed to update settings");
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Manage your account and responsible gaming settings
          </p>
        </div>

        {/* Age Verification */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-3">
            <Shield className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Age Verification
            </h2>
          </div>

          {ageVerified ? (
            <div className="flex items-center gap-3 rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <div className="font-medium text-green-900 dark:text-green-100">
                  Age Verified
                </div>
                <div className="text-sm text-green-800 dark:text-green-200">
                  You have access to all features
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleAgeVerification} className="space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                You must be 21 or older to access odds and create picks.
              </p>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  required
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                />
              </div>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="agreedToTerms"
                  required
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                />
                <label className="text-sm text-gray-700 dark:text-gray-300">
                  I confirm that I am 21 or older and agree to the terms of
                  service. I understand this platform is for analytics only and
                  does not facilitate real wagering.
                </label>
              </div>

              <Button type="submit" loading={verifying}>
                Verify Age
              </Button>
            </form>
          )}
        </div>

        {/* Time Limits */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-3">
            <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Time Limits
            </h2>
          </div>

          <form onSubmit={handleSettingsUpdate} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Daily Time Limit (minutes)
              </label>
              <input
                type="number"
                name="dailyTimeLimit"
                min="0"
                max="1440"
                placeholder="120"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Maximum time per day (0-1440 minutes)
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Session Time Limit (minutes)
              </label>
              <input
                type="number"
                name="sessionTimeLimit"
                min="0"
                max="480"
                placeholder="60"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Maximum time per session (0-480 minutes)
              </p>
            </div>

            <Button type="submit">Save Time Limits</Button>
          </form>
        </div>

        {/* Break Reminders */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-4 flex items-center gap-3">
            <Bell className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Break Reminders
            </h2>
          </div>

          <form onSubmit={handleSettingsUpdate} className="space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                name="enableBreakReminders"
                defaultChecked
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">
                Enable break reminders
              </label>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                Reminder Interval (minutes)
              </label>
              <input
                type="number"
                name="breakReminderInterval"
                min="15"
                max="120"
                defaultValue="30"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                How often to show break reminders (15-120 minutes)
              </p>
            </div>

            <Button type="submit">Save Reminder Settings</Button>
          </form>
        </div>

        {/* Cooldown */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Cooldown Period
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            If you need a break, you can set a cooldown period that will prevent
            you from creating new picks. Contact support to set up a cooldown.
          </p>
        </div>
      </div>
    </div>
  );
}
