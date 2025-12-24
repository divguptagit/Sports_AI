import AppLayout from "@/components/layout/AppLayout";

export default function PicksPage() {
  return (
    <AppLayout>
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          My Picks
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Track your simulated picks
        </p>
      </div>
    </AppLayout>
  );
}

