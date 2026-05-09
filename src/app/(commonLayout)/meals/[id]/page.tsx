"use client";

import { PageLoader } from "@/components/modules/shared/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/constants";
import { useSession } from "@/lib/auth-client";
import { formatDate, formatPrice, getDietaryTagsArray } from "@/lib/utils";
import {
  CartService,
  MealService,
  ReviewService,
} from "@/services/api.services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Minus, Plus, ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";
import { toast } from "sonner";

export default function MealDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [qty, setQty] = useState(1);
  const { data: session } = useSession();
  const user = session?.user;
  const qc = useQueryClient();

  const { data: meal, isLoading } = useQuery({
    queryKey: ["meal", id],
    queryFn: () => MealService.getById(id),
  });

  const { data: reviewData } = useQuery({
    queryKey: ["reviews", id],
    queryFn: () => ReviewService.getMealReviews(id, { limit: 20 }),
  });

  const { mutate: addToCart, isPending } = useMutation({
    mutationFn: () => CartService.addItem(id, qty),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success(`${meal?.name} (×${qty}) added to cart!`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) return <PageLoader />;
  if (!meal)
    return (
      <div className="container py-20 text-center text-muted-foreground">
        Meal not found.
      </div>
    );

  const tags = getDietaryTagsArray(meal.dietaryTags);
  const reviews = reviewData?.data ?? [];
  const avgRating = reviewData?.averageRating;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link
        href={ROUTES.MEALS}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to meals
      </Link>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Image */}
        <div className="relative h-72 md:h-96 w-full overflow-hidden rounded-2xl bg-muted">
          {meal.imageUrl ? (
            <Image
              src={meal.imageUrl}
              alt={meal.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-orange-100 to-orange-50 dark:from-orange-950/30 dark:to-orange-900/10">
              <span className="text-8xl">🍽️</span>
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {meal.category && (
            <Badge variant="secondary" className="mb-2">
              {meal.category.name}
            </Badge>
          )}
          <h1 className="text-3xl font-extrabold leading-tight">{meal.name}</h1>

          {meal.provider && (
            <Link
              href={ROUTES.PROVIDER_DETAIL(meal.provider.id)}
              className="mt-1.5 inline-block text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              by {meal.provider.restaurantName}
            </Link>
          )}

          {/* Rating */}
          {avgRating && (
            <div className="mt-2 flex items-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.round(avgRating) ? "fill-orange-400 text-orange-400" : "text-muted"}`}
                />
              ))}
              <span className="text-sm text-muted-foreground">
                {avgRating} ({reviews.length} reviews)
              </span>
            </div>
          )}

          <p className="mt-4 text-3xl font-bold text-primary">
            {formatPrice(meal.price)}
          </p>

          {meal.description && (
            <p className="mt-3 text-muted-foreground leading-relaxed">
              {meal.description}
            </p>
          )}

          {tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {tags.map((t) => (
                <Badge key={t} variant="outline" className="capitalize">
                  {t}
                </Badge>
              ))}
            </div>
          )}

          <Separator className="my-5" />

          {/* Add to cart */}
          {(user as { role?: string })?.role === "CUSTOMER" &&
            meal.isAvailable && (
              <div className="flex items-center gap-3">
                {/* Qty picker */}
                <div className="flex items-center gap-2 rounded-lg border border-border p-1">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((q) => q + 1)}
                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
                <Button
                  onClick={() => addToCart()}
                  disabled={isPending}
                  className="flex-1 gap-2 h-11"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {isPending
                    ? "Adding…"
                    : `Add to Cart — ${formatPrice(meal.price * qty)}`}
                </Button>
              </div>
            )}

          {!meal.isAvailable && (
            <div className="rounded-lg bg-muted p-4 text-center text-sm text-muted-foreground">
              This item is currently unavailable.
            </div>
          )}

          {!user && (
            <div className="rounded-lg border border-border/60 bg-muted/40 p-4 text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Sign in to add to cart
              </p>
              <Button asChild size="sm">
                <Link href={ROUTES.LOGIN}>Sign In</Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Reviews */}
      {reviews.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold mb-6">
            Customer Reviews ({reviews.length})
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-border/60 bg-card p-4"
              >
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < r.rating ? "fill-orange-400 text-orange-400" : "text-muted"}`}
                    />
                  ))}
                </div>
                {r.comment && (
                  <p className="text-sm text-muted-foreground">{r.comment}</p>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  {formatDate(r.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
