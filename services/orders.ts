import { apiClient } from "@/lib/api-client"
import type { Order, OrderStatus, OrderItem } from "@/types"

type UserOrderResponse = {
  id: number | string
  status?: string
  totalPrice?: number
  deliveryAddress?: string
  createdAt?: string
}

type OrderItemResponse = {
  id: number | string
  dishId: number | string
  dishName?: string
  quantity?: number
  price?: number
  imageUrl?: string
  restaurantName?: string
  reviewed?: boolean
}

const STATUS_MAP: Record<string, OrderStatus> = {
  pending: "pending",
  preparing: "preparing",
  delivered: "completed",
  cancelled: "cancelled",
}

function mapStatus(status?: string): OrderStatus {
  if (!status) return "pending"
  const normalized = status.toLowerCase()
  return STATUS_MAP[normalized] ?? "pending"
}

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {}
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export async function fetchUserOrders(): Promise<Order[]> {
  const headers = getAuthHeaders()
  const data = await apiClient.get<UserOrderResponse[]>("/orders/user", { headers })
  return data
    .map((order) => ({
      id: String(order.id),
      createdAt: order.createdAt ?? new Date().toISOString(),
      items: [],
      totalAmount: Number(order.totalPrice ?? 0),
      deliveryAddress: order.deliveryAddress ?? "Chưa có địa chỉ",
      status: mapStatus(order.status),
    }))
    .sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
}

export async function fetchOrderItems(orderId: string | number): Promise<OrderItem[]> {
  const headers = getAuthHeaders()
  const data = await apiClient.get<OrderItemResponse[]>(`/orders/user/${orderId}`, {
    headers,
  })
  return data.map((item) => ({
    orderItemId: item.id !== undefined ? String(item.id) : undefined,
    dishId: String(item.dishId),
    restaurantId: String(item.restaurantName ?? ""),
    quantity: Number(item.quantity ?? 0),
    price: Number(item.price ?? 0),
    isRated: Boolean(item.reviewed),
    dishName: item.dishName,
    imageUrl: item.imageUrl,
    restaurantName: item.restaurantName,
  }))
}

export async function submitOrderItemReview(
  orderItemId: string | number,
  rating: number,
  comment: string,
): Promise<void> {
  const headers = getAuthHeaders()
  await apiClient.post(`/reviews/dish/${orderItemId}`, { rating, comment }, { headers })
}

export async function createOrder(data: { addressId: number; promotionCode?: string; paymentMethod?: string }): Promise<any> {
  const headers = getAuthHeaders()
  return await apiClient.post(`/orders`, data, { headers })
}

export async function createVnpayPayment(orderId: number): Promise<{ paymentUrl: string }> {
  const headers = getAuthHeaders()
  return await apiClient.post(`/payment/vnpay/create-payment?orderId=${orderId}`, {}, { headers })
}

export async function verifyVnpayPayment(queryString: string): Promise<string> {
  const headers = getAuthHeaders()
  return await apiClient.get<string>(`/payment/vnpay/payment-return${queryString}`, { headers })
}

