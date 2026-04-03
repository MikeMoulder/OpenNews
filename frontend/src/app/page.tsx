"use client";

import { useEffect, useState } from "react";
import { fetchNews, generateReport } from "@/lib/api";
import type { Article, ReportResponse } from "@/lib/types";
import NewsCard from "@/components/NewsCard";
import ReportModal from "@/components/ReportModal";

type Filter = "hot" | "rising" | "bullish" | "bearish";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "hot", label: "HOT" },
  { key: "rising", label: "RISING" },
  { key: "bullish", label: "BULLISH" },
  { key: "bearish", label: "BEARISH" },
];

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filter, setFilter] = useState<Filter>("hot");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  const [reportError, setReportError] = useState<string | null>(null);
  const [report, setReport] = useState<ReportResponse | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchNews(filter)
      .then(setArticles)
      .catch(() => setError("Failed to load news. Check your API token."))
      .finally(() => setLoading(false));
  }, [filter]);

  async function handleGenerateReport(article: Article) {
    setGeneratingId(article.id);
    setReportError(null);
    try {
      const result = await generateReport({
        title: article.title,
        source: article.source,
        published_at: article.published_at,
        url: article.url,
      });
      setReport(result);
    } catch (err) {
      setReportError(err instanceof Error ? err.message : "Failed to generate report");
    } finally {
      setGeneratingId(null);
    }
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-mono text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
          Crypto News Feed
        </h1>
        <span className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
          {!loading && !error && `${articles.length} results`}
        </span>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-4 mb-4 border-b border-[var(--border)]">
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`font-mono text-xs uppercase tracking-wider pb-2 border-b-2 transition-colors ${
              filter === f.key
                ? "text-[var(--accent-green)] border-[var(--accent-green)]"
                : "text-[var(--text-muted)] border-transparent hover:text-[var(--text-secondary)]"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Report generation error */}
      {reportError && (
        <div className="mb-4 px-3 py-2 border border-[var(--accent-red)]/20 rounded-sm font-mono text-xs text-[var(--accent-red)]">
          ERR: {reportError}
        </div>
      )}

      {/* Table header */}
      <div className="hidden sm:grid grid-cols-[72px_100px_1fr_140px_72px] gap-x-4 px-3 py-2 border-b border-[var(--border)] font-mono text-[10px] uppercase tracking-widest text-[var(--text-muted)]">
        <span>Time</span>
        <span>Source</span>
        <span>Headline</span>
        <span>Tickers</span>
        <span className="text-right">Action</span>
      </div>

      {/* News list */}
      {loading ? (
        <div className="divide-y divide-[var(--border)]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton h-10" />
          ))}
        </div>
      ) : error ? (
        <div className="py-16 text-center font-mono text-xs text-[var(--accent-red)]">
          ERR: {error}
        </div>
      ) : articles.length === 0 ? (
        <div className="py-16 text-center font-mono text-xs text-[var(--text-muted)]">
          -- No articles found --
        </div>
      ) : (
        <div className="divide-y divide-[var(--border)]">
          {articles.map((article) => (
            <NewsCard
              key={article.id}
              article={article}
              onGenerateReport={handleGenerateReport}
              isGenerating={generatingId === article.id}
            />
          ))}
        </div>
      )}

      {report && <ReportModal report={report} onClose={() => setReport(null)} />}
    </main>
  );
}
