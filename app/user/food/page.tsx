"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/hooks/use-cart"
import { mockDishes, mockRestaurants, mockReviews } from "@/lib/mock-data"
import { Search, Star, Plus, Flame, MessageCircle, MapPin, Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function FoodPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")
  const [selectedDishId, setSelectedDishId] = useState<string | null>(null)
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

  useEffect(() => {
    if (!filteredDishes.length) {
      setSelectedDishId(null)
      return
    }

    const isSelectedVisible = filteredDishes.some((dish) => dish.id === selectedDishId)
    if (!isSelectedVisible) {
      setSelectedDishId(filteredDishes[0].id)
    }
  }, [filteredDishes, selectedDishId])

  const selectedDish = useMemo(
    () => filteredDishes.find((dish) => dish.id === selectedDishId) ?? filteredDishes[0],
    [filteredDishes, selectedDishId],
  )

  const selectedDishReviews = useMemo(() => {
    if (!selectedDish) return []
    return mockReviews.filter((review) => review.dishId === selectedDish.id)
  }, [selectedDish])

  const overallRating = useMemo(() => {
    if (!selectedDishReviews.length) return null
    const total = selectedDishReviews.reduce((sum, review) => sum + review.rating, 0)
    return (total / selectedDishReviews.length).toFixed(1)
  }, [selectedDishReviews])

  const handleAddToCart = (dish: (typeof mockDishes)[0]) => {
    addToCart(dish)
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${dish.name} đã được thêm vào giỏ hàng`,
    })
  }

  const getRestaurant = (restaurantId: string) => {
    return mockRestaurants.find((r) => r.id === restaurantId)
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

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Dishes Grid */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filteredDishes.map((dish) => {
            const isSelected = selectedDish?.id === dish.id
            const restaurant = getRestaurant(dish.restaurantId)
            return (
              <Card
                key={dish.id}
                tabIndex={0}
                role="button"
                onClick={() => setSelectedDishId(dish.id)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault()
                    setSelectedDishId(dish.id)
                  }
                }}
                className={`overflow-hidden border-2 transition-all focus:outline-none ${
                  isSelected ? "border-primary shadow-lg" : "border-border/50 hover:border-primary/70 hover:shadow-lg"
                }`}
              >
                <CardContent className="space-y-4 p-0">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Image src={dish.image || "/placeholder.svg"} alt={dish.name} fill className="object-cover" />
                    {dish.tags.includes("Popular") && (
                      <Badge className="absolute right-2 top-2 rounded-full bg-primary px-3 py-1 text-xs text-primary-foreground shadow-sm">
                        Phổ biến
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-3 px-4 pb-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="line-clamp-1 text-lg font-semibold text-card-foreground">{dish.name}</h3>
                        {restaurant && <p className="text-xs text-muted-foreground">{restaurant.name}</p>}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-semibold">{dish.rating}</span>
                        <span className="text-xs text-muted-foreground">({dish.totalReviews})</span>
                      </div>
                    </div>
                    <p className="line-clamp-2 text-sm text-muted-foreground">{dish.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {dish.tags.slice(0, 4).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="rounded-full border-primary/20 bg-primary/5 px-2 text-xs font-medium text-primary"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex items-center justify-between border-t border-border bg-muted/20 p-4">
                  <span className="text-xl font-semibold text-primary">{dish.price.toLocaleString("vi-VN")}đ</span>
                  <Button
                    size="sm"
                    className="min-w-[110px] rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-[0_8px_16px_rgba(34,197,94,0.2)] hover:bg-primary/90"
                    onClick={() => handleAddToCart(dish)}
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Thêm
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Reviews Panel */}
        <aside className="h-fit rounded-xl border border-border bg-card shadow-sm">
          <div className="space-y-4 border-b border-border p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Đánh giá</h2>
              {selectedDish && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{selectedDish.totalReviews} lượt</span>
                  
                </div>
              )}
            </div>
            {overallRating && (
                <p className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
                  Đánh giá trung bình: 
                  <span className="flex items-center gap-1 font-semibold text-foreground">
                    {overallRating}
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    
                  </span>
                </p>
              )}
            {selectedDish && (() => {
              const restaurant = getRestaurant(selectedDish.restaurantId)
              if (!restaurant) return null
              return (
                <div className="space-y-3 rounded-lg border border-border bg-muted/20 p-3">

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-foreground">{restaurant.name}</p>
                    <div className="flex items-start gap-2 text-xs text-muted-foreground">
                      <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                      <span>{restaurant.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Phone className="h-4 w-4 text-primary" />
                      <span>{restaurant.phone}</span>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>

          <div className="flex max-h-[520px] flex-col gap-3 overflow-y-auto p-4">
            {selectedDishReviews.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                <MessageCircle className="mb-2 h-5 w-5" />
                Chưa có đánh giá nào cho món ăn này.
              </div>
            )}

            {selectedDishReviews.map((review) => (
              <div key={review.id} className="rounded-lg border border-border bg-muted/30 p-4">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-medium text-card-foreground">{review.userName}</p>
                  <div className="flex items-center gap-1 text-sm text-amber-500">
                    <Star className="h-4 w-4 fill-current" />
                    <span>{review.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
                <p className="mt-3 text-xs text-muted-foreground">
                  {new Intl.DateTimeFormat("vi-VN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(review.createdAt))}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {filteredDishes.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Không tìm thấy món ăn phù hợp</p>
        </div>
      )}
    </div>
  )
}
