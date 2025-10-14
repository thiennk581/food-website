"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Order, OrderStatus } from "@/types"
import { mockRestaurants } from "@/lib/mock-data"
import { Package, Clock, CheckCircle2, XCircle, Truck } from "lucide-react"

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedStatus, setSelectedStatus] = useState<"all" | OrderStatus>("all")

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
    setOrders(savedOrders)
  }, [])

  const getStatusBadge = (status: OrderStatus) => {
    const statusConfig = {
      pending: { label: "Chờ xác nhận", variant: "secondary" as const, icon: Clock },
      confirmed: { label: "Đã xác nhận", variant: "default" as const, icon: CheckCircle2 },
      preparing: { label: "Đang chuẩn bị", variant: "default" as const, icon: Package },
      delivering: { label: "Đang giao", variant: "default" as const, icon: Truck },
      completed: { label: "Hoàn thành", variant: "default" as const, icon: CheckCircle2 },
      cancelled: { label: "Đã hủy", variant: "destructive" as const, icon: XCircle },
    }

    const config = statusConfig[status]
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex w-fit items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getRestaurantName = (restaurantId: string) => {
    return mockRestaurants.find((r) => r.id === restaurantId)?.name || ""
  }

  const filteredOrders = orders.filter((order) => selectedStatus === "all" || order.status === selectedStatus)

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <Package className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold text-foreground">Chưa có đơn hàng</h2>
          <p className="mt-2 text-muted-foreground">Bạn chưa có đơn hàng nào</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-foreground">Đơn hàng của tôi</h1>

      <Tabs value={selectedStatus} onValueChange={(v) => setSelectedStatus(v as typeof selectedStatus)}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="pending">Chờ xác nhận</TabsTrigger>
          <TabsTrigger value="delivering">Đang giao</TabsTrigger>
          <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedStatus} className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-muted-foreground">Không có đơn hàng nào</p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardHeader>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <CardTitle className="text-lg">{getRestaurantName(order.restaurantId)}</CardTitle>
                      <p className="mt-1 text-sm text-muted-foreground">
                        Đặt lúc {new Date(order.createdAt).toLocaleString("vi-VN")}
                      </p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-3">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                            <Image
                              src={item.dishImage || "/placeholder.svg"}
                              alt={item.dishName}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-1 items-center justify-between">
                            <div>
                              <p className="font-medium text-card-foreground">{item.dishName}</p>
                              <p className="text-sm text-muted-foreground">x{item.quantity}</p>
                            </div>
                            <p className="font-semibold">{(item.price * item.quantity).toLocaleString("vi-VN")}đ</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Total */}
                    <div className="flex items-center justify-between border-t border-border pt-4">
                      <span className="font-semibold">Tổng cộng</span>
                      <span className="text-lg font-bold text-primary">
                        {order.totalAmount.toLocaleString("vi-VN")}đ
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1 bg-transparent">
                        Xem chi tiết
                      </Button>
                      {order.status === "completed" && (
                        <Button variant="default" className="flex-1">
                          Đánh giá
                        </Button>
                      )}
                      {order.status === "pending" && (
                        <Button variant="destructive" className="flex-1">
                          Hủy đơn
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
