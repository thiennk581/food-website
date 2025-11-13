import { apiClient } from "@/lib/api-client"
import type { AdminDish, Dish } from "@/types"

export type DishApiResponse = {
  id: number | string
  name: string
  description?: string
  price: number
  url?: string
  rating?: number
  totalReviews?: number
  available?: boolean
  tags?: {
    id?: number | string
    name: string
    category?: {
      id?: number | string
      name?: string
    }
  }[]
  restaurant?: {
    id?: number | string
    name?: string
    address?: string
    phoneNumber?: string
    available?: boolean
  }
}

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {}
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function mapAdminDish(dish: DishApiResponse): AdminDish {
  return {
    id: String(dish.id),
    name: dish.name,
    price: Number(dish.price ?? 0),
    rating: typeof dish.rating === "number" ? dish.rating : 0,
    image: dish.url || "",
    isAvailable: Boolean(dish.available),
    restaurantName: dish.restaurant?.name ?? "Không rõ",
  }
}

export async function fetchDishesRaw(): Promise<DishApiResponse[]> {
  const headers = getAuthHeaders()
  return apiClient.get<DishApiResponse[]>("/dishes", { headers })
}

export async function fetchAdminDishes(): Promise<AdminDish[]> {
  const data = await fetchDishesRaw()
  return data.map(mapAdminDish)
}
