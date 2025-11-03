"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, RefreshCw } from "lucide-react"
import { Search, MoreVertical, Plus } from "lucide-react"
import type { Dish } from "@/types"
import { mockDishes, mockRestaurants } from "@/lib/mock-data"

export default function FoodsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [page, setPage] = useState(1)
  const [minPrice, setMinPrice] = useState<string>("")
  const [maxPrice, setMaxPrice] = useState<string>("")
  const [status, setStatus] = useState<"all"|"available"|"unavailable">("all")
  const pageSize = 10
  const [sortBy, setSortBy] = useState<"price_asc"|"price_desc"|"rating_asc"|"rating_desc">("price_asc")

  const dishes: Dish[] = mockDishes

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim()
    const clean = (v: string) => v.replace(/\./g, "").trim()
    const min = clean(minPrice) ? Number(clean(minPrice)) : undefined
    const max = clean(maxPrice) ? Number(clean(maxPrice)) : undefined
    return dishes.filter((d) => {
      const restaurant = mockRestaurants.find(r => r.id === d.restaurantId)
      const matchesText = !q || (
        d.name.toLowerCase().includes(q) ||
        restaurant?.name.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q)
      )
      const matchesPrice = (min === undefined || d.price >= min) && (max === undefined || d.price <= max)
      const matchesStatus = status === "all" || (status === "available" ? d.isAvailable : !d.isAvailable)
      return matchesText && matchesPrice && matchesStatus
    })
  }, [searchQuery, dishes, minPrice, maxPrice, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const sorted = useMemo(() => {
    const list = [...filtered]
    switch (sortBy) {
      case "price_desc":
        list.sort((a,b)=> b.price - a.price); break
      case "rating_asc":
        list.sort((a,b)=> a.rating - b.rating); break
      case "rating_desc":
        list.sort((a,b)=> b.rating - a.rating); break
      default:
        list.sort((a,b)=> a.price - b.price)
    }
    return list
  }, [filtered, sortBy])

  const paged = useMemo(() => {
    const safePage = Math.min(Math.max(1, page), totalPages)
    const start = (safePage - 1) * pageSize
    return sorted.slice(start, start + pageSize)
  }, [sorted, page, totalPages])

  useEffect(() => { setPage(1) }, [searchQuery])
  useEffect(() => { if (page > totalPages) setPage(totalPages) }, [totalPages, page])

  const getRestaurantName = (id: string) => mockRestaurants.find(r => r.id === id)?.name || "-"

  return (
    <div className="space-y-8 px-18 py-10 bg-background flex-1">
      <div className="text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight pb-3">Quản lý món ăn</h1>
        <div className="mx-auto mt-2 h-1 w-24 rounded bg-foreground/80" />
      </div>

      <div className="flex items-center justify-between gap-3 text-[15px] sm:text-base">
        <div className="relative flex-1 sm:max-w-[22rem]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tên món hoặc quán..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
              className="pl-10 h-10"
            />
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />Thêm món ăn
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-4 justify-between text-[15px] sm:text-base">
        <div className="flex items-end gap-6">
          <span className="text-sm font-medium pb-2">Mức giá</span>
          <div className="flex items-center gap-2">
            <Input placeholder="Mức giá từ" value={minPrice} onChange={(e)=>setMinPrice(e.target.value)} className="w-40" inputMode="numeric"/>
            <span className="text-muted-foreground">-</span>
            <Input placeholder="Mức giá đến" value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} className="w-40" inputMode="numeric"/>
          </div>
          <div className="flex items-center gap-3 pl-6">
            <span className="text-sm font-medium">Tình trạng</span>
            <Select value={status} onValueChange={(v)=>setStatus(v as typeof status)}>
              <SelectTrigger className="w-40 h-10">
                <SelectValue placeholder="Chọn tình trạng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="available">Đang bán</SelectItem>
                <SelectItem value="unavailable">Tạm hết</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Select value={sortBy} onValueChange={(v)=>{ setSortBy(v as typeof sortBy); setPage(1) }}>
            <SelectTrigger className="h-10 w-31 justify-between">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="price_desc">Giá tiền ↓</SelectItem>
              <SelectItem value="price_asc">Giá tiền ↑</SelectItem>
              <SelectItem value="rating_desc">Đánh giá ↓</SelectItem>
              <SelectItem value="rating_asc">Đánh giá ↑</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="h-10 w-10" title="Đặt lại bộ lọc" onClick={() => { setStatus('all'); setMinPrice(''); setMaxPrice(''); setSearchQuery(''); setPage(1); setSortBy('price_asc') }}>
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border text-[15px] sm:text-base">
        <Table className="[&_th]:py-4 [&_td]:py-3 [&_th]:px-6 [&_td]:px-6">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[10%] min-w-[100px]">Hình ảnh</TableHead>
              <TableHead className="w-[26%] min-w-[200px]">Tên món</TableHead>
              <TableHead className="w-[26%] min-w-[220px]">Tên quán</TableHead>
              <TableHead className="w-[12%] min-w-[120px]">Giá tiền</TableHead>
              <TableHead className="w-[10%]">Đánh giá</TableHead>
              <TableHead className="w-[12%]">Tình trạng</TableHead>
              <TableHead className="w-[8%] text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                  Không có món ăn phù hợp với bộ lọc hiện tại
                </TableCell>
              </TableRow>
            ) : (
              paged.map((d) => (
                <TableRow className="hover:bg-muted/40" key={d.id}>
                  <TableCell>
                    <img src={d.image} alt={d.name} className="h-12 w-16 object-cover rounded-md border" />
                  </TableCell>
                  <TableCell className="font-medium max-w-[260px]">
                    <span className="text-sm sm:text-base font-semibold leading-tight truncate" title={d.name}>{d.name}</span>
                  </TableCell>
                  <TableCell className="max-w-[300px]">
                    <span className="truncate" title={getRestaurantName(d.restaurantId)}>{getRestaurantName(d.restaurantId)}</span>
                  </TableCell>
                  <TableCell>
                    {d.price.toLocaleString("vi-VN")}₫
                  </TableCell>
                  <TableCell>
                    <div className="inline-flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                      <span className="tabular-nums font-medium">{d.rating.toFixed(1)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {d.isAvailable ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">Đang bán</span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-rose-100 px-2.5 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200">Tạm hết</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Xem chi tiết</DropdownMenuItem>
                        <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                        <DropdownMenuItem>
                          {d.isAvailable ? "Tạm ngưng bán" : "Mở bán lại"}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          Hiển thị {(filtered.length === 0) ? 0 : (page - 1) * pageSize + 1}
          –{Math.min(page * pageSize, filtered.length)} trong tổng {filtered.length}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Trang trước
          </Button>
          <div className="text-sm tabular-nums">
            {page} / {totalPages}
          </div>
          <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            Trang sau
          </Button>
        </div>
      </div>
    </div>
  )
}
