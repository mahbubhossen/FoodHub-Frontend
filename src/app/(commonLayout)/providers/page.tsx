"use client";

import { PageLoader } from "@/components/modules/shared/LoadingSpinner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants";
import { ProviderService } from "@/services/api.services";
import { useQuery } from "@tanstack/react-query";
import { MapPin, Phone, Search, UtensilsCrossed } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function ProvidersPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 12;

  const { data, isLoading } = useQuery({
    queryKey: ["providers", { search, page }],
    queryFn: () =>
      ProviderService.getAll({
        ...(search && { search }),
        page,
        limit,
      }),
    placeholderData: (prev) => prev,
  });

  const providers = data?.data ?? [];
  const pagination = data?.pagination;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold md:text-3xl">All Restaurants</h1>
        <p className="text-muted-foreground mt-1">
          Discover the best local restaurants on FoodHub
        </p>
      </div>

      {/* Search bar */}
      <div className="relative mb-6 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          className="pl-9"
          placeholder="Search restaurants…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Results count */}
      {!isLoading && (
        <p className="text-sm text-muted-foreground mb-5">
          {pagination?.total ?? 0} restaurant
          {(pagination?.total ?? 0) !== 1 ? "s" : ""} found
        </p>
      )}

      {/* Grid */}
      {isLoading ? (
        <PageLoader />
      ) : providers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <UtensilsCrossed className="h-14 w-14 text-muted-foreground/30" />
          <p className="text-lg font-semibold">No restaurants found</p>
          <p className="text-sm text-muted-foreground">
            Try a different search term
          </p>
          {search && (
            <Button variant="outline" onClick={() => setSearch("")}>
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {providers.map((provider) => (
              <Link
                key={provider.id}
                href={ROUTES.PROVIDER_DETAIL(provider.id)}
                className="group flex flex-col rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-0.5"
              >
                {/* Banner / logo area */}
                <div className="relative h-32 bg-gradient-to-br from-orange-100 to-emerald-50 dark:from-orange-950/30 dark:to-emerald-950/20 flex items-center justify-center overflow-hidden">
                  {/* Decorative pattern */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle at 20px 20px, hsl(var(--primary)) 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />

                  {provider.logoUrl ? (
                    <div className="relative h-20 w-20 overflow-hidden rounded-2xl border-4 border-background shadow-md">
                      <Image
                        src={provider.logoUrl}
                        alt={provider.restaurantName}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-background bg-background shadow-md text-4xl">
                      🍽️
                    </div>
                  )}

                  {/* Open / Closed badge */}
                  <div className="absolute top-3 right-3">
                    <Badge
                      className={
                        provider.isOpen
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400 border-0 text-xs"
                          : "bg-muted text-muted-foreground border-0 text-xs"
                      }
                    >
                      {provider.isOpen ? "● Open" : "● Closed"}
                    </Badge>
                  </div>
                </div>

                {/* Info */}
                <div className="flex flex-1 flex-col p-4">
                  <h3 className="font-semibold text-base leading-tight group-hover:text-primary transition-colors line-clamp-1">
                    {provider.restaurantName}
                  </h3>

                  {provider.description && (
                    <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {provider.description}
                    </p>
                  )}

                  <div className="mt-3 space-y-1.5">
                    {provider.address && (
                      <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 flex-shrink-0 mt-px text-primary/60" />
                        <span className="line-clamp-1">{provider.address}</span>
                      </div>
                    )}
                    {provider.phone && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Phone className="h-3.5 w-3.5 flex-shrink-0 text-primary/60" />
                        <span>{provider.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/60">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <UtensilsCrossed className="h-3.5 w-3.5" />
                      <span>{provider._count?.meals ?? 0} meals</span>
                    </div>
                    <span className="text-xs font-medium text-primary group-hover:underline">
                      View menu →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-3">
                Page {page} of {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
