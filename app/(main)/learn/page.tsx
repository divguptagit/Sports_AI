"use client";

import { useState, useMemo } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Input } from "@/components/ui/Input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  BookOpen,
  Shield,
  AlertTriangle,
  Search,
  ExternalLink,
} from "lucide-react";

interface GlossaryTerm {
  term: string;
  definition: string;
  category: "basics" | "advanced" | "analytics";
}

const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Moneyline",
    definition:
      "A straight-up bet on which team will win the game. Favorites have negative odds (e.g., -150 means bet $150 to win $100), underdogs have positive odds (e.g., +130 means bet $100 to win $130).",
    category: "basics",
  },
  {
    term: "Point Spread",
    definition:
      "A handicap given to the favorite team. The favorite must win by more than the spread, while the underdog can lose by less than the spread or win outright. Example: -7.5 means the favorite must win by 8+ points.",
    category: "basics",
  },
  {
    term: "Total (Over/Under)",
    definition:
      "A bet on whether the combined score of both teams will be over or under a specified number. Example: O/U 215.5 means betting whether total points will be over or under 215.5.",
    category: "basics",
  },
  {
    term: "American Odds",
    definition:
      "Odds format showing how much you need to bet to win $100 (negative odds) or how much you win for every $100 bet (positive odds). Used primarily in the United States.",
    category: "basics",
  },
  {
    term: "Implied Probability",
    definition:
      "The probability of an outcome as suggested by the betting odds. Calculated from American odds to show the bookmaker's assessment of likelihood. Example: -150 odds = 60% implied probability.",
    category: "analytics",
  },
  {
    term: "Vig (Vigorish)",
    definition:
      "The bookmaker's commission built into the odds. Also called 'juice'. This is how sportsbooks make money. Removing the vig shows the 'true' probability of outcomes.",
    category: "analytics",
  },
  {
    term: "Line Movement",
    definition:
      "Changes in odds or point spreads over time, often due to betting volume, injury news, or other information. Sharp bettors watch line movement for insights.",
    category: "advanced",
  },
  {
    term: "Edge",
    definition:
      "The advantage a bettor has over the bookmaker's odds. Calculated as the difference between your estimated probability and the implied probability. Positive edge suggests value.",
    category: "analytics",
  },
  {
    term: "Units",
    definition:
      "A standardized betting amount used to track performance consistently. Typically 1 unit = 1% of your bankroll. This allows for consistent comparison across different stake sizes.",
    category: "basics",
  },
  {
    term: "ROI (Return on Investment)",
    definition:
      "The percentage return on your total wagered amount. Calculated as (Profit / Total Wagered) × 100. A positive ROI indicates profitable performance over time.",
    category: "analytics",
  },
  {
    term: "Sharp",
    definition:
      "A professional or highly skilled bettor who often moves betting lines with large, well-informed wagers. Sharp money is considered more reliable than public betting.",
    category: "advanced",
  },
  {
    term: "Closing Line Value (CLV)",
    definition:
      "The difference between the odds you got and the closing odds (final odds before game starts). Consistently beating the closing line is a strong indicator of skill.",
    category: "advanced",
  },
  {
    term: "Bankroll Management",
    definition:
      "The practice of managing your betting funds to minimize risk of ruin. Common strategies include flat betting (same amount each bet) or percentage-based betting.",
    category: "advanced",
  },
  {
    term: "Push",
    definition:
      "When a bet results in a tie, typically on point spreads or totals that land exactly on the number. The stake is returned with no win or loss.",
    category: "basics",
  },
];

export default function LearnPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTerms = useMemo(() => {
    if (!searchQuery) return glossaryTerms;
    const query = searchQuery.toLowerCase();
    return glossaryTerms.filter(
      (term) =>
        term.term.toLowerCase().includes(query) ||
        term.definition.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "basics":
        return "Basics";
      case "advanced":
        return "Advanced";
      case "analytics":
        return "Analytics";
      default:
        return category;
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Learn"
        description="Sports betting glossary and responsible-use information"
      />

      {/* Responsible Use Notice */}
      <Card className="border-warning/50 bg-warning/5">
        <CardContent className="p-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-6 w-6 flex-shrink-0 text-warning" />
            <div className="space-y-2">
              <h3 className="font-semibold text-warning-foreground">
                Analytics Only - No Real Wagering
              </h3>
              <p className="text-sm text-muted-foreground">
                This platform is for educational and analytical purposes only.
                We do not facilitate real money betting, deposits, withdrawals,
                or any form of gambling. All picks are simulated for tracking
                analytical predictions.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Glossary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Sports Betting Glossary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9"
            />
          </div>

          {/* Terms List */}
          <div className="space-y-4">
            {filteredTerms.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No terms found matching "{searchQuery}"
              </p>
            ) : (
              filteredTerms.map((item, index) => (
                <div
                  key={index}
                  className="border-b border-border pb-4 last:border-0"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <dt className="font-semibold">{item.term}</dt>
                      <dd className="mt-2 text-sm text-muted-foreground">
                        {item.definition}
                      </dd>
                    </div>
                    <span className="flex-shrink-0 rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium">
                      {getCategoryLabel(item.category)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Responsible Gaming */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Responsible Use Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold">Age Requirement</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You must be 21 or older to use this platform. Age verification is
              required to access odds and create simulated picks.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Set Personal Limits</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Use our cooldown and reminder features to manage your time on the
              platform. Set a cooldown period in Settings to temporarily prevent
              creating new picks if you need a break.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">This is Analytics Only</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Remember: This platform is for educational and analytical purposes
              only. No real money is involved. We do not facilitate gambling in
              any form. All picks are simulated for tracking analytical
              predictions.
            </p>
          </div>

          <div>
            <h3 className="font-semibold">Help Resources</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              If you or someone you know has a gambling problem, help is
              available:
            </p>
            <div className="mt-3 space-y-2">
              <a
                href="https://www.ncpgambling.org"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                National Council on Problem Gambling
                <ExternalLink className="h-3 w-3" />
              </a>
              <a
                href="tel:1-800-522-4700"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                Call 1-800-522-4700 (National Helpline)
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          <div className="rounded-lg border border-muted bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Disclaimer:</strong> The information provided on this
              platform is for educational purposes only and should not be
              considered financial or betting advice. Always do your own
              research and make informed decisions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
