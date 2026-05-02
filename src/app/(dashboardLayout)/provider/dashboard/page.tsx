"use client";

import { PageLoader } from "@/components/modules/shared/LoadingSpinner";
import { OrderStatusBadge } from "@/components/modules/shared/OrderStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import { formatDateTime, formatPrice } from "@/lib/utils";
import { OrderService, ProviderService } from "@/services/api.services";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Clock,
  ShoppingBag,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";

export default function ProviderDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["provider-dashboard"],
    queryFn: ProviderService.getDashboard,
  });

  const { data: recentOrders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["provider-orders"],
    queryFn: () => OrderService.getProviderOrders(),
  });

  if (statsLoading) return <PageLoader />;

  const STAT_CARDS = [
    {
      title: "Total Revenue",
      value: formatPrice(stats?.totalRevenue ?? 0),
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      desc: "From delivered orders",
    },
    {
      title: "Total Orders",
      value: stats?.totalOrders ?? 0,
      icon: ShoppingBag,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      desc: "All time",
    },
    {
      title: "Pending Orders",
      value: stats?.pendingOrders ?? 0,
      icon: Clock,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      desc: "Awaiting action",
    },
    {
      title: "Menu Items",
      value: stats?.totalMeals ?? 0,
      icon: UtensilsCrossed,
      color: "text-primary",
      bg: "bg-primary/10",
      desc: "Active meals",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Welcome back! Here&apos;s what&apos;s happening.
          </p>
        </div>
        <Button asChild size="sm">
          <Link href={ROUTES.PROVIDER_MENU}>
            <UtensilsCrossed className="mr-1.5 h-4 w-4" /> Manage Menu
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {STAT_CARDS.map((s) => (
          <Card key={s.title} className="border-border/60">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.bg}`}
                >
                  <s.icon className={`h-5 w-5 ${s.color}`} />
                </div>
              </div>
              <p className="text-2xl font-extrabold">{s.value}</p>
              <p className="text-sm font-medium mt-0.5">{s.title}</p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="border-border/60">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-base">Recent Orders</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="gap-1 text-primary h-7"
          >
            <Link href={ROUTES.PROVIDER_ORDERS}>
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {ordersLoading ? (
            <div className="p-6 text-center text-muted-foreground text-sm">
              Loading orders…
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-3xl mb-2">📭</p>
              <p className="text-sm text-muted-foreground">
                No orders yet. Share your menu to get started!
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/60">
              {recentOrders.slice(0, 6).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between px-5 py-3.5"
                >
                  <div>
                    <p className="text-sm font-semibold">
                      #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {order._count?.orderItems ?? 0} items ·{" "}
                      {formatDateTime(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <OrderStatusBadge status={order.status} />
                    <p className="text-sm font-bold text-primary">
                      {formatPrice(order.totalPrice)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
