// ── ORDERS LIST ── src/app/(dashboardLayout)/orders/page.tsx ──────────────
"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { OrderService } from "@/services/api.services";
import { ROUTES } from "@/constants";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/modules/shared/OrderStatusBadge";
import { PageLoader } from "@/components/modules/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";

export default function OrdersPage() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", "my"],
    queryFn: OrderService.getMyOrders,
  });

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <p className="text-4xl">📦</p>
          <p className="text-lg font-semibold">No orders yet</p>
          <p className="text-muted-foreground text-sm">
            Start by browsing our delicious meals
          </p>
          <Button asChild>
            <Link href={ROUTES.MEALS}>Browse Meals</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={ROUTES.ORDER_DETAIL(order.id)}
              className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-xl border border-border/60 bg-card p-4 transition-all hover:border-primary/40 hover:shadow-sm"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-sm font-semibold">
                    #{order.id.slice(-8).toUpperCase()}
                  </p>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {order.provider?.restaurantName} ·{" "}
                  {order._count?.orderItems ?? 0} items
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(order.createdAt)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-base font-bold text-primary">
                  {formatPrice(order.totalPrice)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {order.paymentMethod}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
