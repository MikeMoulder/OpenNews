import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8000";

  try {
    const res = await fetch(`${backendUrl}/api/report`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const detail = (err as { detail?: string }).detail ?? "Report generation failed";
      return NextResponse.json({ error: detail }, { status: res.status });
    }

    return NextResponse.json(await res.json());
  } catch {
    return NextResponse.json({ error: "Backend unreachable" }, { status: 503 });
  }
}
