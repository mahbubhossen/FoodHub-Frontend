import { OrderStatus } from "@/types";

export const APP_NAME = "FoodHub";

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  MEALS: "/meals",
  MEAL_DETAIL: (id: string) => `/meals/${id}`,
  PROVIDER_DETAIL: (id: string) => `/providers/${id}`,
  // Customer
  CART: "/cart",
  CHECKOUT: "/checkout",
  ORDERS: "/orders",
  ORDER_DETAIL: (id: string) => `/orders/${id}`,
  PROFILE: "/profile",
  // Provider
  PROVIDER_SETUP: "/provider/setup-profile",
  PROVIDER_DASH: "/provider/dashboard",
  PROVIDER_MENU: "/provider/menu",
  PROVIDER_ORDERS: "/provider/orders",
  // Admin
  ADMIN_DASH: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_CATEGORIES: "/admin/categories",
} as const;

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PLACED: "Order Placed",
  PREPARING: "Preparing",
  READY: "Ready for Pickup",
  DELIVERED: "Delivered",
  CANCELLED: "Cancelled",
};

export const ORDER_STATUS_COLOR: Record<OrderStatus, string> = {
  PLACED: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  PREPARING:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  READY:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  DELIVERED:
    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export const DIETARY_TAG_OPTIONS = [
  { value: "halal", label: "Halal" },
  { value: "vegan", label: "Vegan" },
  { value: "vegetarian", label: "Vegetarian" },
  { value: "gluten-free", label: "Gluten Free" },
  { value: "spicy", label: "Spicy" },
  { value: "dairy-free", label: "Dairy Free" },
];

export const PROVIDER_ORDER_STATUS_TRANSITIONS: Record<string, string[]> = {
  PLACED: ["PREPARING", "CANCELLED"],
  PREPARING: ["READY"],
  READY: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

export const API_BASE = "/api";