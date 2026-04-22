import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },
  async rewrites() {
    // Proxy /api/auth/* to better-auth handler (same origin, no-op in dev)
    return [];
  },
};

export default nextConfig;
