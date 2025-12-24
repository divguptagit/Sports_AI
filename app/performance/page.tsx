import AppLayout from "@/components/layout/AppLayout";

export default function PerformancePage() {
  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Performance
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          View your performance metrics
        </p>
      </div>
    </AppLayout>
  );
}

