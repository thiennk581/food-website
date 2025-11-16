import { apiClient } from "@/lib/api-client"
import type { Order, OrderStatus } from "@/types"

type UserOrderResponse = {
  id: number | string
  status?: string
  totalPrice?: number
  deliveryAddress?: string
  createdAt?: string
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
  return data.map((order) => ({
    id: String(order.id),
    createdAt: order.createdAt ?? new Date().toISOString(),
    items: [],
    totalAmount: Number(order.totalPrice ?? 0),
    deliveryAddress: order.deliveryAddress ?? "Chưa có địa chỉ",
    status: mapStatus(order.status),
  }))
}
