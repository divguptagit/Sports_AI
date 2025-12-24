"use client";

import { useState } from "react";
// Layout is now in root layout.tsx
import { Button } from "@/components/ui/Button";
import { Plus, Bell, Clock } from "lucide-react";

export default function AlertsPage() {
  const [_showCreateForm, _setShowCreateForm] = useState(false);

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Alerts
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Get notified about odds movements and game start times
            </p>
          </div>
          <Button onClick={() => _setShowCreateForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Alert
          </Button>
        </div>

        {/* Info Card */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100">
            Alert Types
          </h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="flex items-start gap-3">
              <Bell className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="font-medium text-blue-900 dark:text-blue-100">
                  Odds Movement
                </div>
                <div className="mt-1 text-sm text-blue-800 dark:text-blue-200">
                  Get notified when odds move by a certain threshold (e.g., 10
                  points)
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <div>
                <div className="font-medium text-blue-900 dark:text-blue-100">
                  Game Start Reminder
                </div>
                <div className="mt-1 text-sm text-blue-800 dark:text-blue-200">
                  Reminder before a game starts (e.g., 30 minutes before)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="rounded-lg border border-gray-200 bg-white p-12 text-center dark:border-gray-700 dark:bg-gray-900">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Alert Management Coming Soon
          </h3>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Create and manage alerts for your favorite games
          </p>
        </div>
      </div>
    </div>
  );
}
