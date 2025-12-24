import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sports AI - Analytics & Pick Tracking",
  description:
    "Desktop-first sports analytics and simulated pick tracking platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

