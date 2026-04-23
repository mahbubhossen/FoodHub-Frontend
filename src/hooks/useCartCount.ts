"use client";

import { CartService } from "@/services/api.services";
import { useQuery } from "@tanstack/react-query";

export function useCartCount(enabled = true): number {
  const { data } = useQuery({
    queryKey: ["cart"],
    queryFn: CartService.get,
    enabled,
    staleTime: 30_000,
  });
  return data?.itemCount ?? 0;
}
