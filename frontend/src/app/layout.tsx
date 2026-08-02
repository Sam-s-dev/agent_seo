import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "RankPilot | Your Autonomous AI SEO Employee",
  description:
    "RankPilot audits your WordPress site, researches profitable keywords, writes top-tier articles, and auto-publishes them. Stop paying $3,000/month for agencies.",
  keywords: [
    "SEO",
    "AI Agent",
    "WordPress Automation",
    "Keyword Research",
    "Content Writing AI",
    "RankPilot",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
