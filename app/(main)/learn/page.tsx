"use client";

// Layout is now in root layout.tsx
import { BookOpen, TrendingUp, Shield, AlertTriangle } from "lucide-react";

export default function LearnPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Learn
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Sports betting glossary and responsible gaming information
          </p>
        </div>

        {/* Responsible Gaming Notice */}
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            <div>
              <h2 className="font-semibold text-yellow-900 dark:text-yellow-100">
                Analytics Only - No Real Wagering
              </h2>
              <p className="mt-2 text-sm text-yellow-800 dark:text-yellow-200">
                This platform is for analytics and simulated pick tracking only.
                We do not facilitate real money betting, deposits, withdrawals,
                or any form of wagering.
              </p>
            </div>
          </div>
        </div>

        {/* Glossary */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-6 flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Sports Betting Glossary
            </h2>
          </div>

          <div className="space-y-6">
            <GlossaryItem
              term="Moneyline"
              definition="A straight-up bet on which team will win the game. Favorites have negative odds (e.g., -150), underdogs have positive odds (e.g., +130)."
            />
            <GlossaryItem
              term="Point Spread"
              definition="A handicap given to the favorite. The favorite must win by more than the spread, while the underdog can lose by less than the spread or win outright."
            />
            <GlossaryItem
              term="Total (Over/Under)"
              definition="A bet on whether the combined score of both teams will be over or under a specified number."
            />
            <GlossaryItem
              term="American Odds"
              definition="Odds format showing how much you need to bet to win $100 (negative odds) or how much you win for every $100 bet (positive odds)."
            />
            <GlossaryItem
              term="Units"
              definition="A standardized betting amount used to track performance. Typically 1 unit = 1% of your bankroll."
            />
            <GlossaryItem
              term="ROI (Return on Investment)"
              definition="The percentage return on your total wagered amount. Calculated as (Profit / Total Wagered) × 100."
            />
            <GlossaryItem
              term="Line Movement"
              definition="Changes in odds or point spreads over time, often due to betting volume or new information."
            />
            <GlossaryItem
              term="Sharp"
              definition="A professional or highly skilled bettor who often moves betting lines with large, well-informed wagers."
            />
          </div>
        </div>

        {/* Responsible Gaming */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <div className="mb-6 flex items-center gap-3">
            <Shield className="h-6 w-6 text-green-600 dark:text-green-400" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Responsible Gaming
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Age Requirement
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                You must be 21 or older to use this platform. Age verification
                is required to access odds and create picks.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Set Limits
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Use our time limit and break reminder features to manage your
                usage. Set daily and session time limits in your settings.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                Cooldown Periods
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                If you need a break, you can set a cooldown period that will
                prevent you from creating new picks until it expires.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">
                This is Analytics Only
              </h3>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Remember: This platform is for educational and analytical
                purposes only. No real money is involved. We do not facilitate
                gambling in any form.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function GlossaryItem({
  term,
  definition,
}: {
  term: string;
  definition: string;
}) {
  return (
    <div className="border-b border-gray-200 pb-4 last:border-0 dark:border-gray-700">
      <dt className="font-semibold text-gray-900 dark:text-white">{term}</dt>
      <dd className="mt-2 text-gray-600 dark:text-gray-400">{definition}</dd>
    </div>
  );
}
