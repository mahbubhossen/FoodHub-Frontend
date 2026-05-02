"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { MealService, CategoryService } from "@/services/api.services";
import { MealCard } from "@/components/modules/shared/MealCard";
import { PageLoader } from "@/components/modules/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";

export default function MealsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [categoryId, setCategoryId] = useState(
    searchParams.get("categoryId") ?? "",
  );
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [page, setPage] = useState(1);

  const params = {
    ...(search && { search }),
    ...(categoryId && { categoryId }),
    ...(minPrice && { minPrice }),
    ...(maxPrice && { maxPrice }),
    sortBy,
    sortOrder,
    page,
    limit: 12,
  };

  const { data, isLoading } = useQuery({
    queryKey: ["meals", params],
    queryFn: () => MealService.getAll(params),
    placeholderData: (prev) => prev,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: CategoryService.getAll,
  });

  const meals = data?.data ?? [];
  const pagination = data?.pagination;

  const clearFilters = () => {
    setSearch("");
    setCategoryId("");
    setMinPrice("");
    setMaxPrice("");
    setPage(1);
  };

  const hasFilters = !!(search || categoryId || minPrice || maxPrice);

  const FilterPanel = () => (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Category
        </Label>
        <Select
          value={categoryId || "all"}
          onValueChange={(v) => {
            setCategoryId(v === "all" ? "" : v);
            setPage(1);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Sort By
        </Label>
        <Select
          value={`${sortBy}-${sortOrder}`}
          onValueChange={(v) => {
            const [s, o] = v.split("-");
            setSortBy(s);
            setSortOrder(o);
          }}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt-desc">Newest First</SelectItem>
            <SelectItem value="createdAt-asc">Oldest First</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name-asc">Name: A to Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Price Range
        </Label>
        <div className="flex gap-2">
          <Input
            placeholder="Min $"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setPage(1);
            }}
            type="number"
            min={0}
          />
          <Input
            placeholder="Max $"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setPage(1);
            }}
            type="number"
            min={0}
          />
        </div>
      </div>

      {hasFilters && (
        <Button
          variant="outline"
          className="w-full gap-1.5"
          onClick={clearFilters}
        >
          <X className="h-4 w-4" /> Clear Filters
        </Button>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold md:text-3xl">Browse Meals</h1>
        <p className="text-muted-foreground mt-1">
          Discover delicious food from local restaurants
        </p>
      </div>

      {/* Search + filter bar */}
      <div className="flex gap-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search meals, cuisines…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        {/* Mobile filter sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="md:hidden gap-1.5">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {hasFilters && (
                <Badge className="h-4 w-4 p-0 flex items-center justify-center text-[10px]">
                  !
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <FilterPanel />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active filters */}
      {hasFilters && (
        <div className="flex flex-wrap gap-2 mb-4">
          {search && (
            <Badge variant="secondary" className="gap-1">
              {search}{" "}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setSearch("")}
              />
            </Badge>
          )}
          {categoryId && (
            <Badge variant="secondary" className="gap-1">
              {categories.find((c) => c.id === categoryId)?.name ?? categoryId}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setCategoryId("")}
              />
            </Badge>
          )}
        </div>
      )}

      <div className="flex gap-8">
        {/* Desktop sidebar filters */}
        <aside className="hidden md:block w-56 flex-shrink-0">
          <div className="sticky top-24 rounded-xl border border-border/60 bg-card p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-primary" /> Filters
            </h3>
            <FilterPanel />
          </div>
        </aside>

        {/* Results */}
        <div className="flex-1">
          {isLoading ? (
            <PageLoader />
          ) : meals.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-4xl mb-3">🍽️</p>
              <p className="font-semibold text-lg mb-1">No meals found</p>
              <p className="text-muted-foreground text-sm">
                Try adjusting your filters
              </p>
              {hasFilters && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {pagination?.total ?? 0} meals found
              </p>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {meals.map((meal) => (
                  <MealCard key={meal.id} meal={meal} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground px-2">
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
      </div>
    </div>
  );
}
