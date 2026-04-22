// ─── Auth & User ───────────────────────────────────────────────────────────

export type UserRole = "CUSTOMER" | "PROVIDER" | "ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone?: string;
  address?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  user: User;
  session: { id: string; expiresAt: string };
}

// ─── Provider Profile ──────────────────────────────────────────────────────

export interface ProviderProfile {
  id: string;
  userId: string;
  restaurantName: string;
  description?: string;
  logoUrl?: string;
  address: string;
  phone?: string;
  isOpen: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    meals: number;
    orders: number;
  };
}

// ─── Category ──────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  _count?: { meals: number };
}

// ─── Meal ──────────────────────────────────────────────────────────────────

export interface Meal {
  id: string;
  providerId: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  dietaryTags?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
  category?: Pick<Category, "id" | "name" | "slug">;
  provider?: Pick<ProviderProfile, "id" | "restaurantName" | "logoUrl">;
  reviews?: Review[];
  _count?: {
    reviews: number;
    orderItems: number;
  };
}

// ─── Cart ──────────────────────────────────────────────────────────────────

export interface CartItem {
  id: string;
  userId: string;
  mealId: string;
  quantity: number;
  createdAt: string;
  meal: Meal;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// ─── Order ─────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "PLACED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

export interface OrderItem {
  id: string;
  orderId: string;
  mealId: string;
  quantity: number;
  unitPrice: number;
  meal: Pick<Meal, "id" | "name" | "imageUrl" | "price">;
}

export interface Order {
  id: string;
  customerId: string;
  providerId: string;
  status: OrderStatus;
  deliveryAddress: string;
  totalPrice: number;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  provider?: Pick<
    ProviderProfile,
    "id" | "restaurantName" | "logoUrl" | "address" | "phone"
  >;
  orderItems?: OrderItem[];
  reviews?: Review[];
  _count?: { orderItems: number };
}

// ─── Review ────────────────────────────────────────────────────────────────

export interface Review {
  id: string;
  customerId: string;
  mealId: string;
  orderId: string;
  rating: number;
  comment?: string;
  createdAt: string;
  meal?: Pick<Meal, "id" | "name" | "imageUrl">;
}

// ─── API Response wrappers ─────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  error: string;
  details?: unknown;
}

// ─── Admin Dashboard ───────────────────────────────────────────────────────

export interface AdminStats {
  users: {
    total: number;
    customers: number;
    providers: number;
    suspended: number;
  };
  meals: {
    total: number;
    available: number;
  };
  categories: number;
  orders: {
    total: number;
    placed: number;
    preparing: number;
    delivered: number;
    cancelled: number;
  };
  revenue: number;
  totalReviews: number;
}

export interface ProviderDashboardStats {
  totalMeals: number;
  totalOrders: number;
  pendingOrders: number;
  activeOrders: number;
  totalRevenue: number;
}
