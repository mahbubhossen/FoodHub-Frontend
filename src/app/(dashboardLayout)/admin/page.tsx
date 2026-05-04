"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  ShoppingBag,
  UtensilsCrossed,
  Tag,
  TrendingUp,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";
import { AdminService } from "@/services/api.services";
import { ROUTES } from "@/constants";
import { formatPrice } from "@/lib/utils";
import { PageLoader } from "@/components/modules/shared/LoadingSpinner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/lib/auth-client";

export default function AdminDashboardPage() {
  const { data: session } = useSession();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: AdminService.getStats,
  });



  if (isLoading) return <PageLoader />;

  const TOP_CARDS = [
    {
      title: "Total Revenue",
      value: formatPrice(stats?.revenue ?? 0),
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      sub: "From delivered orders",
    },
    {
      title: "Total Users",
      value: stats?.users.total ?? 0,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      sub: `${stats?.users.providers ?? 0} providers · ${stats?.users.customers ?? 0} customers`,
    },
    {
      title: "Total Orders",
      value: stats?.orders.total ?? 0,
      icon: ShoppingBag,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      sub: `${stats?.orders.placed ?? 0} pending action`,
    },
    {
      title: "Menu Items",
      value: stats?.meals.total ?? 0,
      icon: UtensilsCrossed,
      color: "text-primary",
      bg: "bg-primary/10",
      sub: `${stats?.meals.available ?? 0} available`,
    },
  ];

  const ORDER_BREAKDOWN = [
    { label: "Placed", value: stats?.orders.placed ?? 0, color: "bg-blue-500" },
    {
      label: "Preparing",
      value: stats?.orders.preparing ?? 0,
      color: "bg-orange-500",
    },
    {
      label: "Delivered",
      value: stats?.orders.delivered ?? 0,
      color: "bg-emerald-500",
    },
    {
      label: "Cancelled",
      value: stats?.orders.cancelled ?? 0,
      color: "bg-red-500",
    },
  ];

  const total = stats?.orders.total ?? 1;


  console.log("CLIENT SESSION:", session);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-0.5">
          Platform overview and key metrics
        </p>
      </div>

      {/* Suspended users warning */}
      {(stats?.users.suspended ?? 0) > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-orange-200 bg-orange-50 p-4 dark:border-orange-900/40 dark:bg-orange-950/20">
          <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0" />
          <p className="text-sm text-orange-800 dark:text-orange-300">
            <span className="font-semibold">{stats?.users.suspended}</span>{" "}
            suspended user{(stats?.users.suspended ?? 0) > 1 ? "s" : ""} on the
            platform.
          </p>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="ml-auto h-7 text-xs border-orange-300"
          >
            <Link href={ROUTES.ADMIN_USERS}>Review</Link>
          </Button>
        </div>
      )}

      {/* Top metric cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {TOP_CARDS.map((c) => (
          <Card key={c.title} className="border-border/60">
            <CardContent className="p-5">
              <div
                className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${c.bg}`}
              >
                <c.icon className={`h-5 w-5 ${c.color}`} />
              </div>
              <p className="text-2xl font-extrabold">{c.value}</p>
              <p className="text-sm font-medium mt-0.5">{c.title}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{c.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Order breakdown */}
        <Card className="border-border/60">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Order Status Breakdown</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="gap-1 text-primary h-7"
            >
              <Link href={ROUTES.ADMIN_ORDERS}>
                View orders <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {ORDER_BREAKDOWN.map((row) => (
              <div key={row.label}>
                <div className="flex justify-between mb-1.5">
                  <span className="text-sm text-muted-foreground">
                    {row.label}
                  </span>
                  <span className="text-sm font-semibold">{row.value}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full ${row.color} transition-all duration-500`}
                    style={{
                      width: `${Math.round((row.value / total) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick links */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {[
              {
                href: ROUTES.ADMIN_USERS,
                icon: Users,
                label: "Manage Users",
                count: stats?.users.total,
              },
              {
                href: ROUTES.ADMIN_ORDERS,
                icon: ShoppingBag,
                label: "View All Orders",
                count: stats?.orders.total,
              },
              {
                href: ROUTES.ADMIN_CATEGORIES,
                icon: Tag,
                label: "Manage Categories",
                count: stats?.categories,
              },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <l.icon className="h-4 w-4" />
                </div>
                <span className="flex-1 text-sm font-medium">{l.label}</span>
                <Badge variant="secondary" className="text-xs">
                  {l.count}
                </Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
