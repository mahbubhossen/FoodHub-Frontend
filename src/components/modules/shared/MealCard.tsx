"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import { useSession } from "@/lib/auth-client";
import { formatPrice, getDietaryTagsArray } from "@/lib/utils";
import { CartService } from "@/services/api.service";
import { Meal } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ShoppingCart, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";

interface MealCardProps {
  meal: Meal;
  showProvider?: boolean;
}

export function MealCard({ meal, showProvider = true }: MealCardProps) {
  const { data: session } = useSession();
  const user = session?.user as any;
  const qc = useQueryClient();

  const { mutate: addToCart, isPending } = useMutation({
    mutationFn: () => CartService.addItem(meal.id, 1),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success(`${meal.name} added to cart!`);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const tags = getDietaryTagsArray(meal.dietaryTags);

  return (
    <Card className="group overflow-hidden border border-border/60 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5">
      {/* Image */}
      <Link
        href={ROUTES.MEAL_DETAIL(meal.id)}
        className="block overflow-hidden"
      >
        <div className="relative h-48 w-full bg-muted">
          {meal.imageUrl ? (
            <Image
              src={meal.imageUrl}
              alt={meal.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-950/30 dark:to-orange-900/10">
              <span className="text-5xl">🍽️</span>
            </div>
          )}
          {!meal.isAvailable && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-sm">
              <Badge variant="secondary" className="text-sm">
                Unavailable
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <CardContent className="p-4">
        {/* Provider name */}
        {showProvider && meal.provider && (
          <Link
            href={ROUTES.PROVIDER_DETAIL(meal.provider.id)}
            className="text-xs text-muted-foreground hover:text-primary transition-colors mb-1 block"
          >
            {meal.provider.restaurantName}
          </Link>
        )}

        {/* Name */}
        <Link href={ROUTES.MEAL_DETAIL(meal.id)}>
          <h3 className="font-semibold text-sm leading-tight mb-1 hover:text-primary transition-colors line-clamp-1">
            {meal.name}
          </h3>
        </Link>

        {/* Description */}
        {meal.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
            {meal.description}
          </p>
        )}

        {/* Dietary tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.slice(0, 2).map((t) => (
              <Badge
                key={t}
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-4 capitalize"
              >
                {t}
              </Badge>
            ))}
            {tags.length > 2 && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4">
                +{tags.length - 2}
              </Badge>
            )}
          </div>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-primary">
              {formatPrice(meal.price)}
            </p>
            {meal._count?.reviews !== undefined && meal._count.reviews > 0 && (
              <div className="flex items-center gap-0.5 text-xs text-muted-foreground">
                <Star className="h-3 w-3 fill-orange-400 text-orange-400" />
                <span>{meal._count.reviews} reviews</span>
              </div>
            )}
          </div>

          {user?.role === "CUSTOMER" && meal.isAvailable && (
            <Button
              size="sm"
              onClick={() => addToCart()}
              disabled={isPending}
              className="h-8 gap-1.5"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
              {isPending ? "Adding…" : "Add"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
