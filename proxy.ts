/**
 * Next.js rewrites config helper.
 * Add this to next.config.ts → rewrites() to proxy /api/* → backend.
 *
 * Usage in next.config.ts:
 *   import { apiRewrites } from "./proxy";
 *   export default { async rewrites() { return apiRewrites; } }
 */
export const apiRewrites = [
  {
    source: "/api/:path*",
    destination: `${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api"}/:path*`,
  },
];
