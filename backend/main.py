import asyncio
import hashlib
import json
import os
import re
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from typing import Optional

import logging

import feedparser
import httpx
import opengradient as og
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, HttpUrl

load_dotenv()

logging.basicConfig(level=logging.INFO)
logging.getLogger("opengradient").setLevel(logging.DEBUG)

app = FastAPI(title="OpenNews API")

ALLOWED_ORIGINS = os.environ.get("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)

OG_PRIVATE_KEY = os.environ["OG_PRIVATE_KEY"]

llm = og.LLM(private_key=OG_PRIVATE_KEY)
llm.ensure_opg_approval(min_allowance=0.1)

SYSTEM_PROMPT = """You are a professional crypto news analyst. Analyze the provided news article and return a structured JSON report.

Return ONLY valid JSON with this exact structure, no markdown, no extra text:
{
  "summary": "2-3 sentence summary of what happened",
  "market_impact": "bullish" | "bearish" | "neutral",
  "impact_reason": "1-2 sentences explaining the market impact direction",
  "key_claims": ["claim 1", "claim 2", "claim 3"],
  "uncertainty": "What is unknown, unverified, or missing from this article",
  "verdict": "noise" | "watch" | "important" | "high_impact",
  "verdict_reason": "1 sentence explaining the verdict rating",
  "confidence": <integer 0-100>
}"""

# In-memory cache keyed by URL hash — avoids re-generating and re-paying for the same article
_report_cache: dict[str, dict] = {}


class ReportRequest(BaseModel):
    title: str
    source: str
    published_at: str
    url: str
    body: Optional[str] = None


RSS_FEEDS = [
    ("CoinTelegraph", "https://cointelegraph.com/rss"),
    ("Decrypt", "https://decrypt.co/feed"),
]

# Known crypto ticker symbols used to extract currencies from article categories/tags
_CRYPTO_TICKERS = {
    "BTC", "ETH", "SOL", "XRP", "ADA", "DOGE", "DOT", "AVAX", "MATIC", "LINK",
    "UNI", "AAVE", "LTC", "ATOM", "NEAR", "ARB", "OP", "APT", "SUI", "FIL",
    "USDT", "USDC", "DAI", "BNB", "TRX", "SHIB", "PEPE", "TON", "TRUMP",
}


def _extract_currencies(entry: dict) -> list[str]:
    """Pull crypto tickers from RSS entry tags/categories."""
    tags = entry.get("tags", [])
    words: set[str] = set()
    for tag in tags:
        term = tag.get("term", "")
        for w in re.split(r"[\s,|/]+", term):
            upper = w.strip().upper()
            if upper in _CRYPTO_TICKERS:
                words.add(upper)
    # Also scan the title
    for w in re.split(r"[\s,.:;!?$()]+", entry.get("title", "")):
        upper = w.strip("'\"").upper()
        if upper in _CRYPTO_TICKERS:
            words.add(upper)
    return sorted(words)


def _parse_pub_date(entry: dict) -> str:
    """Return ISO-8601 published date from an RSS entry."""
    for field in ("published_parsed", "updated_parsed"):
        tp = entry.get(field)
        if tp:
            return datetime(*tp[:6], tzinfo=timezone.utc).isoformat()
    for field in ("published", "updated"):
        raw = entry.get(field)
        if raw:
            try:
                return parsedate_to_datetime(raw).isoformat()
            except Exception:
                pass
    return datetime.now(timezone.utc).isoformat()


async def _fetch_feed(client: httpx.AsyncClient, name: str, url: str) -> list[dict]:
    """Fetch and parse a single RSS feed, returning normalised article dicts."""
    try:
        resp = await client.get(url, follow_redirects=True)
        if resp.status_code != 200:
            return []
    except httpx.HTTPError:
        return []

    feed = feedparser.parse(resp.text)
    articles = []
    for entry in feed.entries:
        articles.append({
            "id": hash(entry.get("id", entry.get("link", ""))) & 0x7FFFFFFF,
            "title": entry.get("title", ""),
            "url": entry.get("link", ""),
            "source": name,
            "published_at": _parse_pub_date(entry),
            "currencies": _extract_currencies(entry),
            "votes": {},
        })
    return articles


@app.get("/api/news")
async def get_news(filter: str = "hot", currencies: Optional[str] = None):
    allowed_filters = {"hot", "rising", "bullish", "bearish", "important", "saved"}
    if filter not in allowed_filters:
        raise HTTPException(status_code=400, detail=f"Invalid filter. Allowed: {allowed_filters}")

    async with httpx.AsyncClient(timeout=10.0) as client:
        results = await asyncio.gather(
            *[_fetch_feed(client, name, url) for name, url in RSS_FEEDS],
            return_exceptions=True,
        )

    articles: list[dict] = []
    for result in results:
        if isinstance(result, list):
            articles.extend(result)

    # Sort by published_at descending (newest first)
    articles.sort(key=lambda a: a["published_at"], reverse=True)

    # Filter by currency if requested
    if currencies:
        wanted = {c.strip().upper() for c in currencies.split(",")}
        articles = [a for a in articles if wanted & set(a["currencies"])]

    return {"articles": articles}


@app.post("/api/report")
async def generate_report(req: ReportRequest):
    url_hash = hashlib.sha256(req.url.encode()).hexdigest()[:20]

    if url_hash in _report_cache:
        return _report_cache[url_hash]

    user_content = (
        f"Title: {req.title}\n"
        f"Source: {req.source}\n"
        f"Published: {req.published_at}\n"
        f"URL: {req.url}"
    )
    if req.body:
        # Limit body to avoid excessive token usage
        user_content += f"\n\nArticle content:\n{req.body[:3000]}"

    result = await llm.chat(
        model=og.TEE_LLM.GPT_4_1_2025_04_14,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_content},
        ],
        max_tokens=700,
        temperature=0.0,
        x402_settlement_mode=og.x402SettlementMode.INDIVIDUAL_FULL,
    )

    raw_output = result.chat_output["content"]

    try:
        report_data = json.loads(raw_output)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="LLM returned malformed JSON")

    response = {
        "report": report_data,
        "receipt": {
            "payment_hash": result.payment_hash,
            "model": "openai/gpt-4.1-2025-04-14",
            "settlement": "INDIVIDUAL_FULL",
            "url_hash": url_hash,
        },
        "article": {
            "title": req.title,
            "source": req.source,
            "published_at": req.published_at,
            "url": req.url,
        },
    }

    _report_cache[url_hash] = response
    return response
