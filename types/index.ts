// User Types
export interface User {
  id: string
  email: string
  name: string
  phone: string
  role: "user" | "admin"
  avatar?: string
  createdAt: string
  isActive: boolean
  preferences?: UserPreferences
}

export interface UserPreferences {
  favoriteCategories: string[]
  dietaryRestrictions: string[]
  spicyLevel: "none" | "mild" | "medium" | "hot" | "extra-hot"
}

export interface Address {
  id: string
  userId: string
  label: string
  street: string
  city: string
  district: string
  isDefault: boolean
}

// Restaurant Types
export interface Restaurant {
  id: string
  name: string
  description: string
  image: string
  address: string
  phone: string
  rating: number
  totalReviews: number
  isActive: boolean
  openTime: string
  closeTime: string
  categories: string[]
}

// Dish Types
export interface Dish {
  id: string
  restaurantId: string
  name: string
  description: string
  price: number
  image: string
  category: string
  rating: number
  totalReviews: number
  isAvailable: boolean
  spicyLevel: "none" | "mild" | "medium" | "hot" | "extra-hot"
  tags: string[]
}

// Cart Types
export interface CartItem {
  dish: Dish
  quantity: number
  note?: string
}

export interface Cart {
  items: CartItem[]
  restaurantId: string
}

// Order Types
export type OrderStatus = "pending" | "confirmed" | "preparing" | "delivering" | "completed" | "cancelled"

export interface Order {
  id: string
  userId: string
  restaurantId: string
  items: OrderItem[]
  status: OrderStatus
  totalAmount: number
  deliveryAddress: Address
  note?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  dishId: string
  dishName: string
  dishImage: string
  quantity: number
  price: number
  note?: string
}

// Review Types
export interface Review {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  dishId: string
  orderId: string
  rating: number
  comment: string
  images?: string[]
  createdAt: string
}

// Stats Types
export interface DashboardStats {
  totalRevenue: number
  totalOrders: number
  totalUsers: number
  totalRestaurants: number
  revenueChange: number
  ordersChange: number
  usersChange: number
}

export interface RevenueData {
  date: string
  revenue: number
  orders: number
}
