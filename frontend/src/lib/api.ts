import type { Article, ReportResponse } from "./types";

export async function fetchNews(filter = "hot", currencies?: string): Promise<Article[]> {
  const params = new URLSearchParams({ filter });
  if (currencies) params.set("currencies", currencies);

  const res = await fetch(`/api/news?${params}`);
  if (!res.ok) throw new Error("Failed to fetch news");
  const data = await res.json();
  return data.articles as Article[];
}

export async function generateReport(article: {
  title: string;
  source: string;
  published_at: string;
  url: string;
}): Promise<ReportResponse> {
  const res = await fetch("/api/report", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(article),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Failed to generate report");
  }

  return res.json() as Promise<ReportResponse>;
}
