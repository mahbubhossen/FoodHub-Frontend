"use client";

import { PageLoader } from "@/components/modules/shared/LoadingSpinner";
import { MealCard } from "@/components/modules/shared/MealCard";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants";
import { ProviderService } from "@/services/api.services";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use } from "react";

export default function ProviderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: provider, isLoading } = useQuery({
    queryKey: ["provider", id],
    queryFn: () => ProviderService.getById(id),
  });

  if (isLoading) return <PageLoader />;
  if (!provider)
    return (
      <div className="container py-20 text-center">Provider not found.</div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <Link
        href={ROUTES.MEALS}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to meals
      </Link>

      {/* Provider header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted text-4xl">
          {provider.logoUrl ? (
            <Image
              src={provider.logoUrl}
              alt={provider.restaurantName}
              width={80}
              height={80}
              className="object-cover"
            />
          ) : (
            "🍽️"
          )}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold">{provider.restaurantName}</h1>
            <Badge
              className={
                provider.isOpen
                  ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0"
                  : "bg-muted text-muted-foreground border-0"
              }
            >
              {provider.isOpen ? "Open" : "Closed"}
            </Badge>
          </div>
          {provider.description && (
            <p className="text-muted-foreground text-sm max-w-prose">
              {provider.description}
            </p>
          )}
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
            {provider.address && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {provider.address}
              </span>
            )}
            {provider.phone && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" /> {provider.phone}
              </span>
            )}
          </div>
        </div>
        <div className="text-center sm:text-right">
          <p className="text-2xl font-bold text-primary">
            {provider._count?.meals ?? 0}
          </p>
          <p className="text-xs text-muted-foreground">Menu items</p>
        </div>
      </div>

      {/* Menu */}
      <h2 className="text-xl font-bold mb-5">Menu</h2>
      {!provider.meals || provider.meals.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          No meals available yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {provider.meals.map((meal: any) => (
            <MealCard key={meal.id} meal={meal} showProvider={false} />
          ))}
        </div>
      )}
    </div>
  );
}
