"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { motion } from "framer-motion";
import {
  TrendingUp,
  BarChart3,
  Shield,
  Zap,
  Target,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary via-accent to-primary/80 px-6 py-20 text-white lg:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium backdrop-blur-xl">
              <Zap className="h-4 w-4" />
              NBA Analytics Platform
            </div>

            <h1 className="mb-6 text-5xl font-bold leading-tight lg:text-7xl">
              NBA Analytics
              <br />
              <span className="text-white/90">Powered by AI</span>
            </h1>

            <p className="mx-auto mb-10 max-w-2xl text-xl text-white/80">
              Track simulated picks, analyze odds movements, and make
              data-driven decisions with real-time NBA analytics.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup">
                <Button size="lg" variant="secondary" className="gap-2 text-lg">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="gap-2 border-white/30 bg-white/10 text-lg text-white backdrop-blur-xl hover:bg-white/20"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-4xl font-bold">
              Everything you need for NBA analytics
            </h2>
            <p className="text-xl text-muted-foreground">
              Professional-grade tools for tracking and analyzing NBA games
            </p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <PremiumCard variant="gradient" className="h-full p-8">
                  <div className="mb-4 inline-flex rounded-2xl bg-primary/10 p-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </PremiumCard>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <PremiumCard variant="gradient" className="p-12 text-center">
              <h2 className="mb-4 text-4xl font-bold">Ready to get started?</h2>
              <p className="mb-8 text-xl text-muted-foreground">
                Join thousands of users making smarter decisions with data
              </p>
              <Link href="/signup">
                <Button size="lg" className="gap-2">
                  Create Free Account
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <p className="mt-6 text-sm text-muted-foreground">
                No credit card required • Analytics only • Educational purposes
              </p>
            </PremiumCard>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-sm font-bold text-white">
                S
              </div>
              <span className="text-lg font-bold">Sports AI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 Sports AI. Analytics only. Not real money betting.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: TrendingUp,
    title: "Real-time Odds",
    description:
      "Track live odds from multiple sportsbooks and identify the best lines instantly.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "AI-powered predictions and insights to help you make informed decisions.",
  },
  {
    icon: Target,
    title: "Simulated Picks",
    description:
      "Track your analytical predictions and measure performance over time.",
  },
  {
    icon: Clock,
    title: "Odds Movement",
    description:
      "Visualize how odds change over time with interactive charts and alerts.",
  },
  {
    icon: Shield,
    title: "Responsible Use",
    description:
      "Built-in guardrails and educational focus for responsible analytics.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Optimized performance with real-time updates and instant data access.",
  },
];
