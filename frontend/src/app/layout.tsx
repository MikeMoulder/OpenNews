import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "OpenNews",
  description:
    "AI-generated, cryptographically verified crypto news reports powered by OpenGradient.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${mono.variable} font-sans min-h-screen bg-white dark:bg-[#0a0a0a] text-zinc-900 dark:text-zinc-100 antialiased`}
      >
        <ThemeProvider>
          <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-white/90 dark:bg-[#0a0a0a]/90 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-bold tracking-widest uppercase text-zinc-900 dark:text-zinc-100">
                  OpenNews
                </span>
                <span className="hidden sm:inline font-mono text-[10px] tracking-wider text-[var(--text-muted)]">
                  powered by OpenGradient
                </span>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="https://docs.opengradient.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-xs uppercase tracking-wider text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors"
                >
                  Docs
                </a>
                <ThemeToggle />
              </div>
            </div>
          </nav>

          <div className="relative">{children}</div>

          <footer className="border-t border-[var(--border)] mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
              <span className="font-mono text-xs text-[var(--text-muted)]">
                OpenNews &mdash; Verifiable AI News Analysis
              </span>
              <span className="hidden sm:inline font-mono text-[10px] text-[var(--text-muted)]">
                TEE Execution | x402 Protocol | On-Chain Receipts
              </span>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
