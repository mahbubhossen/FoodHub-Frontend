"use client";

import { PageLoader } from "@/components/modules/shared/LoadingSpinner";
import { OrderStatusBadge } from "@/components/modules/shared/OrderStatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PROVIDER_ORDER_STATUS_TRANSITIONS } from "@/constants";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { OrderService } from "@/services/api.services";
import { Order, OrderStatus } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "ALL", label: "All Orders" },
  { value: "PLACED", label: "Placed" },
  { value: "PREPARING", label: "Preparing" },
  { value: "READY", label: "Ready" },
  { value: "DELIVERED", label: "Delivered" },
  { value: "CANCELLED", label: "Cancelled" },
];

function OrderStatusUpdater({ order }: { order: Order }) {
  const qc = useQueryClient();
  const transitions = PROVIDER_ORDER_STATUS_TRANSITIONS[order.status] ?? [];

  const {
    mutate: updateStatus,
    isPending,
    variables,
  } = useMutation({
    mutationFn: (status: OrderStatus) =>
      OrderService.updateStatus(order.id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["provider-orders"] });
      toast.success("Order status updated.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (transitions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-7 gap-1 text-xs"
          disabled={isPending}
        >
          {isPending ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
          Update <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {transitions.map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => updateStatus(status as OrderStatus)}
            className="text-sm"
          >
            Mark as {status}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function ProviderOrdersPage() {
  const [statusFilter, setStatusFilter] = useState("ALL");
  const qc = useQueryClient();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["provider-orders", statusFilter],
    queryFn: () =>
      OrderService.getProviderOrders(
        statusFilter === "ALL" ? undefined : statusFilter,
      ),
  });

  if (isLoading) return <PageLoader />;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            {orders.length} order{orders.length !== 1 ? "s" : ""}
          </p>
        </div>
        {/* Status filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40 h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {STATUS_FILTERS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
          <p className="text-4xl">📭</p>
          <p className="font-semibold text-lg">No orders found</p>
          <p className="text-sm text-muted-foreground">
            {statusFilter !== "ALL"
              ? "Try a different status filter."
              : "Orders will appear here when customers place them."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-xl border border-border/60 bg-card p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                {/* Left */}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">
                      #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTime(order.createdAt)}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {order.orderItems?.length ?? order._count?.orderItems ?? 0}{" "}
                    items
                  </p>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                  <p className="text-base font-bold text-primary">
                    {formatPrice(order.totalPrice)}
                  </p>
                  <OrderStatusUpdater order={order} />
                </div>
              </div>

              {/* Items preview */}
              {order.orderItems && order.orderItems.length > 0 && (
                <div className="mt-3 pt-3 border-t border-border/60">
                  <div className="flex flex-wrap gap-1.5">
                    {order.orderItems.map((item) => (
                      <Badge
                        key={item.id}
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {item.meal.name} ×{item.quantity}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Delivery address */}
              <div className="mt-2 text-xs text-muted-foreground">
                📍 {order.deliveryAddress}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
