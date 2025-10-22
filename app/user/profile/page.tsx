// TODO: Lưu các thay đổi rating của tag vào backend
"use client"

import { useState } from "react"
import {
  User,
  MapPin,
  Heart,
  Edit,
  Trash2,
  PlusCircle,
  CalendarIcon,
  Mail,
  Phone,
  Cake,
  Users,
  CheckCircle2,
  XCircle,
  Search,
  Star,
} from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { mockUsers, mockCategories, mockTags } from "@/lib/mock-data" // Assuming these are available
import { cn } from "@/lib/utils"
import type { Address, Bias } from "@/types"

// Helper component for profile fields
const InfoField = ({ icon, label, value }: { icon: React.ElementType; label: string; value: string }) => {
  const Icon = icon
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-muted-foreground" />
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="font-medium">{value}</p>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const [user, setUser] = useState(mockUsers)
  const [birthdate, setBirthdate] = useState<Date | undefined>(
    user.birthdate ? new Date(user.birthdate) : undefined,
  )
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()

  const handleScoreChange = (tagId: string, newScore: number) => {
    setUser((currentUser) => {
      const newBias = [...currentUser.bias]
      const biasIndex = newBias.findIndex((b) => b.tagId === tagId)

      if (biasIndex > -1) {
        // Update existing bias
        newBias[biasIndex] = { ...newBias[biasIndex], score: newScore }
      } else {
        // Add new bias if it doesn't exist
        newBias.push({
          id: `bias-${Date.now()}-${tagId}`, // mock id
          userId: currentUser.id,
          tagId: tagId,
          score: newScore,
        })
      }
      return { ...currentUser, bias: newBias }
    })
  }

  // Mock function to get tag name
  const getTagName = (tagId: string) => mockTags.find((t) => t.id === tagId)?.name || "Unknown Tag"

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{user.name}</h1>
            <p className="text-muted-foreground">
              Tham gia ngày {new Date(user.createdAt).toLocaleDateString("vi-VN")}
            </p>
          </div>
        </div>
        <div
          className={cn(
            "flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium",
            user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800",
          )}
        >
          {user.isActive ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <XCircle className="h-4 w-4" />
          )}
          <span>{user.isActive ? "Hoạt động" : "Tạm khóa"}</span>
        </div>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile" className="py-2.5 text-sm md:text-base">
            <User className="mr-2 h-4 w-4" />
            Thông tin tài khoản
          </TabsTrigger>
          <TabsTrigger value="addresses" className="py-2.5 text-sm md:text-base">
            <MapPin className="mr-2 h-4 w-4" />
            Sổ địa chỉ
          </TabsTrigger>
          <TabsTrigger value="preferences" className="py-2.5 text-sm md:text-base">
            <Heart className="mr-2 h-4 w-4" />
            Tùy chọn ẩm thực
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Thông tin cá nhân</CardTitle>
              <CardDescription>Quản lý thông tin cá nhân của bạn.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input id="name" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" defaultValue={user.phone} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" defaultValue={user.email} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Ngày sinh</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !birthdate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {birthdate ? format(birthdate, "PPP", { locale: vi }) : <span>Chọn ngày</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={birthdate}
                        onSelect={setBirthdate}
                        initialFocus
                        captionLayout="dropdown"
                        fromYear={1950}
                        toYear={new Date().getFullYear()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Giới tính</Label>
                <RadioGroup defaultValue={user.gender} className="flex gap-6">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Nam</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Nữ</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="other" id="other" />
                    <Label htmlFor="other">Khác</Label>
                  </div>
                </RadioGroup>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button>Lưu thay đổi</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="addresses" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl">Sổ địa chỉ</CardTitle>
                <CardDescription>Quản lý địa chỉ nhận hàng của bạn.</CardDescription>
              </div>
              <Button variant="outline">
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm địa chỉ mới
              </Button>
            </CardHeader>
            <CardContent className="divide-y">
              {user.address.map((addr: Address) => (
                <div key={addr.id} className="flex items-center justify-between py-4">
                  <div className="flex items-start gap-4">
                    <MapPin className="h-5 w-5 shrink-0 text-muted-foreground" />
                    <span className="font-medium">{addr.address}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {addr.isDefault && (
                      <Badge className="bg-green-600 text-primary-foreground hover:bg-green-700">
                        Mặc định
                      </Badge>
                    )}
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="mt-6">
          <Card>
            <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle className="text-xl">Tùy chọn ẩm thực</CardTitle>
                <CardDescription>
                  Giúp chúng tôi hiểu rõ hơn về khẩu vị của bạn để đưa ra những gợi ý tốt nhất.
                </CardDescription>
              </div>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm sở thích..."
                  className="w-full pl-8 md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {mockCategories
                .filter((category) =>
                  mockTags.some(
                    (tag) =>
                      tag.categoryId === category.id &&
                      tag.name.toLowerCase().includes(searchTerm.toLowerCase()),
                  ),
                )
                .map((category) => (
                  <div key={category.id}>
                    <Label className="text-base font-medium">{category.name}</Label>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {mockTags
                        .filter(
                          (tag) =>
                            tag.categoryId === category.id &&
                            tag.name.toLowerCase().includes(searchTerm.toLowerCase()),
                        )
                        .map((tag) => {
                          const userBias = user.bias.find((b: Bias) => b.tagId === tag.id)
                          const score = userBias ? userBias.score : 3 // Default score 3 for unselected
                          const getFillPercentage = (score: number): number => {
                            const scoreMap: { [key: number]: number } = {
                              1: 0,
                              2: 25,
                              3: 50,
                              4: 75,
                              5: 100,
                            }
                            return scoreMap[score] ?? 50
                          }
                          const fillPercentage = getFillPercentage(score)

                          return (
                            <Popover key={tag.id}>
                              <PopoverTrigger asChild>
                                <div className="relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border px-3 py-1 text-sm font-medium transition-colors hover:bg-accent">
                                  <div
                                    className="absolute left-0 top-0 h-full bg-secondary"
                                    style={{ width: `${fillPercentage}%` }}
                                  />
                                  <span className="relative z-10">{tag.name}</span>
                                </div>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-2">
                                <div className="flex items-center gap-1">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={cn(
                                        "h-6 w-6 cursor-pointer transition-colors",
                                        score >= star
                                          ? "fill-yellow-400 text-yellow-400"
                                          : "text-gray-300",
                                      )}
                                      onClick={() => handleScoreChange(tag.id, star)}
                                    />
                                  ))}
                                </div>
                              </PopoverContent>
                            </Popover>
                          )
                        })}
                    </div>
                  </div>
                ))}
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Button
                onClick={() => {
                  toast({
                    variant: "success",
                    title: (
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Thay đổi khẩu vị thành công!</span>
                      </div>
                    ),
                  })
                }}
              >
                Lưu tùy chọn
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
