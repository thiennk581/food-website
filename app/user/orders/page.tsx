"use client" // Chuyển sang Client Component để sử dụng hook

import Image from "next/image"
import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Order, OrderStatus } from "@/types"
import { mockOrders, mockRestaurants, mockUser, mockDishes } from "@/lib/mock-data"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Package, MapPin, Star, Clock, CheckCircle2, XCircle, Truck } from "lucide-react"
import { cn } from "@/lib/utils"

// Hàm trợ giúp để lấy tên nhà hàng
const getRestaurantName = (restaurantId: string) => {
  return mockRestaurants.find((r) => r.id === restaurantId)?.name || "Không rõ nhà hàng"
}

// Hàm trợ giúp để lấy chi tiết món ăn
const getDishDetails = (dishId: string) => {
  return mockDishes.find((d) => d.id === dishId)
}

// Hàm trợ giúp để lấy huy hiệu trạng thái với thiết kế mới
const getStatusBadge = (status: OrderStatus) => {
  const statusConfig = {
    pending: { label: "Chờ xác nhận", icon: Clock, className: "bg-gray-100 text-gray-700" },
    confirmed: { label: "Đã xác nhận", icon: CheckCircle2, className: "bg-blue-100 text-blue-700" },
    preparing: { label: "Đang chuẩn bị", icon: Package, className: "bg-indigo-100 text-indigo-700" },
    delivering: { label: "Đang giao", icon: Truck, className: "bg-yellow-100 text-yellow-700" },
    completed: { label: "Hoàn thành", icon: CheckCircle2, className: "bg-green-100 text-green-700" },
    cancelled: { label: "Đã hủy", icon: XCircle, className: "bg-red-100 text-red-700" },
  }

  const config = statusConfig[status] || statusConfig.pending
  const Icon = config.icon

  return (
    <div
      className={cn(
        "flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
        config.className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      <span>{config.label}</span>
    </div>
  )
}

export default function OrdersPage() {
  const orders = mockOrders
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null)
  const user = mockUser // Lấy thông tin người dùng giả
  const [currentPage, setCurrentPage] = useState(1)
  const ordersPerPage = 5
  const totalPages = Math.ceil(orders.length / ordersPerPage)
  const currentOrders = orders.slice((currentPage - 1) * ordersPerPage, currentPage * ordersPerPage)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Tùy chọn: chọn đơn hàng đầu tiên của trang mới
    const firstOrderOfPage = orders[(page - 1) * ordersPerPage]
    setSelectedOrder(firstOrderOfPage || null)
  }

  // Trường hợp không có đơn hàng nào trong mock data
  if (!orders || orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <Package className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold text-foreground">Chưa có đơn hàng</h2>
          <p className="mt-2 text-muted-foreground">Bạn chưa có đơn hàng nào được ghi nhận.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-foreground">Đơn hàng của tôi</h1>

      <div className="grid grid-cols-5 gap-13">
        {/* Cột trái: Danh sách đơn hàng */}
        <div className="col-span-2 flex flex-col gap-4">
          <div className="flex-1 space-y-4">
            {currentOrders.map((order) => (
              <Card
                key={order.id}
                className={`cursor-pointer overflow-hidden transition-all hover:shadow-md ${
                  selectedOrder?.id === order.id ? "border-primary shadow-md" : ""
                }`}
                onClick={() => setSelectedOrder(order)}
              >
                <CardContent className="px-5 py-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-base font-bold text-foreground">
                          Mã đơn: #{order.id.slice(0, 8)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(order.createdAt).toLocaleString("vi-VN")}
                        </p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="border-t border-dashed"></div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-base text-muted-foreground">Tổng cộng</span>
                      <span className="text-xl font-bold text-primary">
                        {order.totalAmount.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(Math.max(1, currentPage - 1))
                    }}
                    className={currentPage === 1 ? "pointer-events-none text-muted-foreground" : ""}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === i + 1}
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(i + 1)
                      }}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }}
                    className={
                      currentPage === totalPages ? "pointer-events-none text-muted-foreground" : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </div>

        {/* Cột phải: Chi tiết đơn hàng */}
        <div className="col-span-3">
          <div className="sticky top-24 space-y-6">
            {selectedOrder ? (
              <>
                {/* Thông tin giao hàng */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin giao hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div className="grid grid-cols-3 items-center gap-x-4">
                      <span className="text-muted-foreground">Mã đơn:</span>
                      <span className="col-span-2 font-medium text-right">
                        #{selectedOrder.id.slice(0, 8)}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-x-4">
                      <span className="text-muted-foreground">Ngày đặt:</span>
                      <span className="col-span-2 font-medium text-right">
                        {new Date(selectedOrder.createdAt).toLocaleString("vi-VN")}
                      </span>
                    </div>
                    <Separator className="my-2" />
                    <div className="grid grid-cols-3 items-center gap-x-4">
                      <span className="text-muted-foreground">Họ tên:</span>
                      <span className="col-span-2 font-medium text-right">{user.fullName}</span>
                    </div>
                    <div className="grid grid-cols-3 items-center gap-x-4">
                      <span className="text-muted-foreground">Số điện thoại:</span>
                      <span className="col-span-2 font-medium text-right">{user.phone}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="space-y-1">
                      <span className="text-muted-foreground">Địa chỉ giao hàng:</span>
                      <p className="font-medium">{selectedOrder.deliveryAddress}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Chi tiết sản phẩm */}
                <Card>
                  <CardHeader>
                    <CardTitle>Chi tiết đơn hàng</CardTitle>
                  </CardHeader>
                  <CardContent className="divide-y">
                    {selectedOrder.items.map((item) => {
                      const dishDetails = getDishDetails(item.dishId)
                      if (!dishDetails) return null

                      return (
                        <div key={item.dishId} className="flex items-center gap-4 py-4">
                          <Image
                            src={dishDetails.image || "/placeholder.svg"}
                            alt={dishDetails.name}
                            width={96}
                            height={96}
                            className="h-24 w-24 rounded-lg object-cover"
                          />
                          <div className="flex-1 space-y-1">
                            <p className="text-base font-semibold">{dishDetails.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {getRestaurantName(item.restaurantId as string)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.price.toLocaleString("vi-VN")}đ
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-base font-bold">
                              {(item.price * item.quantity).toLocaleString("vi-VN")}đ
                            </p>
                            <p className="text-sm text-muted-foreground">SL: {item.quantity}</p>
                            <Button variant="outline" size="sm" className="mt-3">
                              <Star className="mr-1.5 h-4 w-4" />
                              Đánh giá
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t bg-muted/50 px-6 py-4">
                    <span className="text-lg font-semibold">Tổng cộng</span>
                    <span className="text-2xl font-bold text-primary">
                      {selectedOrder.totalAmount.toLocaleString("vi-VN")}đ
                    </span>
                  </CardFooter>
                </Card>
              </>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">
                    Chọn một đơn hàng từ danh sách bên trái để xem chi tiết.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}