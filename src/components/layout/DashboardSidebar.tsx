"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ROUTES } from "@/constants";
import { signOut, useSession } from "@/lib/auth-client";
import { cn, getInitials } from "@/lib/utils";
import {
  ChefHat,
  LayoutDashboard,
  ListOrdered,
  LogOut,
  ShoppingBag,
  ShoppingCart,
  Tag,
  User,
  Users,
  UtensilsCrossed,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";

const CUSTOMER_LINKS = [
  { href: ROUTES.ORDERS, label: "My Orders", icon: ShoppingBag },
  { href: ROUTES.CART, label: "Cart", icon: ShoppingCart },
  { href: ROUTES.PROFILE, label: "Profile", icon: User },
];

const PROVIDER_LINKS = [
  { href: ROUTES.PROVIDER_DASH, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.PROVIDER_MENU, label: "My Menu", icon: UtensilsCrossed },
  { href: ROUTES.PROVIDER_ORDERS, label: "Orders", icon: ListOrdered },
  { href: ROUTES.PROVIDER_SETUP, label: "Profile", icon: ChefHat },

];

const ADMIN_LINKS = [
  { href: ROUTES.ADMIN_DASH, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.ADMIN_USERS, label: "Users", icon: Users },
  { href: ROUTES.ADMIN_ORDERS, label: "Orders", icon: ListOrdered },
  { href: ROUTES.ADMIN_CATEGORIES, label: "Categories", icon: Tag },
];

export function DashboardSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const user = session?.user as unknown as {
    role: string;
    name?: string;
    image?: string;
  };

  const links =
    user?.role === "ADMIN"
      ? ADMIN_LINKS
      : user?.role === "PROVIDER"
        ? PROVIDER_LINKS
        : CUSTOMER_LINKS;

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out.");
    router.push(ROUTES.HOME);
    router.refresh();
  };

  return (
    <aside className="flex w-60 flex-col border-r border-border bg-card h-full">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 px-5 border-b border-border">
        <Link
          href={ROUTES.HOME}
          className="flex items-center gap-2 font-bold text-lg"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <ChefHat className="h-4 w-4" />
          </span>
          <span className="text-primary">Food</span>
          <span>Hub</span>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={user?.image} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
              {getInitials(user?.name ?? "U")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{user?.name}</p>
            <Badge className="mt-0.5 h-4 text-[10px] px-1.5 bg-primary/10 text-primary hover:bg-primary/10 border-0">
              {user?.role}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="p-3 border-t border-border">
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
