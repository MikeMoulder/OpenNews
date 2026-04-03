"use client";

import { useEffect, useRef } from "react";
import type { ReportResponse, Verdict, MarketImpact } from "@/lib/types";

const VERDICT_CONFIG: Record<Verdict, { label: string; color: string; dot: string }> = {
  noise: {
    label: "NOISE",
    color: "text-zinc-500 dark:text-zinc-400",
    dot: "bg-zinc-400",
  },
  watch: {
    label: "WATCH",
    color: "text-[var(--accent-amber)]",
    dot: "bg-[var(--accent-amber)]",
  },
  important: {
    label: "IMPORTANT",
    color: "text-orange-600 dark:text-orange-400",
    dot: "bg-orange-500",
  },
  high_impact: {
    label: "HIGH IMPACT",
    color: "text-[var(--accent-red)]",
    dot: "bg-[var(--accent-red)]",
  },
};

const IMPACT_CONFIG: Record<MarketImpact, { label: string; color: string; dot: string }> = {
  bullish: {
    label: "BULLISH",
    color: "text-[var(--accent-green)]",
    dot: "bg-[var(--accent-green)]",
  },
  bearish: {
    label: "BEARISH",
    color: "text-[var(--accent-red)]",
    dot: "bg-[var(--accent-red)]",
  },
  neutral: {
    label: "NEUTRAL",
    color: "text-zinc-500 dark:text-zinc-400",
    dot: "bg-zinc-400",
  },
};

interface Props {
  report: ReportResponse;
  onClose: () => void;
}

export default function ReportModal({ report, onClose }: Props) {
  const { report: r, receipt, article } = report;
  const verdict = VERDICT_CONFIG[r.verdict] ?? VERDICT_CONFIG.noise;
  const impact = IMPACT_CONFIG[r.market_impact] ?? IMPACT_CONFIG.neutral;
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/70 animate-fade-in"
      onClick={(e) => {
        if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
          onClose();
        }
      }}
    >
      <div
        ref={panelRef}
        className="w-full max-w-2xl bg-white dark:bg-[#111113] border border-[var(--border)] rounded shadow-lg overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-[var(--border)]">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--accent-green)] block mb-2">
                Verified Report
              </span>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-zinc-900 dark:text-zinc-100 hover:text-[var(--accent-green)] transition-colors line-clamp-2 font-medium leading-snug"
              >
                {article.title}
              </a>
              <p className="font-mono text-[11px] text-[var(--text-muted)] mt-1.5">
                {article.source} &middot;{" "}
                {new Date(article.published_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close report"
              className="shrink-0 w-7 h-7 flex items-center justify-center rounded text-[var(--text-muted)] hover:text-zinc-900 dark:hover:text-white transition-colors"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 px-5 py-5 space-y-5">
          {/* Status indicators */}
          <div className="flex items-center gap-4 font-mono text-xs">
            <span className="inline-flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${verdict.dot}`} />
              <span className={`uppercase tracking-wider ${verdict.color}`}>{verdict.label}</span>
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${impact.dot}`} />
              <span className={`uppercase tracking-wider ${impact.color}`}>{impact.label}</span>
            </span>
            <span className="text-[var(--text-muted)] uppercase tracking-wider">
              Confidence {r.confidence}%
            </span>
          </div>

          {/* Summary */}
          <Section title="Summary">
            <p className="text-sm text-[var(--text-secondary)] dark:text-zinc-300 leading-relaxed">
              {r.summary}
            </p>
          </Section>

          {/* Market Impact */}
          <Section title="Market Impact">
            <p className="text-sm text-[var(--text-secondary)] dark:text-zinc-300 leading-relaxed">
              {r.impact_reason}
            </p>
          </Section>

          {/* Key Claims */}
          <Section title="Key Claims">
            <ol className="space-y-2">
              {r.key_claims.map((claim, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm text-[var(--text-secondary)] dark:text-zinc-300"
                >
                  <span className="shrink-0 font-mono text-xs text-[var(--text-muted)] tabular-nums pt-0.5">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  <span className="leading-relaxed">{claim}</span>
                </li>
              ))}
            </ol>
          </Section>

          {/* Uncertainty */}
          <Section title="Uncertainty / Gaps">
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              {r.uncertainty}
            </p>
          </Section>

          {/* Verdict */}
          <Section title="Verdict">
            <p className="text-sm text-[var(--text-secondary)] dark:text-zinc-300 leading-relaxed">
              {r.verdict_reason}
            </p>
          </Section>
        </div>

        {/* Receipt footer */}
        <div className="px-5 py-3 border-t border-[var(--border)] bg-zinc-50 dark:bg-[#0a0a0a]">
          <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 font-mono text-[11px]">
            <span className="text-[var(--text-muted)] uppercase tracking-wider">Hash</span>
            <span className="text-[var(--text-secondary)] truncate" title={receipt.payment_hash}>
              {receipt.payment_hash}
            </span>
            <span className="text-[var(--text-muted)] uppercase tracking-wider">Model</span>
            <span className="text-[var(--text-secondary)]">{receipt.model}</span>
            <span className="text-[var(--text-muted)] uppercase tracking-wider">Settlement</span>
            <span className="text-[var(--accent-green)]">{receipt.settlement}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="font-mono text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-widest mb-2">
        {title}
      </h3>
      {children}
    </div>
  );
}
