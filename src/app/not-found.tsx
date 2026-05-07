import { Button } from "@/components/ui/button";
import { ROUTES } from "@/constants";
import { ChefHat, Home, Search, UtensilsCrossed } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* Background decorative blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl" />
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
        {/* Floating food emojis */}
        <div className="relative mb-8 flex items-center justify-center">
          {/* Orbiting emojis */}
          <span
            className="absolute -left-16 -top-6 text-4xl animate-bounce"
            style={{ animationDelay: "0ms", animationDuration: "2.2s" }}
          >
            🍕
          </span>
          <span
            className="absolute -right-14 -top-8 text-3xl animate-bounce"
            style={{ animationDelay: "400ms", animationDuration: "2.5s" }}
          >
            🍔
          </span>
          <span
            className="absolute -left-12 bottom-0 text-3xl animate-bounce"
            style={{ animationDelay: "800ms", animationDuration: "2s" }}
          >
            🍜
          </span>
          <span
            className="absolute -right-10 bottom-2 text-2xl animate-bounce"
            style={{ animationDelay: "600ms", animationDuration: "2.8s" }}
          >
            🌮
          </span>

          {/* Central 404 plate */}
          <div className="relative flex h-36 w-36 items-center justify-center rounded-full border-4 border-dashed border-border bg-muted/50">
            <div className="flex flex-col items-center">
              <span className="text-5xl">🍽️</span>
            </div>
            {/* Ring label */}
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5">
              <span className="text-xs font-bold text-primary-foreground tracking-widest">
                EMPTY
              </span>
            </div>
          </div>
        </div>

        {/* 404 number */}
        <div className="relative mb-2">
          <p className="text-[96px] font-extrabold leading-none tracking-tighter text-primary/10 select-none">
            404
          </p>
          <p className="absolute inset-0 flex items-center justify-center text-[80px] font-extrabold leading-none tracking-tighter text-primary">
            404
          </p>
        </div>

        {/* Message */}
        <h1 className="mt-2 text-2xl font-bold md:text-3xl">
          This page went missing
        </h1>
        <p className="mt-3 text-muted-foreground leading-relaxed">
          Looks like this page took the day off. The meal you&apos;re looking
          for may have been moved, deleted, or never existed on the menu.
        </p>

        {/* Action buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" className="gap-2 h-11 px-6">
            <Link href={ROUTES.HOME}>
              <Home className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="gap-2 h-11 px-6"
          >
            <Link href={ROUTES.MEALS}>
              <UtensilsCrossed className="h-4 w-4" />
              Browse Meals
            </Link>
          </Button>
        </div>

        {/* Divider */}
        <div className="mt-10 flex items-center gap-3 text-muted-foreground">
          <div className="h-px w-16 bg-border" />
          <p className="text-xs">or try searching</p>
          <div className="h-px w-16 bg-border" />
        </div>

        {/* Search suggestion */}
        <Link
          href={ROUTES.MEALS}
          className="mt-4 inline-flex items-center gap-2 rounded-full border border-border/60 bg-muted/40 px-5 py-2.5 text-sm text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/5 hover:text-primary"
        >
          <Search className="h-4 w-4" />
          Search all meals
        </Link>
      </div>

      {/* Bottom decoration */}
      <p className="absolute bottom-6 text-xs text-muted-foreground/50">
        FoodHub · Page not found
      </p>
    </div>
  );
}
