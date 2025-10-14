"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockDashboardStats, mockRevenueData } from "@/lib/mock-data"
import { DollarSign, ShoppingBag, Users, Store, TrendingUp, TrendingDown } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

export default function DashboardPage() {
  const stats = mockDashboardStats

  const statCards = [
    {
      title: "Tổng doanh thu",
      value: `${stats.totalRevenue.toLocaleString("vi-VN")}đ`,
      change: stats.revenueChange,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Đơn hàng",
      value: stats.totalOrders.toLocaleString(),
      change: stats.ordersChange,
      icon: ShoppingBag,
      color: "text-blue-600",
    },
    {
      title: "Người dùng",
      value: stats.totalUsers.toLocaleString(),
      change: stats.usersChange,
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Nhà hàng",
      value: stats.totalRestaurants.toLocaleString(),
      change: 0,
      icon: Store,
      color: "text-orange-600",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Tổng quan hệ thống đặt đồ ăn</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon
          const isPositive = stat.change > 0
          const TrendIcon = isPositive ? TrendingUp : TrendingDown

          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-card-foreground">{stat.value}</div>
                {stat.change !== 0 && (
                  <div className={`mt-1 flex items-center text-xs ${isPositive ? "text-green-600" : "text-red-600"}`}>
                    <TrendIcon className="mr-1 h-3 w-3" />
                    <span>{Math.abs(stat.change)}% so với tháng trước</span>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Revenue Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Doanh thu 7 ngày qua</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockRevenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line type="monotone" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Đơn hàng gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-card-foreground">Đơn hàng #{1000 + i}</p>
                    <p className="text-sm text-muted-foreground">Nguyễn Văn {String.fromCharCode(64 + i)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{(50000 + i * 10000).toLocaleString("vi-VN")}đ</p>
                    <p className="text-xs text-muted-foreground">{i} phút trước</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Món ăn phổ biến</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Phở Bò Tái", "Cơm Tấm Sườn", "Bánh Mì Thịt", "Phở Gà"].map((dish, i) => (
                <div
                  key={dish}
                  className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium text-card-foreground">{dish}</p>
                    <p className="text-sm text-muted-foreground">{120 - i * 20} đơn</p>
                  </div>
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${100 - i * 15}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
