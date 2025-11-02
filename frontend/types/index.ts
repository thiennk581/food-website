export interface Category {
  id: string
  name: string
}

export interface Tag {
  id: string
  name: string
  categoryId: string
}

// User Types
export interface User {
  id: string
  email: string
  name: string
  phone: string
  gender: "male" | "female" | "other"
  birthdate: string
  avatarUrl?: string
  role: "user" | "admin"
  createdAt: string
  isActive: boolean
  bias: Bias[]
  address: Address[]
}


export interface Bias {
  id: string
  userId: string
  tagId: string
  score: number
}

export interface Address {
  id: string
  userId: string
  address: string
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

// Chi tiết một món ăn trong đơn hàng
export interface OrderItem {
  dishId: string
  restaurantId: String
  quantity: number
  price: number // Giá tại thời điểm đặt 
  isRated: Boolean
}

// Cấu trúc của một đơn hàng hoàn chỉnh
export interface Order {
  id: string // ID duy nhất của đơn hàng
  createdAt: string // Thời gian đặt hàng (dưới dạng ISO string)
  items: OrderItem[]
  totalAmount: number
  deliveryAddress: string // Địa chỉ giao hàng
  status: OrderStatus
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
