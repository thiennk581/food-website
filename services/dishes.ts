import { apiClient } from "@/lib/api-client"
import type { AdminDish } from "@/types"

type DishApiResponse = {
  id: number | string
  name: string
  price: number
  url?: string
  rating?: number
  available?: boolean
  restaurant?: {
    id?: number | string
    name?: string
  }
}

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {}
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function mapDish(dish: DishApiResponse): AdminDish {
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

export async function fetchAdminDishes(): Promise<AdminDish[]> {
  const headers = getAuthHeaders()
  const data = await apiClient.get<DishApiResponse[]>("/dishes", { headers })
  return data.map(mapDish)
}
