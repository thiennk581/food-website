"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCart } from "@/hooks/use-cart"
import {
  mockDishes,
  mockRestaurants,
  allMockReviews,
  cuisineOptions,
  ingredientOptions,
  methodOptions,
  flavorOptions,
  dishMetadata,
  type DishFilterOption,
} from "@/lib/mock-data"
import { Search, Star, Plus, Flame, MessageCircle, MapPin, Phone, RotateCcw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { Dish, Review } from "@/types"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

// --- (Các component con giữ nguyên, không thay đổi) ---
const DEFAULT_DISH_META = {
  cuisine: "Món Việt",
  mainIngredients: [] as string[],
  cookMethods: [] as string[],
  flavorProfiles: [] as string[],
}

type FilterSelectProps = {
  label: string
  value: string
  options: DishFilterOption[]
  onValueChange: (value: string) => void
}

const FilterSelect = ({ label, value, options, onValueChange }: FilterSelectProps) => {
  const selectedOptionLabel = options.find((option) => option.value === value)?.label

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full text-left h-auto py-6">
        <div className="flex flex-col items-start">
          <span className="text-xs text-muted-foreground">{label}</span>
          <span className="text-sm font-medium text-foreground">{selectedOptionLabel}</span>
        </div>
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

type FloatingLabelInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string
}

const FloatingLabelInput = ({ label, id, className, ...props }: FloatingLabelInputProps) => {
  return (
    <div className="relative">
      <Input
        id={id}
        placeholder=" "
        className={cn("peer h-13 pt-6 text-foreground", className)}
        {...props}
      />
      <label
        htmlFor={id}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-all duration-200 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-base peer-focus:top-4 peer-focus:text-xs peer-[:not(:placeholder-shown)]:top-4 peer-[:not(:placeholder-shown)]:text-xs"
      >
        {label}
      </label>
    </div>
  )
}

type PriceRangeFilterProps = {
  minPrice: string
  maxPrice: string
  onMinPriceChange: (value: string) => void
  onMaxPriceChange: (value: string) => void
}

const PriceRangeFilter = ({ minPrice, maxPrice, onMinPriceChange, onMaxPriceChange }: PriceRangeFilterProps) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium text-foreground whitespace-nowrap">Mức giá</span>
      <div className="flex items-center gap-2 flex-1">
        <FloatingLabelInput
          id="min-price"
          type="number"
          label="Mức giá từ"
          value={minPrice}
          onChange={(e) => onMinPriceChange(e.target.value)}
        />
        <span className="text-muted-foreground">-</span>
        <FloatingLabelInput
          id="max-price"
          type="number"
          label="Mức giá đến"
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(e.target.value)}
        />
      </div>
    </div>
  )
}

// --- Component chính ---
export default function FoodPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCuisine, setSelectedCuisine] = useState("all")
  const [selectedIngredient, setSelectedIngredient] = useState("all")
  const [selectedMethod, setSelectedMethod] = useState("all")
  const [selectedFlavor, setSelectedFlavor] = useState("all")
  const [minPrice, setMinPrice] = useState("")
  const [maxPrice, setMaxPrice] = useState("")
  const [selectedDishId, setSelectedDishId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const { addToCart } = useCart()
  const { toast } = useToast()
  
  const ITEMS_PER_PAGE = 6
  
  // === THAY ĐỔI 1: STATE MỚI CHO BỘ LỌC VÀ "XEM THÊM" ===
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number>(0) // 0 là "Tất cả"
  const REVIEWS_PER_PAGE = 3 // Số review hiển thị mỗi lần
  const [visibleReviewCount, setVisibleReviewCount] = useState(REVIEWS_PER_PAGE)


  const filteredDishes = useMemo(() => {
    return mockDishes.filter((dish) => {
      const meta = dishMetadata[dish.id] ?? DEFAULT_DISH_META
      const matchesSearch = dish.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCuisine = selectedCuisine === "all" || meta.cuisine === selectedCuisine
      const matchesIngredient =
        selectedIngredient === "all" || meta.mainIngredients.includes(selectedIngredient)
      const matchesMethod = selectedMethod === "all" || meta.cookMethods.includes(selectedMethod)
      const matchesFlavor = selectedFlavor === "all" || meta.flavorProfiles.includes(selectedFlavor)

      const min = minPrice ? parseFloat(minPrice) : null
      const max = maxPrice ? parseFloat(maxPrice) : null

      let matchesPrice = true
      if (min !== null && max !== null) {
        matchesPrice = dish.price >= min && dish.price <= max
      } else if (min !== null) {
        matchesPrice = dish.price >= min
      } else if (max !== null) {
        matchesPrice = dish.price <= max
      }

      return (
        matchesSearch &&
        matchesCuisine &&
        matchesIngredient &&
        matchesMethod &&
        matchesFlavor &&
        matchesPrice &&
        dish.isAvailable
      )
    })
  }, [searchQuery, selectedCuisine, selectedIngredient, selectedMethod, selectedFlavor, minPrice, maxPrice])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCuisine, selectedIngredient, selectedMethod, selectedFlavor, minPrice, maxPrice])

  useEffect(() => {
    if (!filteredDishes.length) {
      setSelectedDishId(null)
      return
    }

    const isSelectedVisible = filteredDishes.some((dish) => dish.id === selectedDishId)
    if (!isSelectedVisible || selectedDishId === null) {
      setSelectedDishId(filteredDishes[0].id)
    }
  }, [filteredDishes, selectedDishId])

  // === THAY ĐỔI 2: RESET BỘ LỌC REVIEW KHI CHỌN MÓN ĂN MỚI ===
  useEffect(() => {
    setSelectedRatingFilter(0)
    setVisibleReviewCount(REVIEWS_PER_PAGE)
  }, [selectedDishId])

  const totalPages = filteredDishes.length ? Math.ceil(filteredDishes.length / ITEMS_PER_PAGE) : 1

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const paginatedDishes = useMemo(() => {
    if (!filteredDishes.length) return []
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredDishes.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [currentPage, filteredDishes])

  useEffect(() => {
    if (!paginatedDishes.length) return
    if (!selectedDishId || !paginatedDishes.some((dish) => dish.id === selectedDishId)) {
      setSelectedDishId(paginatedDishes[0]?.id)
    }
  }, [paginatedDishes, selectedDishId])

  const selectedDish = useMemo(
    () => filteredDishes.find((dish) => dish.id === selectedDishId),
    [filteredDishes, selectedDishId],
  )

  // === THAY ĐỔI 3: LOGIC LỌC VÀ PHÂN TRANG CHO REVIEW ===
  const filteredReviews = useMemo(() => {
    if (!selectedDish) return []
    const allReviewsForDish = allMockReviews.filter((review) => review.dishId === selectedDish.id)
    
    if (selectedRatingFilter === 0) {
      return allReviewsForDish // Trả về tất cả nếu không lọc
    }
    
    // Lọc theo số sao chính xác
    return allReviewsForDish.filter(review => Math.floor(review.rating) === selectedRatingFilter)
  }, [selectedDish, selectedRatingFilter])

  const visibleReviews = useMemo(() => {
    return filteredReviews.slice(0, visibleReviewCount)
  }, [filteredReviews, visibleReviewCount])
  
  const overallRating = useMemo(() => {
    if (!selectedDish) return null
    const allReviewsForDish = allMockReviews.filter((review) => review.dishId === selectedDish.id)
    if (!allReviewsForDish.length) return null
    const total = allReviewsForDish.reduce((sum, review) => sum + review.rating, 0)
    return (total / allReviewsForDish.length).toFixed(1)
  }, [selectedDish])

  const handleAddToCart = (dish: Dish) => {
    addToCart(dish)
    toast({
      title: "Đã thêm vào giỏ hàng",
      description: `${dish.name} đã được thêm vào giỏ hàng`,
    })
  }

  const handleResetFilters = () => {
    setSearchQuery("")
    setSelectedCuisine("all")
    setSelectedIngredient("all")
    setSelectedMethod("all")
    setSelectedFlavor("all")
    setMinPrice("")
    setMaxPrice("")
  }

  const getRestaurant = (restaurantId: string) => {
    return mockRestaurants.find((r) => r.id === restaurantId)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 space-y-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h1 className="text-3xl font-bold text-foreground">Khám phá món ăn</h1>
          <div className="relative w-full md:w-[320px] lg:w-[380px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm món ăn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <p className="text-muted-foreground">Tìm kiếm và đặt món ăn yêu thích của bạn</p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-[1fr_1fr_1fr_1fr_2fr_auto] items-end">
          <FilterSelect
            label="Ẩm thực"
            value={selectedCuisine}
            options={cuisineOptions}
            onValueChange={setSelectedCuisine}
          />
          <FilterSelect
            label="Nguyên liệu chính"
            value={selectedIngredient}
            options={ingredientOptions}
            onValueChange={setSelectedIngredient}
          />
          <FilterSelect
            label="Phương pháp chế biến"
            value={selectedMethod}
            options={methodOptions}
            onValueChange={setSelectedMethod}
          />
          <FilterSelect
            label="Hương vị"
            value={selectedFlavor}
            options={flavorOptions}
            onValueChange={setSelectedFlavor}
          />
          <div className="xl:col-span-1">
            <PriceRangeFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              onMinPriceChange={setMinPrice}
              onMaxPriceChange={setMaxPrice}
            />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" onClick={handleResetFilters} className="h-13 w-13">
                  <RotateCcw className="h-4 w-4" />
                  <span className="sr-only">Khôi phục bộ lọc</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Khôi phục bộ lọc</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Dishes Grid */}
        <div className="flex flex-col gap-6">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {paginatedDishes.map((dish) => {
              const restaurant = getRestaurant(dish.restaurantId)
              const isSelected = selectedDish?.id === dish.id
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
                  className={`flex h-full flex-col gap-0 overflow-hidden border-2 py-0 transition-all duration-200 focus:outline-none ${
                    isSelected
                      ? "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background shadow-xl"
                      : "border-border/50 hover:border-primary/70 hover:shadow-lg hover:-translate-y-1"
                  }`}
                >
                  <CardContent className="flex flex-1 flex-col p-0">
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <Image src={dish.image || "/placeholder.svg"} alt={dish.name} fill className="object-cover" />
                      {dish.tags.includes("Popular") && (
                        <Badge className="absolute right-2 top-2 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                          Phổ biến
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-3 px-4 pb-4 pt-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="line-clamp-1 text-lg font-semibold text-card-foreground">{dish.name}</h3>
                          {restaurant && <p className="text-xs text-muted-foreground line-clamp-1">{restaurant.name}</p>}
                        </div>
                        <div className="flex items-center gap-1 text-sm text-amber-500 flex-shrink-0">
                          <span className="font-semibold">{dish.rating}</span>
                          <Star className="h-4 w-4 fill-current" />
                        </div>
                      </div>
                      <p className="min-h-[2.5rem] text-sm text-muted-foreground line-clamp-2">{dish.description}</p>
                      <div className="mt-auto flex w-full flex-nowrap gap-2 overflow-hidden">
                        {dish.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="rounded-full border-primary/20 bg-primary/5 px-2 text-xs font-medium text-primary whitespace-nowrap"
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
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(dish); }}
                    >
                      <Plus className="mr-1 h-4 w-4" />
                      Thêm
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(event) => {
                      event.preventDefault()
                      setCurrentPage((prev) => Math.max(1, prev - 1))
                    }}
                    aria-disabled={currentPage === 1}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, index) => {
                  const pageNumber = index + 1
                  return (
                    <PaginationItem key={pageNumber}>
                      <PaginationLink
                        href="#"
                        isActive={pageNumber === currentPage}
                        onClick={(event) => {
                          event.preventDefault()
                          setCurrentPage(pageNumber)
                        }}
                      >
                        {pageNumber}
                      </PaginationLink>
                    </PaginationItem>
                  )
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(event) => {
                      event.preventDefault()
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }}
                    aria-disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>

        {/* === THAY ĐỔI 4: CẬP NHẬT TOÀN BỘ CỘT BÊN PHẢI === */}
        <div className="flex flex-col gap-8">
          {selectedDish ? (
            <>
              {/* Card 1: Thông tin món ăn & nhà hàng */}
              <aside className="h-fit rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="p-4">
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-foreground mb-1">{selectedDish.name}</h2>
                    <p className="text-sm text-muted-foreground mb-3">{selectedDish.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedDish.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="font-normal">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {(() => {
                    const restaurant = getRestaurant(selectedDish.restaurantId)
                    if (!restaurant) return null
                    return (
                      <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-3">
                        <p className="text-sm font-semibold text-foreground">{restaurant.name}</p>
                        <div className="flex items-start gap-2 text-xs text-muted-foreground">
                          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                          <span>{restaurant.address}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                          <span>{restaurant.phone}</span>
                        </div>
                      </div>
                    )
                  })()}
                </div>
              </aside>

              {/* Card 2: Đánh giá với bộ lọc và nút "Xem thêm" */}
              <aside className="h-fit rounded-xl border border-border bg-card shadow-sm overflow-hidden">
  {/* Header mới với tiêu đề và Dropdown lọc */}
  <div className="px-4 py-3 flex justify-between items-center border-b border-border">
    <h3 className="text-lg font-semibold">
      Đánh giá
      {selectedDish && (
        <span className="ml-2 text-sm font-normal text-muted-foreground">
          ({allMockReviews.filter(r => r.dishId === selectedDish.id).length} lượt)
        </span>
      )}
    </h3>

    {/* Dropdown Menu Lọc Sao */}
    <Select
      value={selectedRatingFilter.toString()}
      onValueChange={(value) => {
        setSelectedRatingFilter(Number(value))
        setVisibleReviewCount(REVIEWS_PER_PAGE) // Reset khi lọc
      }}
    >
      <SelectTrigger className="w-auto h-9">
        <SelectValue placeholder="Lọc theo sao" />
      </SelectTrigger>
      <SelectContent>
        {[0, 5, 4, 3, 2, 1].map((rating) => (
          <SelectItem key={rating} value={rating.toString()}>
            {rating === 0 ? "Tất cả" : (
              <span className="flex items-center gap-1.5">
                {rating} <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
              </span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>

  {/* Phần danh sách review và nút "Xem thêm" (giữ nguyên) */}
  <div className="max-h-[450px] overflow-y-auto p-4">
    <div className="flex flex-col gap-3">
      {visibleReviews.length > 0 ? (
        visibleReviews.map((review) => (
          <div key={review.id} className="rounded-lg border border-border bg-muted/30 p-3">
            <div className="mb-2 flex items-center justify-between">
              <p className="font-medium text-card-foreground">{review.userName}</p>
              <div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
                <Star className="h-4 w-4 fill-current" />
                <span>{review.rating.toFixed(1)}</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{review.comment}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              {new Intl.DateTimeFormat("vi-VN", { dateStyle: "short", timeStyle: "short" }).format(new Date(review.createdAt))}
            </p>
          </div>
        ))
      ) : (
        <div className="py-8 text-center text-sm text-muted-foreground">
          Không có đánh giá nào phù hợp.
        </div>
      )}
    </div>
    
    {visibleReviewCount < filteredReviews.length && (
       <div className="mt-4 text-center">
         <Button 
           variant="ghost" 
           onClick={() => setVisibleReviewCount(prev => prev + REVIEWS_PER_PAGE)}
         >
           Xem thêm {Math.min(REVIEWS_PER_PAGE, filteredReviews.length - visibleReviewCount)} đánh giá
         </Button>
       </div>
    )}
  </div>
</aside>
            </>
          ) : (
            <div className="h-fit rounded-xl border border-border bg-card shadow-sm p-8 text-center text-muted-foreground">
              Chọn một món ăn để xem chi tiết và đánh giá.
            </div>
          )}
        </div>
      </div>

      {filteredDishes.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-muted-foreground">Không tìm thấy món ăn phù hợp</p>
        </div>
      )}
    </div>
  )
}