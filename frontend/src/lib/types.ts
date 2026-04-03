export type Sentiment = "bullish" | "bearish" | "neutral";

export interface Article {
  id: number;
  title: string;
  url: string;
  source: string;
  published_at: string;
  currencies: string[];
  sentiment?: Sentiment;
  votes: {
    negative?: number;
    positive?: number;
    important?: number;
    liked?: number;
    disliked?: number;
    lol?: number;
    toxic?: number;
    saved?: number;
    comments?: number;
  };
}

export type MarketImpact = "bullish" | "bearish" | "neutral";
export type Verdict = "noise" | "watch" | "important" | "high_impact";

export interface Report {
  summary: string;
  market_impact: MarketImpact;
  impact_reason: string;
  key_claims: string[];
  uncertainty: string;
  verdict: Verdict;
  verdict_reason: string;
  confidence: number;
}

export interface Receipt {
  payment_hash: string;
  model: string;
  settlement: string;
  url_hash: string;
}

export interface ReportResponse {
  report: Report;
  receipt: Receipt;
  article: {
    title: string;
    source: string;
    published_at: string;
    url: string;
  };
}
