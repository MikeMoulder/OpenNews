"use client";

import type { Article } from "@/lib/types";

interface Props {
  article: Article;
  onGenerateReport: (article: Article) => void;
  isGenerating: boolean;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  return `${Math.floor(hours / 24)}d`;
}

export default function NewsCard({ article, onGenerateReport, isGenerating }: Props) {
  const positiveVotes = article.votes.positive ?? 0;
  const negativeVotes = article.votes.negative ?? 0;

  return (
    <div className="group grid grid-cols-1 sm:grid-cols-[72px_100px_1fr_140px_72px] gap-x-4 items-center px-3 py-2.5 hover:bg-zinc-50 dark:hover:bg-zinc-900/60 transition-colors">
      {/* Time */}
      <span className="hidden sm:block font-mono text-xs text-[var(--text-muted)] tabular-nums">
        {timeAgo(article.published_at)}
      </span>

      {/* Source */}
      <span className="hidden sm:block font-mono text-xs font-medium text-[var(--text-secondary)] truncate">
        {article.source}
      </span>

      {/* Title + mobile meta */}
      <div className="min-w-0">
        <div className="sm:hidden flex items-center gap-2 mb-1 font-mono text-[11px] text-[var(--text-muted)]">
          <span>{article.source}</span>
          <span>&middot;</span>
          <span className="tabular-nums">{timeAgo(article.published_at)}</span>
          {(positiveVotes > 0 || negativeVotes > 0) && (
            <>
              <span>&middot;</span>
              {positiveVotes > 0 && <span className="text-[var(--accent-green)]">+{positiveVotes}</span>}
              {negativeVotes > 0 && <span className="text-[var(--accent-red)]">-{negativeVotes}</span>}
            </>
          )}
        </div>
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-zinc-900 dark:text-zinc-100 font-medium leading-snug hover:text-[var(--accent-green)] transition-colors line-clamp-1"
        >
          {article.title}
        </a>
      </div>

      {/* Tickers */}
      <div className="hidden sm:flex items-center gap-1.5 overflow-hidden">
        {article.currencies.slice(0, 4).map((c) => (
          <span
            key={c}
            className="font-mono text-[11px] font-medium text-[var(--accent-amber)] whitespace-nowrap"
          >
            {c}
          </span>
        ))}
        {article.currencies.length > 4 && (
          <span className="font-mono text-[11px] text-[var(--text-muted)]">
            +{article.currencies.length - 4}
          </span>
        )}
      </div>

      {/* Verify action */}
      <div className="hidden sm:flex justify-end">
        <button
          onClick={() => onGenerateReport(article)}
          disabled={isGenerating}
          className="font-mono text-xs font-medium text-[var(--accent-green)] hover:underline disabled:text-[var(--text-muted)] disabled:no-underline transition-colors"
        >
          {isGenerating ? "..." : "VERIFY"}
        </button>
      </div>

      {/* Mobile bottom row: tickers + verify */}
      <div className="sm:hidden flex items-center justify-between mt-1.5">
        <div className="flex items-center gap-1.5">
          {article.currencies.slice(0, 4).map((c) => (
            <span
              key={c}
              className="font-mono text-[11px] font-medium text-[var(--accent-amber)]"
            >
              {c}
            </span>
          ))}
          {article.currencies.length > 4 && (
            <span className="font-mono text-[11px] text-[var(--text-muted)]">
              +{article.currencies.length - 4}
            </span>
          )}
        </div>
        <button
          onClick={() => onGenerateReport(article)}
          disabled={isGenerating}
          className="font-mono text-xs font-medium text-[var(--accent-green)] hover:underline disabled:text-[var(--text-muted)] disabled:no-underline transition-colors"
        >
          {isGenerating ? "..." : "VERIFY"}
        </button>
      </div>
    </div>
  );
}
