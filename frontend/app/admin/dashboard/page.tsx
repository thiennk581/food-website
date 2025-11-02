"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DollarSign,
  Users,
  ShoppingBag,
  ThumbsUp,
  ArrowUp,
  ArrowDown,
  MoreVertical,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import Image from "next/image"
import { Dish } from "@/types"

const summaryData = [
  { name: "Sunday", Earning: 2000 },
  { name: "Monday", Earning: 3000 },
  { name: "Tuesday", Earning: 2500 },
  { name: "Wednesday", Earning: 4500 },
  { name: "Thursday", Earning: 5900 },
  { name: "Friday", Earning: 3800 },
  { name: "Saturday", Earning: 4200 },
]

const topSellingItems: (Omit<Dish, "price"> & { price: number; restaurantName: string })[] = [
  {
    id: "1",
    restaurantId: "1",
    name: "Pizza Margherita",
    restaurantName: "Deef Cafe",
    description: "Classic pizza with tomato, mozzarella, and basil.",
    price: 34.24,
    image: "/placeholder.jpg",
    category: "Pizza",
    rating: 4.5,
    totalReviews: 120,
    isAvailable: true,
    spicyLevel: "none",
    tags: ["vegetarian"],
  },
  {
    id: "2",
    restaurantId: "2",
    name: "Classic Caesar Salad",
    restaurantName: "Deef Cafe",
    description: "Crisp romaine lettuce with Caesar dressing, croutons, and Parmesan cheese.",
    price: 28.21,
    image: "/placeholder.jpg",
    category: "Salad",
    rating: 4.2,
    totalReviews: 85,
    isAvailable: true,
    spicyLevel: "none",
    tags: ["healthy"],
  },
  {
    id: "3",
    restaurantId: "1",
    name: "Egg Sandwich",
    restaurantName: "Deef Cafe",
    description: "A simple yet delicious egg sandwich.",
    price: 30.15,
    image: "/placeholder.jpg",
    category: "Sandwich",
    rating: 4.0,
    totalReviews: 60,
    isAvailable: true,
    spicyLevel: "none",
    tags: ["breakfast"],
  },
  {
    id: "4",
    restaurantId: "3",
    name: "Muesli with Mango",
    restaurantName: "Deef Cafe",
    description: "Healthy muesli with fresh mango.",
    price: 40.24,
    image: "/placeholder.jpg",
    category: "Breakfast",
    rating: 4.8,
    totalReviews: 95,
    isAvailable: true,
    spicyLevel: "none",
    tags: ["healthy", "breakfast"],
  },
]

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-10 bg-background p-4 md:px-18 md:py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <div className="flex items-center space-x-2">
          <Select defaultValue="week">
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Earning"
          value="$10,236"
          change="3.01%"
          isPositive
          icon={<DollarSign className="h-6 w-6 text-white" />}
          iconBgColor="bg-indigo-500"
          chartColor="indigo"
        />
        <StatCard
          title="Daily Customers"
          value="36,531"
          change="3.01%"
          isPositive={false}
          icon={<Users className="h-6 w-6 text-white" />}
          iconBgColor="bg-yellow-500"
          chartColor="yellow"
        />
        <StatCard
          title="New Orders"
          value="52,416"
          change="3.01%"
          isPositive
          icon={<ShoppingBag className="h-6 w-6 text-white" />}
          iconBgColor="bg-blue-500"
          chartColor="blue"
        />
        <StatCard
          title="New Feedback"
          value="13,924"
          change="52.1%"
          isPositive
          icon={<ThumbsUp className="h-6 w-6 text-white" />}
          iconBgColor="bg-cyan-500"
          chartColor="cyan"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Summary Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Summary</CardTitle>
              <Select defaultValue="last-week">
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-week">Last Week</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="pl-2">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={summaryData}>
                <defs>
                  <linearGradient id="colorEarning" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    border: "none",
                  }}
                />
                <Area type="monotone" dataKey="Earning" stroke="#8884d8" fillOpacity={1} fill="url(#colorEarning)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Selling Items */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Top Selling Items</CardTitle>
            <Button variant="link" className="p-0">
              View all
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topSellingItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="rounded-md object-cover"
                    />
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.restaurantName}</p>
                    </div>
                  </div>
                  <p className="font-semibold">${item.price.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface StatCardProps {
  title: string
  value: string
  change: string
  isPositive: boolean
  icon: React.ReactNode
  iconBgColor: string
  chartColor: "indigo" | "yellow" | "blue" | "cyan"
}

const chartData = {
  indigo: [
    { x: 0, y: 12 }, { x: 1, y: 20 }, { x: 2, y: 16 }, { x: 3, y: 25 },
    { x: 4, y: 18 }, { x: 5, y: 28 }, { x: 6, y: 15 }, { x: 7, y: 27 },
  ],
  yellow: [
    { x: 0, y: 22 }, { x: 1, y: 14 }, { x: 2, y: 18 }, { x: 3, y: 12 },
    { x: 4, y: 16 }, { x: 5, y: 10 }, { x: 6, y: 15 }, { x: 7, y: 11 },
  ],
  blue: [
    { x: 0, y: 15 }, { x: 1, y: 25 }, { x: 2, y: 19 }, { x: 3, y: 28 },
    { x: 4, y: 22 }, { x: 5, y: 30 }, { x: 6, y: 20 }, { x: 7, y: 27 },
  ],
  cyan: [
    { x: 0, y: 20 }, { x: 1, y: 12 }, { x: 2, y: 18 }, { x: 3, y: 10 },
    { x: 4, y: 16 }, { x: 5, y: 11 }, { x: 6, y: 19 }, { x: 7, y: 13 },
  ],
}




const chartColors = {
  indigo: "#6366F1",
  yellow: "#FBBF24",
  blue: "#3B82F6",
  cyan: "#22D3EE",
}

function StatCard({ title, value, change, isPositive, icon, iconBgColor, chartColor }: StatCardProps) {
  const ChangeIcon = isPositive ? ArrowUp : ArrowDown
  const changeColor = isPositive ? "text-green-500" : "text-red-500"

  return (
    <Card className="rounded-3xl shadow-sm">
      <CardContent className="px-8">
        <div className="flex items-center justify-between">
          <div className={`flex h-12 w-12 items-center justify-center rounded-full ${iconBgColor}`}>
            {icon}
          </div>
          <div className="h-18 w-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData[chartColor]}>
                <Line
                  type="monotone"
                  dataKey="y"
                  stroke={chartColors[chartColor]}
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold">{value}</p>
            <div className={`flex items-center text-base font-semibold ${changeColor}`}>
              <ChangeIcon className="mr-0.5 h-4 w-4" />
              {change}
            </div>
          </div>
          <p className="mt-2 text-1xl text-muted-foreground">{title}</p>
        </div>
      </CardContent>
    </Card>
  )
}
