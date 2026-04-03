"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { fetchNews, generateReport } from "@/lib/api";
import type { Article, ReportResponse } from "@/lib/types";
import NewsCard from "@/components/NewsCard";
import ReportModal from "@/components/ReportModal";
import { useToast, ToastContainer } from "@/components/Toast";

type Filter = "hot" | "rising" | "bullish" | "bearish";

const FILTERS: { key: Filter; label: string }[] = [
  { key: "hot", label: "HOT" },
  { key: "rising", label: "RISING" },
  { key: "bullish", label: "BULLISH" },
  { key: "bearish", label: "BEARISH" },
];

const PAGE_SIZE = 20;
const AUTO_REFRESH_INTERVAL = 60_000; // 60 seconds

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filter, setFilter] = useState<Filter>("hot");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  const [report, setReport] = useState<ReportResponse | null>(null);
  const [page, setPage] = useState(0);
  const [tickerSearch, setTickerSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [countdown, setCountdown] = useState(AUTO_REFRESH_INTERVAL / 1000);
  const lastRefreshRef = useRef(Date.now());
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { toasts, addToast, dismiss } = useToast();

  const loadNews = useCallback(
    (silent = false) => {
      if (!silent) setLoading(true);
      setError(null);
      const currencies = tickerSearch.trim() || undefined;
      fetchNews(filter, currencies)
        .then((data) => {
          setArticles(data);
          setPage(0);
          setActiveIndex(-1);
          lastRefreshRef.current = Date.now();
          setCountdown(AUTO_REFRESH_INTERVAL / 1000);
          if (silent) addToast(`Refreshed · ${data.length} articles`, "success");
        })
        .catch(() => {
          setError("Failed to load news. Check your API token.");
          if (silent) addToast("Refresh failed", "error");
        })
        .finally(() => setLoading(false));
    },
    [filter, tickerSearch, addToast],
  );

  // Initial load + filter/search change
  useEffect(() => {
    loadNews();
  }, [loadNews]);

  // Auto-refresh countdown
  useEffect(() => {
    const tick = setInterval(() => {
      const elapsed = Math.floor((Date.now() - lastRefreshRef.current) / 1000);
      const remaining = Math.max(0, AUTO_REFRESH_INTERVAL / 1000 - elapsed);
      setCountdown(remaining);
      if (remaining === 0) {
        loadNews(true);
      }
    }, 1000);
    return () => clearInterval(tick);
  }, [loadNews]);

  const totalPages = Math.max(1, Math.ceil(articles.length / PAGE_SIZE));
  const paginatedArticles = articles.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  // Keyboard shortcuts
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      // Ignore if typing in the search input
      if (e.target === searchInputRef.current) return;
      // Ignore if report modal is open
      if (report) return;

      switch (e.key) {
        case "j":
          e.preventDefault();
          setActiveIndex((prev) => Math.min(prev + 1, paginatedArticles.length - 1));
          break;
        case "k":
          e.preventDefault();
          setActiveIndex((prev) => Math.max(prev - 1, 0));
          break;
        case "r":
          e.preventDefault();
          loadNews();
          addToast("Refreshing...", "info");
          break;
        case "/":
          e.preventDefault();
          searchInputRef.current?.focus();
          break;
        case "Enter":
          if (activeIndex >= 0 && activeIndex < paginatedArticles.length) {
            window.open(paginatedArticles[activeIndex].url, "_blank");
          }
          break;
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [paginatedArticles, activeIndex, report, loadNews, addToast]);

  async function handleGenerateReport(article: Article) {
    setGeneratingId(article.id);
    try {
      const result = await generateReport({
        title: article.title,
        source: article.source,
        published_at: article.published_at,
        url: article.url,
      });
      setReport(result);
    } catch (err) {
      addToast(err instanceof Error ? err.message : "Failed to generate report", "error");
    } finally {
      setGeneratingId(null);
    }
  }

  function handleTickerClick(ticker: string) {
    setTickerSearch(ticker);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    loadNews();
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-mono text-xs font-medium uppercase tracking-widest text-[var(--text-muted)]">
          Crypto News Feed
        </h1>
        <div className="flex items-center gap-3">
          <span className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
            {!loading && !error && `${articles.length} results${articles.length > PAGE_SIZE ? ` · ${page * PAGE_SIZE + 1}–${Math.min((page + 1) * PAGE_SIZE, articles.length)}` : ""}`}
          </span>
          <span className="font-mono text-[10px] text-[var(--text-muted)] tabular-nums opacity-60" title="Auto-refresh countdown">
            {countdown}s
          </span>
        </div>
      </div>

      {/* Ticker search */}
      <form onSubmit={handleSearchSubmit} className="mb-3">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            value={tickerSearch}
            onChange={(e) => setTickerSearch(e.target.value.toUpperCase())}
            placeholder='Filter by ticker (e.g. BTC, ETH) — press "/" to focus'
            className="w-full font-mono text-xs px-3 py-2 pr-16 bg-transparent border border-[var(--border)] rounded-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-green)] transition-colors"
          />
          {tickerSearch && (
            <button
              type="button"
              onClick={() => { setTickerSearch(""); }}
              className="absolute right-10 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
            >
              CLEAR
            </button>
          )}
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 font-mono text-[10px] text-[var(--accent-green)] hover:underline transition-colors"
          >
            GO
          </button>
        </div>
      </form>

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
        <button
          onClick={() => loadNews()}
          disabled={loading}
          title="Refresh news (r)"
          className="ml-auto mb-2 p-1 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors disabled:opacity-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={loading ? "animate-spin" : ""}
          >
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
            <path d="M21 3v5h-5" />
          </svg>
        </button>
      </div>

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
          {paginatedArticles.map((article, i) => (
            <NewsCard
              key={article.id}
              article={article}
              onGenerateReport={handleGenerateReport}
              isGenerating={generatingId === article.id}
              isActive={activeIndex === i}
              onTickerClick={handleTickerClick}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && articles.length > PAGE_SIZE && (
        <div className="flex items-center justify-between mt-4 py-3 border-t border-[var(--border)]">
          <button
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            className="font-mono text-xs uppercase tracking-wider px-3 py-1.5 border border-[var(--border)] rounded-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Prev
          </button>
          <span className="font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
            Page {page + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            className="font-mono text-xs uppercase tracking-wider px-3 py-1.5 border border-[var(--border)] rounded-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {/* Keyboard shortcuts hint */}
      <div className="hidden sm:flex items-center justify-center gap-4 mt-4 py-2 font-mono text-[10px] text-[var(--text-muted)] opacity-50">
        <span><kbd className="px-1 py-0.5 border border-[var(--border)] rounded text-[9px]">j</kbd>/<kbd className="px-1 py-0.5 border border-[var(--border)] rounded text-[9px]">k</kbd> navigate</span>
        <span><kbd className="px-1 py-0.5 border border-[var(--border)] rounded text-[9px]">r</kbd> refresh</span>
        <span><kbd className="px-1 py-0.5 border border-[var(--border)] rounded text-[9px]">/</kbd> search</span>
        <span><kbd className="px-1 py-0.5 border border-[var(--border)] rounded text-[9px]">Enter</kbd> open</span>
      </div>

      {report && <ReportModal report={report} onClose={() => setReport(null)} />}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </main>
  );
}
