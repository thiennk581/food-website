import { apiClient } from "@/lib/api-client"
import type { CartItem, Dish } from "@/types"

type UserDishResponse = {
  id: number | string
  quantity: number
  dish: {
    id: number | string
    name: string
    price: number
    url?: string
    available?: boolean
    restaurant?: {
      id?: number | string
      name?: string
    }
  }
}

function getAuthHeaders(): HeadersInit {
  if (typeof window === "undefined") return {}
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function mapDish(apiDish: UserDishResponse["dish"]): Dish {
  const restaurantId =
    apiDish.restaurant?.id !== undefined && apiDish.restaurant?.id !== null
      ? String(apiDish.restaurant.id)
      : `restaurant_${apiDish.id}`

  return {
    id: String(apiDish.id),
    restaurantId,
    name: apiDish.name,
    description: "",
    price: Number(apiDish.price ?? 0),
    image: apiDish.url || "/placeholder.svg",
    category: apiDish.restaurant?.name ?? "Món ăn",
    rating: 0,
    totalReviews: 0,
    isAvailable: Boolean(apiDish.available ?? true),
    spicyLevel: "none",
    tags: [],
  }
}

export async function fetchUserCartItems(): Promise<CartItem[]> {
  const headers = getAuthHeaders()
  const data = await apiClient.get<UserDishResponse[]>("/user-dishes", { headers })
  return data.map((entry) => ({
    dish: mapDish(entry.dish),
    quantity: entry.quantity ?? 1,
  }))
}
