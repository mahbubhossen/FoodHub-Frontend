"use client";

import { MealCard } from "@/components/modules/shared/MealCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import { CategoryService, MealService, ProviderService } from "@/services/api.services";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Clock, Search, Star, Truck, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ─── 1. Hero Section ───────────────────────────────────────────────────────

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-background to-emerald-50/30 dark:from-orange-950/20 dark:via-background dark:to-emerald-950/10 py-20 md:py-28">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          {/* Text */}
          <div className="max-w-lg">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/10 border-0">
              🔥 Over 500+ meals available
            </Badge>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Delicious Food,
              <br />
              <span className="text-primary">Delivered Fast</span>
              <br />
              to Your Door
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Browse menus from top local restaurants, place your order in seconds,
              and enjoy a fresh hot meal without leaving home.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button size="lg" asChild className="gap-2 h-12 px-6">
                <Link href={ROUTES.MEALS}>
                  <UtensilsCrossed className="h-4 w-4" />
                  Order Now
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="h-12 px-6">
                <Link href={ROUTES.REGISTER}>Become a Provider</Link>
              </Button>
            </div>
            {/* Stats row */}
            <div className="mt-10 flex gap-8">
              {[
                { value: "500+", label: "Meals" },
                { value: "50+",  label: "Restaurants" },
                { value: "10k+", label: "Happy Customers" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-extrabold text-primary">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Hero image placeholder */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative h-96 w-96">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 blur-2xl" />
              <div className="relative h-full w-full rounded-3xl bg-gradient-to-br from-orange-100 to-emerald-50 dark:from-orange-950/40 dark:to-emerald-950/30 flex items-center justify-center overflow-hidden border border-border/40 shadow-2xl">
                <span className="text-[120px] select-none">🍱</span>
              </div>
              {/* Floating cards */}
              <div className="absolute -right-6 top-12 rounded-xl bg-background p-3 shadow-lg border border-border/60 flex items-center gap-2">
                <span className="text-xl">⭐</span>
                <div>
                  <p className="text-xs font-semibold">4.9 Rating</p>
                  <p className="text-[10px] text-muted-foreground">12k+ reviews</p>
                </div>
              </div>
              <div className="absolute -left-6 bottom-16 rounded-xl bg-background p-3 shadow-lg border border-border/60 flex items-center gap-2">
                <span className="text-xl">🚚</span>
                <div>
                  <p className="text-xs font-semibold">Fast Delivery</p>
                  <p className="text-[10px] text-muted-foreground">30 min avg</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 2. Categories Section ─────────────────────────────────────────────────

export function CategoriesSection() {
  const { data: categories = [], isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn:  CategoryService.getAll,
  });

  const ICONS: Record<string, string> = {
    bengali: "🍛", burger: "🍔", pizza: "🍕", sushi: "🍣",
    biryani: "🍚", pasta: "🍝", salad: "🥗", desserts: "🍰",
    chicken: "🍗", seafood: "🦐", default: "🍽️",
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">Browse by Category</h2>
          <p className="mt-2 text-muted-foreground">
            Find exactly what you&apos;re craving
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-4 gap-3 md:grid-cols-6 lg:grid-cols-8">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-20 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3 md:grid-cols-6 lg:grid-cols-8">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                href={`${ROUTES.MEALS}?categoryId=${cat.id}`}
                className="group flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-background p-3 text-center transition-all hover:border-primary hover:shadow-md hover:shadow-primary/10"
              >
                <span className="text-2xl group-hover:scale-110 transition-transform duration-200">
                  {ICONS[cat.slug] ?? ICONS.default}
                </span>
                <span className="text-xs font-medium leading-tight line-clamp-1">{cat.name}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── 3. Featured Meals Section ─────────────────────────────────────────────

export function FeaturedMealsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["meals", "featured"],
    queryFn:  () => MealService.getAll({ limit: 8, sortBy: "createdAt", sortOrder: "desc" }),
  });

  const meals = data?.data ?? [];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Featured Meals</h2>
            <p className="mt-1 text-muted-foreground">Freshly added to our platform</p>
          </div>
          <Button variant="ghost" asChild className="gap-1 text-primary">
            <Link href={ROUTES.MEALS}>
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-72 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {meals.map((meal) => (
              <MealCard key={meal.id} meal={meal} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── 4. How It Works Section ───────────────────────────────────────────────

export function HowItWorksSection() {
  const STEPS = [
    {
      icon: <Search className="h-6 w-6" />,
      title: "Browse & Discover",
      desc: "Explore hundreds of meals from top local restaurants. Filter by cuisine, price, or dietary preferences.",
      step: "01",
    },
    {
      icon: <ShoppingCart className="h-6 w-6" />,
      title: "Add to Cart",
      desc: "Pick your favourite dishes and add them to your cart. Adjust quantities before checkout.",
      step: "02",
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Place Your Order",
      desc: "Enter your delivery address and confirm. We'll notify the restaurant immediately.",
      step: "03",
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Get it Delivered",
      desc: "Track your order in real-time from preparation to your doorstep. Enjoy every bite!",
      step: "04",
    },
  ];

  // Need import at top
  function ShoppingCart({ className }: { className?: string }) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    );
  }

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">How FoodHub Works</h2>
          <p className="mt-2 text-muted-foreground">
            From craving to plate in 4 simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <div key={i} className="relative">
              {i < STEPS.length - 1 && (
                <div className="absolute top-8 left-full z-10 hidden w-full lg:block">
                  <div className="h-px w-full border-t-2 border-dashed border-border" />
                </div>
              )}
              <Card className="text-center border-border/60 hover:border-primary/40 transition-colors">
                <CardContent className="p-6">
                  <div className="relative mb-4 inline-flex">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      {step.icon}
                    </div>
                    <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="mb-2 font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 5. Top Providers Section ──────────────────────────────────────────────

export function TopProvidersSection() {
  const { data, isLoading } = useQuery({
    queryKey: ["providers", "top"],
    queryFn:  () => ProviderService.getAll({ limit: 6 }),
  });

  const providers = data?.data ?? [];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">Top Restaurants</h2>
            <p className="mt-1 text-muted-foreground">Trusted providers on our platform</p>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-36 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {providers.map((p) => (
              <Link
                key={p.id}
                href={ROUTES.PROVIDER_DETAIL(p.id)}
                className="group flex flex-col items-center gap-3 rounded-xl border border-border/60 bg-background p-4 text-center transition-all hover:border-primary hover:shadow-md"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-emerald-500/20 text-2xl">
                  {p.logoUrl ? (
                    <Image src={p.logoUrl} alt={p.restaurantName} width={56} height={56} className="rounded-full object-cover" />
                  ) : (
                    "🍽️"
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                    {p.restaurantName}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {p._count?.meals ?? 0} meals
                  </p>
                </div>
                <span className={`text-[10px] rounded-full px-2 py-0.5 font-medium ${
                  p.isOpen
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-muted text-muted-foreground"
                }`}>
                  {p.isOpen ? "Open" : "Closed"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ─── 6. Testimonials Section ───────────────────────────────────────────────

export function TestimonialsSection() {
  const TESTIMONIALS = [
    { name: "Ayesha R.",   rating: 5, text: "FoodHub made dinner so easy! The order tracking is amazing — I knew exactly when to expect my food.", avatar: "AR" },
    { name: "Karim H.",    rating: 5, text: "As a provider, the platform is incredibly straightforward. My orders have doubled since joining FoodHub.", avatar: "KH" },
    { name: "Priya S.",    rating: 5, text: "Huge variety of cuisines and everything arrives hot. The halal filter is a game-changer for me.", avatar: "PS" },
    { name: "Tanvir M.",   rating: 4, text: "Great selection of restaurants I didn't even know existed in my area. FoodHub has become my go-to.", avatar: "TM" },
    { name: "Nasrin B.",   rating: 5, text: "The UX is clean and intuitive. I had my first order placed in under 2 minutes!", avatar: "NB" },
    { name: "Sabbir A.",   rating: 5, text: "Phenomenal experience from browsing to delivery. The review system keeps quality high.", avatar: "SA" },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">What Our Community Says</h2>
          <p className="mt-2 text-muted-foreground">Real reviews from real foodies</p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Card key={i} className="border-border/60 hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-orange-400 text-orange-400" />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {t.avatar}
                  </div>
                  <p className="text-sm font-semibold">{t.name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 7. CTA Section ───────────────────────────────────────────────────────

export function CTASection() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-orange-600 p-10 md:p-16 text-primary-foreground shadow-xl shadow-primary/20">
          {/* Decorative elements */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-black/10 blur-3xl" />
          </div>

          <div className="relative grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-3xl font-extrabold md:text-4xl leading-tight">
                Ready to start your<br />food journey?
              </h2>
              <p className="mt-4 text-base text-primary-foreground/80 leading-relaxed">
                Join thousands of food lovers and the best local restaurants.
                Sign up free and get your first order going in minutes.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="bg-white text-primary hover:bg-white/90 h-12 px-6 font-semibold"
                >
                  <Link href={ROUTES.REGISTER}>Get Started Free</Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white/50 text-white hover:bg-white/10 h-12 px-6 bg-transparent"
                >
                  <Link href={ROUTES.MEALS}>Browse Meals</Link>
                </Button>
              </div>
            </div>

            <div className="hidden md:flex justify-center">
              <div className="grid grid-cols-2 gap-3">
                {["🍕", "🍱", "🍔", "🍣", "🥗", "🍝", "🍗", "🍰"].map((e, i) => (
                  <div
                    key={i}
                    className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm text-3xl hover:scale-110 transition-transform"
                  >
                    {e}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
