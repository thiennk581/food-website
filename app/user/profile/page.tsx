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
  KeyRound,
  Star,
  Search,
  CheckCircle2,
  XCircle,
} from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useToast } from "@/hooks/use-toast"
import { Calendar } from "@/components/ui/calendar"
import { mockUsers, mockCategories, mockTags } from "@/lib/mock-data"
import { AddressDialog } from "@/components/address-dialog"
import { ChangePasswordDialog } from "@/components/change-password-dialog"
import { cn } from "@/lib/utils"
import type { Address, Bias } from "@/types"

export default function ProfilePage() {
  const [user, setUser] = useState(mockUsers)
  const [birthdate, setBirthdate] = useState<Date | undefined>(
    user.birthdate ? new Date(user.birthdate) : undefined,
  )
  const [searchTerm, setSearchTerm] = useState("")
  const { toast } = useToast()
  const [profileData, setProfileData] = useState({
    name: user.name,
    phone: user.phone,
  })
  const [isAddressDialogOpen, setAddressDialogOpen] = useState(false)
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null)
  const [isPasswordDialogOpen, setPasswordDialogOpen] = useState(false)

  const handleScoreChange = (tagId: string, newScore: number) => {
    setUser((currentUser) => {
      const newBias = [...currentUser.bias]
      const biasIndex = newBias.findIndex((b) => b.tagId === tagId)
      if (biasIndex > -1) {
        newBias[biasIndex] = { ...newBias[biasIndex], score: newScore }
      } else {
        newBias.push({
          id: `bias-${Date.now()}-${tagId}`,
          userId: currentUser.id,
          tagId: tagId,
          score: newScore,
        })
      }
      return { ...currentUser, bias: newBias }
    })
  }

  const handleSaveAddress = (addressData: Omit<Address, "id" | "userId"> & { id?: string }) => {
    setUser((currentUser) => {
      let newAddresses = [...currentUser.address]
      if (addressData.isDefault) {
        newAddresses = newAddresses.map((addr) => ({ ...addr, isDefault: false }))
      }
      if (addressData.id) {
        newAddresses = newAddresses.map((addr) =>
          addr.id === addressData.id ? { ...addr, ...addressData } : addr,
        )
      } else {
        const newAddress: Address = {
          ...addressData,
          id: `addr-${Date.now()}`,
          userId: currentUser.id,
        }
        newAddresses.push(newAddress)
      }
      toast({
        variant: "success",
        title: (
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <span className="font-medium">Đã {addressData.id ? "cập nhật" : "thêm"} địa chỉ thành công!</span>
          </div>
        ),
      })
      return { ...currentUser, address: newAddresses }
    })
    setAddressDialogOpen(false)
  }

  const handleDeleteAddress = (addressId: string) => {
    setUser((currentUser) => {
      const newAddresses = currentUser.address.filter((addr) => addr.id !== addressId)
      return { ...currentUser, address: newAddresses }
    })
    toast({
      variant: "success",
      title: (
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span className="font-medium">Đã xóa địa chỉ thành công!</span>
        </div>
      ),
    })
    setDeleteDialogOpen(false)
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value })
  }

  const handleProfileSave = () => {
    const { name, phone } = profileData
    if (!name.trim() || !phone.trim()) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Vui lòng điền đầy đủ họ tên và số điện thoại.",
      })
      return
    }
    if (!/^\d{10}$/.test(phone)) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Số điện thoại phải có đúng 10 chữ số.",
      })
      return
    }
    const oneYearAgo = new Date()
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 10)

    if (birthdate && birthdate > oneYearAgo) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Ngày sinh không hợp lệ. Bạn phải lớn hơn 10 tuổi.",
      })
      return
    }
    setUser((currentUser) => ({
      ...currentUser,
      ...profileData,
      birthdate: birthdate ? birthdate.toISOString() : currentUser.birthdate,
    }))
    toast({
      variant: "success",
      title: (
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span className="font-medium">Đã cập nhật thông tin thành công!</span>
        </div>
      ),
    })
  }

  return (
    <div className="container mx-auto max-w-5xl px-4 py-8">
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

        <TabsContent value="profile" className="mt-8">
          <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Thông tin cá nhân</h2>
                <p className="text-muted-foreground">Quản lý thông tin cá nhân của bạn.</p>
              </div>
              <Button variant="outline" onClick={() => setPasswordDialogOpen(true)}>
                <KeyRound className="mr-2 h-4 w-4" />
                Đổi mật khẩu
              </Button>
            </div>
            <div className="space-y-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input id="name" name="name" value={profileData.name} onChange={handleProfileChange} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Số điện thoại</Label>
                  <Input id="phone" name="phone" value={profileData.phone} onChange={handleProfileChange} />
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
              <div className="space-y-3">
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
              <div className="border-t pt-6">
                <Button onClick={handleProfileSave} className="bg-green-700 hover:bg-green-800">
                  Lưu thay đổi
                </Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="addresses" className="mt-8">
          <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Sổ địa chỉ</h2>
                <p className="text-muted-foreground">Quản lý địa chỉ nhận hàng của bạn.</p>
              </div>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedAddress(null)
                  setAddressDialogOpen(true)
                }}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Thêm địa chỉ mới
              </Button>
            </div>
            <div className="space-y-4">
              {user.address.map((addr: Address) => (
                <div
                  key={addr.id}
                  className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                >
                  <div className="flex items-start gap-4">
                    <MapPin className="mt-1 h-5 w-5 shrink-0 text-muted-foreground" />
                    <span className="font-medium">{addr.address}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {addr.isDefault && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        Mặc định
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        setSelectedAddress(addr)
                        setAddressDialogOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => {
                        setAddressToDelete(addr)
                        setDeleteDialogOpen(true)
                      }}
                      disabled={addr.isDefault}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="preferences" className="mt-8">
          <div className="rounded-lg border bg-card p-8 text-card-foreground shadow-sm">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold">Tùy chọn ẩm thực</h2>
                <p className="text-muted-foreground">
                  Giúp chúng tôi hiểu rõ hơn về khẩu vị của bạn để đưa ra những gợi ý tốt nhất.
                </p>
              </div>
              <div className="relative w-full md:w-auto">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm sở thích..."
                  className="w-full pl-8 md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-8">
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
                    <Label className="text-lg font-semibold">{category.name}</Label>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {mockTags
                        .filter(
                          (tag) =>
                            tag.categoryId === category.id &&
                            tag.name.toLowerCase().includes(searchTerm.toLowerCase()),
                        )
                        .map((tag) => {
                          const userBias = user.bias.find((b: Bias) => b.tagId === tag.id)
                          const score = userBias ? userBias.score : 3
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
                                <div className="relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full border border-border bg-background px-4 py-1.5 text-sm font-medium transition-colors hover:bg-accent">
                                  <div
                                    className="absolute left-0 top-0 h-full bg-green-100 transition-all duration-300"
                                    style={{ width: `${fillPercentage}%` }}
                                  />
                                  <span className="relative z-10 text-green-800">{tag.name}</span>
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
                                          : "text-gray-300 hover:text-yellow-300",
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
            </div>
            <div className="mt-8 border-t pt-6">
              <Button
                className="bg-green-700 hover:bg-green-800"
                onClick={() => {
                  toast({
                    variant: "success",
                    title: (
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Đã cập nhật khẩu vị thành công!</span>
                      </div>
                    ),
                  })
                }}
              >
                Lưu tùy chọn
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <AddressDialog
        open={isAddressDialogOpen}
        onOpenChange={setAddressDialogOpen}
        address={selectedAddress}
        onSave={handleSaveAddress}
      />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Địa chỉ này sẽ bị xóa vĩnh viễn khỏi sổ địa chỉ của
              bạn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={() => addressToDelete && handleDeleteAddress(addressToDelete.id)}>
              Tiếp tục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ChangePasswordDialog open={isPasswordDialogOpen} onOpenChange={setPasswordDialogOpen} />
    </div>
  )
}
