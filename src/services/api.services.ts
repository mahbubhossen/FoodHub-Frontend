import axiosInstance from "@/lib/axios";
import {
  AdminStats,
  Cart,
  CartItem,
  Category,
  Meal,
  Order,
  OrderStatus,
  PaginatedResponse,
  ProviderDashboardStats,
  ProviderProfile,
  Review,
  User,
} from "@/types";

// ─── Meals ─────────────────────────────────────────────────────────────────

export const MealService = {
  getAll: (params?: Record<string, unknown>) =>
    axiosInstance
      .get<PaginatedResponse<Meal>>("/meals", { params })
      .then((r) => r.data),

  getById: (id: string) =>
    axiosInstance.get<Meal>(`/meals/${id}`).then((r) => r.data),

  getProviderMeals: () =>
    axiosInstance.get<Meal[]>("/meals/provider/my-meals").then((r) => r.data),

  create: (data: Partial<Meal>) =>
    axiosInstance.post<Meal>("/meals/provider", data).then((r) => r.data),

  update: (id: string, data: Partial<Meal>) =>
    axiosInstance.put<Meal>(`/meals/provider/${id}`, data).then((r) => r.data),

  delete: (id: string) =>
    axiosInstance.delete(`/meals/provider/${id}`).then((r) => r.data),
};

// ─── Providers ─────────────────────────────────────────────────────────────

export const ProviderService = {
  getAll: (params?: Record<string, unknown>) =>
    axiosInstance
      .get<PaginatedResponse<ProviderProfile>>("/providers", { params })
      .then((r) => r.data),

  getById: (id: string) =>
    axiosInstance
      .get<ProviderProfile & { meals: Meal[] }>(`/providers/${id}`)
      .then((r) => r.data),

  getMyProfile: () =>
    axiosInstance
      .get<ProviderProfile>("/providers/me/profile")
      .then((r) => r.data),

  getDashboard: () =>
    axiosInstance
      .get<ProviderDashboardStats>("/providers/me/dashboard")
      .then((r) => r.data),

  createProfile: (data: Partial<ProviderProfile>) =>
    axiosInstance
      .post<ProviderProfile>("/providers/me/profile", data)
      .then((r) => r.data),

  updateProfile: (data: Partial<ProviderProfile>) =>
    axiosInstance
      .patch<ProviderProfile>("/providers/me/profile", data)
      .then((r) => r.data),
};

// ─── Categories ────────────────────────────────────────────────────────────

export const CategoryService = {
  getAll: () =>
    axiosInstance.get<Category[]>("/categories").then((r) => r.data),

  getById: (id: string) =>
    axiosInstance.get<Category>(`/categories/${id}`).then((r) => r.data),

  create: (data: { name: string; slug?: string }) =>
    axiosInstance.post<Category>("/categories", data).then((r) => r.data),

  update: (id: string, data: Partial<Category>) =>
    axiosInstance
      .patch<Category>(`/categories/${id}`, data)
      .then((r) => r.data),

  delete: (id: string) =>
    axiosInstance.delete(`/categories/${id}`).then((r) => r.data),
};

// ─── Cart ──────────────────────────────────────────────────────────────────

export const CartService = {
  get: () => axiosInstance.get<Cart>("/cart").then((r) => r.data),

  addItem: (mealId: string, quantity = 1) =>
    axiosInstance
      .post<CartItem>("/cart", { mealId, quantity })
      .then((r) => r.data),

  updateItem: (cartItemId: string, quantity: number) =>
    axiosInstance
      .patch<CartItem>(`/cart/${cartItemId}`, { quantity })
      .then((r) => r.data),

  removeItem: (cartItemId: string) =>
    axiosInstance.delete(`/cart/${cartItemId}`).then((r) => r.data),

  clear: () => axiosInstance.delete("/cart/clear").then((r) => r.data),
};

// ─── Orders ────────────────────────────────────────────────────────────────

export const OrderService = {
  create: (deliveryAddress: string) =>
    axiosInstance
      .post<Order>("/orders", { deliveryAddress })
      .then((r) => r.data),

  getMyOrders: () =>
    axiosInstance.get<Order[]>("/orders/my").then((r) => r.data),

  getById: (id: string) =>
    axiosInstance.get<Order>(`/orders/${id}`).then((r) => r.data),

  cancel: (id: string) =>
    axiosInstance.patch<Order>(`/orders/${id}/cancel`).then((r) => r.data),

  getProviderOrders: (status?: string) =>
    axiosInstance
      .get<
        Order[]
      >("/orders/provider", { params: status ? { status } : undefined })
      .then((r) => r.data),

  updateStatus: (id: string, status: OrderStatus) =>
    axiosInstance
      .patch<Order>(`/orders/provider/${id}/status`, { status })
      .then((r) => r.data),
};

// ─── Reviews ───────────────────────────────────────────────────────────────

export const ReviewService = {
  getMealReviews: (mealId: string, params?: Record<string, unknown>) =>
    axiosInstance
      .get<{
        data: Review[];
        averageRating: number | null;
        pagination: unknown;
      }>(`/reviews/meal/${mealId}`, { params })
      .then((r) => r.data),

  create: (data: {
    orderId: string;
    mealId: string;
    rating: number;
    comment?: string;
  }) => axiosInstance.post<Review>("/reviews", data).then((r) => r.data),

  getMyReviews: () =>
    axiosInstance.get<Review[]>("/reviews/my").then((r) => r.data),

  delete: (id: string) =>
    axiosInstance.delete(`/reviews/${id}`).then((r) => r.data),
};

// ─── Admin ─────────────────────────────────────────────────────────────────

export const AdminService = {
  getStats: () =>
    axiosInstance.get<AdminStats>("/admin/stats").then((r) => r.data),

  getAllUsers: (params?: Record<string, unknown>) =>
    axiosInstance
      .get<PaginatedResponse<User>>("/admin/users", { params })
      .then((r) => r.data),

  getUserById: (id: string) =>
    axiosInstance
      .get<User & { providerProfile?: ProviderProfile }>(`/admin/users/${id}`)
      .then((r) => r.data),

  updateUserStatus: (id: string, status: "ACTIVE" | "SUSPENDED") =>
    axiosInstance
      .patch<User>(`/admin/users/${id}`, { status })
      .then((r) => r.data),

  getAllOrders: (params?: Record<string, unknown>) =>
    axiosInstance
      .get<PaginatedResponse<Order>>("/admin/orders", { params })
      .then((r) => r.data),
};
