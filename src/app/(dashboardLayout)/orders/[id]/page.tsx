"use client";

import { use, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Loader2, MapPin, Star, X } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { OrderService, ReviewService } from "@/services/api.services";
import { ROUTES } from "@/constants";
import { formatPrice, formatDateTime } from "@/lib/utils";
import { OrderStatusBadge } from "@/components/modules/shared/OrderStatusBadge";
import { PageLoader } from "@/components/modules/shared/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const qc = useQueryClient();
  const [reviewMealId, setReviewMealId] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => OrderService.getById(id),
  });

  const { mutate: cancelOrder, isPending: cancelling } = useMutation({
    mutationFn: () => OrderService.cancel(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["order", id] });
      qc.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Order cancelled.");
    },
    onError: (err: Error) => toast.error(err.message),
  });

  const { mutate: submitReview, isPending: reviewing } = useMutation({
    mutationFn: () =>
      ReviewService.create({
        orderId: id,
        mealId: reviewMealId!,
        rating,
        comment,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["order", id] });
      toast.success("Review submitted! Thank you.");
      setReviewOpen(false);
      setComment("");
      setRating(5);
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (isLoading) return <PageLoader />;
  if (!order)
    return <div className="container py-20 text-center">Order not found.</div>;

  const canCancel = order.status === "PLACED";
  const canReview = order.status === "DELIVERED";
  const reviewedIds = new Set((order.reviews ?? []).map((r) => r.mealId));

  return (
    <div>
      <Link
        href={ROUTES.ORDERS}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to orders
      </Link>

      <div className="flex flex-wrap items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">
          Order #{order.id.slice(-8).toUpperCase()}
        </h1>
        <OrderStatusBadge status={order.status} />
        {canCancel && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => cancelOrder()}
            disabled={cancelling}
          >
            {cancelling ? (
              <>
                <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                Cancelling
              </>
            ) : (
              <>
                <X className="mr-1.5 h-3 w-3" />
                Cancel Order
              </>
            )}
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="font-semibold text-lg">Items Ordered</h2>
          {(order.orderItems ?? []).map((item) => (
            <div
              key={item.id}
              className="flex gap-4 rounded-xl border border-border/60 bg-card p-4 items-center"
            >
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                {item.meal.imageUrl ? (
                  <Image
                    src={item.meal.imageUrl}
                    alt={item.meal.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xl">
                    🍽️
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">{item.meal.name}</p>
                <p className="text-xs text-muted-foreground">
                  ×{item.quantity} @ {formatPrice(item.unitPrice)}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">
                  {formatPrice(item.unitPrice * item.quantity)}
                </p>
                {canReview && !reviewedIds.has(item.meal.id) && (
                  <Dialog
                    open={reviewOpen && reviewMealId === item.meal.id}
                    onOpenChange={(o) => {
                      setReviewOpen(o);
                      if (!o) setReviewMealId(null);
                    }}
                  >
                    <DialogTrigger asChild>
                      <button
                        className="mt-1 text-xs text-primary hover:underline"
                        onClick={() => setReviewMealId(item.meal.id)}
                      >
                        Leave review
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Review: {item.meal.name}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4 mt-2">
                        <div>
                          <p className="text-sm font-medium mb-2">Rating</p>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((n) => (
                              <button key={n} onClick={() => setRating(n)}>
                                <Star
                                  className={`h-7 w-7 transition-colors ${n <= rating ? "fill-orange-400 text-orange-400" : "text-muted-foreground"}`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-sm font-medium">
                            Comment (optional)
                          </p>
                          <Textarea
                            rows={3}
                            placeholder="Share your experience…"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                          />
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => submitReview()}
                          disabled={reviewing}
                        >
                          {reviewing ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting…
                            </>
                          ) : (
                            "Submit Review"
                          )}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border/60 bg-card p-5 space-y-3">
            <h2 className="font-semibold">Order Info</h2>
            <div className="text-sm space-y-2 text-muted-foreground">
              <div className="flex justify-between">
                <span>Status</span>
                <OrderStatusBadge status={order.status} />
              </div>
              <div className="flex justify-between">
                <span>Total</span>
                <span className="font-bold text-foreground">
                  {formatPrice(order.totalPrice)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Payment</span>
                <span>{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span>Ordered</span>
                <span>{formatDateTime(order.createdAt)}</span>
              </div>
            </div>
            <Separator />
            {order.provider && (
              <div>
                <p className="text-xs font-semibold mb-1">Restaurant</p>
                <p className="text-sm">{order.provider.restaurantName}</p>
                {order.provider.phone && (
                  <p className="text-xs text-muted-foreground">
                    {order.provider.phone}
                  </p>
                )}
              </div>
            )}
            <Separator />
            <div>
              <p className="text-xs font-semibold mb-1 flex items-center gap-1">
                <MapPin className="h-3 w-3 text-primary" />
                Delivery Address
              </p>
              <p className="text-sm text-muted-foreground">
                {order.deliveryAddress}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
