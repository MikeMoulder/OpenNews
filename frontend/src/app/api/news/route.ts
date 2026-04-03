import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get("filter") ?? "hot";
  const currencies = searchParams.get("currencies");

  const allowed = new Set(["hot", "rising", "bullish", "bearish", "important", "saved"]);
  if (!allowed.has(filter)) {
    return NextResponse.json({ error: "Invalid filter" }, { status: 400 });
  }

  const params = new URLSearchParams({ filter });
  if (currencies) params.set("currencies", currencies);

  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000";

  try {
    const res = await fetch(`${backendUrl}/api/news?${params}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch news" }, { status: 502 });
    }
    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 503 });
  }
}
