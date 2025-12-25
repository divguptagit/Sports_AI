import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ToastProvider } from "@/components/providers/ToastProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { TopBar } from "@/components/layout/TopBar";
import { Sidebar } from "@/components/layout/Sidebar";
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Sports AI - NFL & NBA Analytics",
  description:
    "Desktop-first analytics and simulated pick tracking for NFL and NBA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <ThemeProvider defaultTheme="system">
          <ErrorBoundary>
            <ToastProvider />
            <KeyboardShortcuts />
            <div className="relative flex min-h-screen flex-col">
              <TopBar />
              <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 overflow-y-auto">
                  <div className="container mx-auto max-w-7xl p-6 lg:p-8">
                    {children}
                  </div>
                </main>
              </div>
            </div>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}
