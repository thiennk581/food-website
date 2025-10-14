"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { authService } from "@/lib/auth"
import { User, MapPin, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
  const [user, setUser] = useState(authService.getCurrentUser())
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSaveProfile = () => {
    // Mock save
    toast({
      title: "Đã lưu thông tin",
      description: "Thông tin cá nhân đã được cập nhật",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-foreground">Tài khoản của tôi</h1>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="mr-2 h-4 w-4" />
            Thông tin cá nhân
          </TabsTrigger>
          <TabsTrigger value="addresses">
            <MapPin className="mr-2 h-4 w-4" />
            Địa chỉ
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Heart className="mr-2 h-4 w-4" />
            Sở thích
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cá nhân</CardTitle>
              <CardDescription>Cập nhật thông tin tài khoản của bạn</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Họ và tên</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại</Label>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
              </div>
              <Button onClick={handleSaveProfile}>Lưu thay đổi</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses">
          <Card>
            <CardHeader>
              <CardTitle>Địa chỉ giao hàng</CardTitle>
              <CardDescription>Quản lý địa chỉ giao hàng của bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="rounded-lg border border-border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">Nhà riêng</h3>
                        <Badge variant="secondary">Mặc định</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">789 Nguyễn Trãi, Q.5, TP.HCM</p>
                      <p className="text-sm text-muted-foreground">{user?.phone}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Sửa
                    </Button>
                  </div>
                </div>
                <Button variant="outline" className="w-full bg-transparent">
                  Thêm địa chỉ mới
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Sở thích ẩm thực</CardTitle>
              <CardDescription>Giúp chúng tôi gợi ý món ăn phù hợp với bạn</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="mb-3 block">Danh mục yêu thích</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Noodles", "Rice", "Sandwiches", "Seafood", "Vegetarian"].map((cat) => (
                      <Badge
                        key={cat}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      >
                        {cat}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <Label className="mb-3 block">Mức độ cay</Label>
                  <div className="flex flex-wrap gap-2">
                    {["Không cay", "Ít cay", "Vừa", "Cay", "Rất cay"].map((level) => (
                      <Badge
                        key={level}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                      >
                        {level}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button>Lưu sở thích</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
