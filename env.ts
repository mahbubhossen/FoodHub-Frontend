const env = {
  NEXT_PUBLIC_API_URL:
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api",
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME ?? "FoodHub",
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ?? "",
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  DATABASE_URL: process.env.DATABASE_URL ?? "",
} as const;

export default env;
