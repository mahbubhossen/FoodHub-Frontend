"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CartService } from "@/services/api.services";
import { ROUTES } from "@/constants";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageLoader } from "@/components/modules/shared/LoadingSpinner";

export default function CartPage() {
  const qc = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: CartService.get,
  });

  const { mutate: updateItem } = useMutation({
    mutationFn: ({ id, qty }: { id: string; qty: number }) =>
      CartService.updateItem(id, qty),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
    onError: (err: Error) => toast.error(err.message),
  });

  const { mutate: removeItem, isPending: removing } = useMutation({
    mutationFn: CartService.removeItem,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Item removed.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const { mutate: clearCart } = useMutation({
    mutationFn: CartService.clear,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Cart cleared.");
    },
  });

  if (isLoading) return <PageLoader />;

  const items = cart?.items ?? [];
  const total = cart?.total ?? 0;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/30" />
        <h2 className="text-xl font-semibold">Your cart is empty</h2>
        <p className="text-muted-foreground text-sm">
          Add some delicious meals to get started
        </p>
        <Button asChild>
          <Link href={ROUTES.MEALS}>Browse Meals</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Cart ({items.length} items)</h1>
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive gap-1.5"
          onClick={() => clearCart()}
        >
          <Trash2 className="h-4 w-4" /> Clear cart
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-xl border border-border/60 bg-card p-4"
            >
              {/* Image */}
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                {item.meal.imageUrl ? (
                  <Image
                    src={item.meal.imageUrl}
                    alt={item.meal.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl">
                    🍽️
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={ROUTES.MEAL_DETAIL(item.meal.id)}
                  className="font-semibold text-sm hover:text-primary transition-colors line-clamp-1"
                >
                  {item.meal.name}
                </Link>
                {item.meal.provider && (
                  <p className="text-xs text-muted-foreground">
                    {(item.meal as any).provider?.restaurantName}
                  </p>
                )}
                <p className="text-sm font-bold text-primary mt-1">
                  {formatPrice(item.meal.price)}
                </p>
              </div>
              <div className="flex flex-col items-end gap-2">
                {/* Qty control */}
                <div className="flex items-center gap-1.5 rounded-lg border border-border p-0.5">
                  <button
                    onClick={() =>
                      item.quantity > 1
                        ? updateItem({ id: item.id, qty: item.quantity - 1 })
                        : removeItem(item.id)
                    }
                    className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="w-5 text-center text-sm font-semibold">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateItem({ id: item.id, qty: item.quantity + 1 })
                    }
                    className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:bg-muted transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  disabled={removing}
                  className="text-destructive hover:text-destructive/80 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <p className="text-sm font-bold">
                  {formatPrice(item.meal.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-xl border border-border/60 bg-card p-5 space-y-4">
            <h2 className="font-bold text-lg">Order Summary</h2>
            <div className="space-y-2 text-sm">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-muted-foreground"
                >
                  <span className="truncate max-w-[160px]">
                    {item.meal.name} ×{item.quantity}
                  </span>
                  <span>{formatPrice(item.meal.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-primary">{formatPrice(total)}</span>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              Cash on Delivery (COD)
            </p>
            <Button asChild className="w-full h-11">
              <Link href={ROUTES.CHECKOUT}>Proceed to Checkout</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
