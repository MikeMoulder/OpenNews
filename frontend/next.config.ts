import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // BACKEND_URL is a server-side env var used in Next.js API routes to reach the Python backend.
  // Set this in .env.local for local dev and in Vercel env settings for production.
};

export default nextConfig;
