"use client";

import { PageLoader } from "@/components/modules/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ROUTES } from "@/constants";
import { useSession } from "@/lib/auth-client";
import { cn, formatPrice } from "@/lib/utils";
import { CartService, OrderService } from "@/services/api.services";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MapPin } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const schema = z.object({
  deliveryAddress: z
    .string()
    .min(10, "Please enter a valid delivery address (min 10 characters)."),
});

type Values = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();
  const qc = useQueryClient();
  const { data: session } = useSession();
  const user = session?.user;

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: CartService.get,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: { deliveryAddress: (user?.address as string) ?? "" },
  });

  const { mutate: placeOrder, isPending } = useMutation({
    mutationFn: (address: string) => OrderService.create(address),
    onSuccess: (order) => {
      qc.invalidateQueries({ queryKey: ["cart"] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order placed successfully! 🎉");
      router.push(ROUTES.ORDER_DETAIL(order.id));
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) return <PageLoader />;

  const items = cart?.items ?? [];
  const total = cart?.total ?? 0;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <p className="text-xl font-semibold">Your cart is empty</p>
        <Button asChild>
          <Link href={ROUTES.MEALS}>Browse Meals</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Delivery form */}
        <div>
          <div className="rounded-xl border border-border/60 bg-card p-5">
            <h2 className="font-semibold flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-primary" /> Delivery Details
            </h2>
            <form
              id="checkout-form"
              onSubmit={handleSubmit((v) => placeOrder(v.deliveryAddress))}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label>Delivery Address</Label>
                <Textarea
                  rows={3}
                  placeholder="Enter your full delivery address..."
                  className={cn(errors.deliveryAddress && "border-destructive")}
                  {...register("deliveryAddress")}
                />
                {errors.deliveryAddress && (
                  <p className="text-xs text-destructive">
                    {errors.deliveryAddress.message}
                  </p>
                )}
              </div>

              <div className="rounded-lg bg-muted/50 p-3 text-sm text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  Payment Method
                </p>
                <p>💵 Cash on Delivery (COD)</p>
                <p className="text-xs mt-1">
                  Pay when your order arrives at your door.
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="rounded-xl border border-border/60 bg-card p-5 space-y-4">
            <h2 className="font-semibold">Order Summary</h2>
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-muted-foreground truncate max-w-[200px]">
                    {item.meal.name} ×{item.quantity}
                  </span>
                  <span className="font-medium">
                    {formatPrice(item.meal.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <Separator />
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span className="text-primary text-lg">{formatPrice(total)}</span>
            </div>
            <Button
              type="submit"
              form="checkout-form"
              className="w-full h-11"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Placing Order…
                </>
              ) : (
                `Place Order — ${formatPrice(total)}`
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
