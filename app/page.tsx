import AppLayout from "@/components/layout/AppLayout";
import { TrendingUp, Target, BarChart3, Trophy } from "lucide-react";

export default function Home() {
  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Welcome to Sports AI - Your analytics and pick tracking platform
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Picks"
            value="0"
            icon={Target}
            color="blue"
          />
          <StatCard
            title="Win Rate"
            value="0%"
            icon={TrendingUp}
            color="green"
          />
          <StatCard
            title="Analytics"
            value="Ready"
            icon={BarChart3}
            color="purple"
          />
          <StatCard
            title="Performance"
            value="N/A"
            icon={Trophy}
            color="yellow"
          />
        </div>

        {/* Info Card */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-6 dark:border-blue-800 dark:bg-blue-900/20">
          <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">
            Welcome to Sports AI
          </h2>
          <p className="mt-2 text-blue-800 dark:text-blue-200">
            This is a desktop-first analytics and simulated pick tracking
            platform. No real betting, deposits, or withdrawals - analytics
            only.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-800 dark:text-blue-100">
              Analytics
            </span>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-800 dark:text-blue-100">
              Pick Tracking
            </span>
            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800 dark:bg-blue-800 dark:text-blue-100">
              Performance Metrics
            </span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ActionButton title="View Analytics" href="/analytics" />
            <ActionButton title="Track Picks" href="/picks" />
            <ActionButton title="Check Performance" href="/performance" />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: any;
  color: "blue" | "green" | "purple" | "yellow";
}) {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    green:
      "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    purple:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    yellow:
      "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}

function ActionButton({ title, href }: { title: string; href: string }) {
  return (
    <a
      href={href}
      className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-center font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
    >
      {title}
    </a>
  );
}

