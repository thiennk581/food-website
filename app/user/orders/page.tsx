"use client" // Chuyển sang Client Component để sử dụng hook

import Image from "next/image"
import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import type { Order } from "@/types"
import { mockOrders, mockRestaurants, mockUser, mockDishes } from "@/lib/mock-data"
import { Package, MapPin, Star } from "lucide-react"

// Hàm trợ giúp để lấy tên nhà hàng
const getRestaurantName = (restaurantId: string) => {
  return mockRestaurants.find((r) => r.id === restaurantId)?.name || "Không rõ nhà hàng"
}

// Hàm trợ giúp để lấy chi tiết món ăn
const getDishDetails = (dishId: string) => {
  return mockDishes.find((d) => d.id === dishId)
}

export default function OrdersPage() {
  const orders = mockOrders
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(orders[0] || null)
  const user = mockUser // Lấy thông tin người dùng giả

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

      <div className="grid grid-cols-5 gap-8">
        {/* Cột trái: Danh sách đơn hàng */}
        <div className="col-span-2 space-y-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              className={`cursor-pointer overflow-hidden transition-all hover:shadow-md ${
                selectedOrder?.id === order.id ? "border-primary shadow-md" : ""
              }`}
              onClick={() => setSelectedOrder(order)}
            >
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Mã đơn: #{order.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleString("vi-VN")}
                    </p>
                  </div>

                  <div className="border-t border-dashed pt-3">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm font-medium text-muted-foreground">Tổng cộng</span>
                      <span className="text-lg font-bold text-primary">
                        {order.totalAmount.toLocaleString("vi-VN")}đ
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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