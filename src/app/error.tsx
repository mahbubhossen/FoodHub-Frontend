"use client";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { AlertTriangle, ChefHat, Home, RefreshCw } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log to your error monitoring service (e.g. Sentry) here
    console.error("[App Error]", error);
  }, [error]);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-destructive/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-orange-500/5 blur-3xl" />
      </div>

      {/* Logo */}
      <Link
        href={ROUTES.HOME}
        className="absolute left-6 top-6 flex items-center gap-2 font-bold text-lg"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <ChefHat className="h-4 w-4" />
        </span>
        <span className="text-primary">Food</span>
        <span>Hub</span>
      </Link>

      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Icon */}
        <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-dashed border-destructive/30 bg-destructive/5">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>

        <h1 className="text-2xl font-bold md:text-3xl">Something went wrong</h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Our kitchen had an unexpected issue. This has been noted and
          we&apos;re working on it. Please try again or head back home.
        </p>

        {/* Error detail (dev only) */}
        {process.env.NODE_ENV === "development" && error?.message && (
          <div className="mt-5 w-full rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-left">
            <p className="mb-1 text-xs font-semibold text-destructive uppercase tracking-wide">
              Error details (dev only)
            </p>
            <p className="font-mono text-xs text-destructive/80 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" className="gap-2 h-11 px-6" onClick={reset}>
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="gap-2 h-11 px-6"
          >
            <Link href={ROUTES.HOME}>
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>

      <p className="absolute bottom-6 text-xs text-muted-foreground/50">
        FoodHub · Unexpected error
      </p>
    </div>
  );
}
