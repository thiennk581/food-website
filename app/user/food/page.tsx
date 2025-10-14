"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/hooks/use-cart"
import { mockDishes, mockRestaurants } from "@/lib/mock-data"
import { Search, Star, Plus, Flame } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function FoodPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")
  const { addToCart } = useCart()
  const { toast } = useToast()

  const categories = ["all", "Noodles", "Rice", "Sandwiches"]

  const filteredDishes = mockDishes.filter((dish) => {
    const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || dish.category === selectedCategory
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "low" && dish.price < 40000) ||
      (priceFilter === "medium" && dish.price >= 40000 && dish.price < 60000) ||
      (priceFilter === "high" && dish.price >= 60000)

    return matchesSearch && matchesCategory && matchesPrice && dish.isAvailable
  })

  const handleAddToCart = (dish: (typeof mockDishes)[0]) => {
    addToCart(dish)
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${dish.name} đã được thêm vào giỏ hàng`,
    })
  }

  const getRestaurantName = (restaurantId: string) => {
    return mockRestaurants.find((r) => r.id === restaurantId)?.name || ""
  }

  const getSpicyIcon = (level: string) => {
    if (level === "none") return null
    return <Flame className="h-3 w-3 text-orange-500" />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Khám phá món ăn</h1>
        <p className="mt-2 text-muted-foreground">Tìm kiếm và đặt món ăn yêu thích của bạn</p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm món ăn..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Danh mục" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            {categories.slice(1).map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={priceFilter} onValueChange={setPriceFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Giá" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="low">Dưới 40k</SelectItem>
            <SelectItem value="medium">40k - 60k</SelectItem>
            <SelectItem value="high">Trên 60k</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dishes Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredDishes.map((dish) => (
          <Card key={dish.id} className="overflow-hidden transition-shadow hover:shadow-lg">
            <div className="relative aspect-[4/3] overflow-hidden bg-muted">
              <Image src={dish.image || "/placeholder.svg"} alt={dish.name} fill className="object-cover" />
              {dish.tags.includes("Popular") && (
                <Badge className="absolute right-2 top-2" variant="secondary">
                  Phổ biến
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="line-clamp-1 font-semibold text-card-foreground">{dish.name}</h3>
                {getSpicyIcon(dish.spicyLevel)}
              </div>
              <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">{dish.description}</p>
              <p className="mb-2 text-xs text-muted-foreground">{getRestaurantName(dish.restaurantId)}</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{dish.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">({dish.totalReviews})</span>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t border-border p-4">
              <span className="text-lg font-bold text-primary">{dish.price.toLocaleString("vi-VN")}đ</span>
              <Button size="sm" onClick={() => handleAddToCart(dish)}>
                <Plus className="mr-1 h-4 w-4" />
                Thêm
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredDishes.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Không tìm thấy món ăn phù hợp</p>
        </div>
      )}
    </div>
  )
}
