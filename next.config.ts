import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "localhost" },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://foodhub-backend-ytu3.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;
