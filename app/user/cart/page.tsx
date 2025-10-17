"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCart } from "@/hooks/use-cart"
import { Minus, Plus, Trash2, ShoppingBag, PackageCheck, Ban, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { mockUser } from "@/lib/mock-data"
import { useToast } from "@/hooks/use-toast"

export default function CartPage() {
  const router = useRouter()
  const { cart, updateQuantity, removeFromCart, getTotalAmount, clearCart } = useCart()
  const { toast } = useToast()

  const [isCheckoutOpen, setCheckoutOpen] = useState(false)
  const defaultAddress = mockUser.addresses.find(addr => addr.isDefault)
  const [selectedAddressId, setSelectedAddressId] = useState<string | undefined>(defaultAddress?.id)

  const availableItems = cart.items.filter(item => item.dish.isAvailable)
  const selectedAddress = mockUser.addresses.find(addr => addr.id === selectedAddressId)
  
  const truncateAddress = (address: string | undefined, maxLength: number = 55) => {
    if (!address) return "Chọn địa chỉ"
    return address.length > maxLength ? address.substring(0, maxLength) + "..." : address
  }

  const handleConfirmOrder = () => {
    console.log("Đơn hàng đã được xác nhận:", {
      user: mockUser.fullName,
      address: selectedAddress?.fullAddress,
      items: availableItems,
      total: getTotalAmount(),
    })

    setCheckoutOpen(false)

    toast({
      variant: "success",
      title: (
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span className="font-medium">Đặt hàng thành công!</span>
        </div>
      ),
      description: "Cảm ơn bạn đã mua sắm. Chúng tôi sẽ xử lý đơn hàng của bạn ngay.",
    })

    clearCart()

    router.push("/user/orders")
  }

  if (cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-md text-center">
          <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground" />
          <h2 className="mt-4 text-2xl font-bold text-foreground">Giỏ hàng của bạn trống</h2>
          <p className="mt-2 text-muted-foreground">Hãy thêm những món ăn ngon miệng vào đây nhé!</p>
          <Button className="mt-6" onClick={() => router.push("/user/food")}>
            Khám phá món ăn
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Dialog open={isCheckoutOpen} onOpenChange={setCheckoutOpen}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground flex items-baseline gap-3">
            Giỏ hàng
            <span className="text-xl font-normal text-muted-foreground">
              ({cart.items.length} món)
            </span>
          </h1>
        </div>

        <div className="grid gap-20 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {cart.items.map((item) => (
                <Card key={item.dish.id} className="border border-border shadow-sm">
                  <CardContent className="py-2 px-8 flex items-center gap-4">
                    <div className="relative h-25 w-25 shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.dish.image || "/placeholder.svg"}
                        alt={item.dish.name}
                        fill
                        className={cn("object-cover", !item.dish.isAvailable && "grayscale")}
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between self-stretch">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-base font-semibold text-card-foreground leading-tight">{item.dish.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{item.dish.price.toLocaleString("vi-VN")}đ</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" className="h-8 w-8 shrink-0 rounded-md" onClick={() => updateQuantity(item.dish.id, item.quantity - 1)} disabled={!item.dish.isAvailable}>
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                          <Button size="icon" variant="outline" className="h-8 w-8 shrink-0 rounded-md" onClick={() => updateQuantity(item.dish.id, item.quantity + 1)} disabled={!item.dish.isAvailable}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="border-b my-2"></div>
                      <div className="flex justify-between items-center">
                        {item.dish.isAvailable ? (
                          <div className="flex items-center gap-2 text-sm text-green-600">
                            <PackageCheck className="h-4 w-4" />
                            <span className="font-medium">Còn bán</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-sm text-red-600">
                            <Ban className="h-4 w-4" />
                            <span className="font-medium">Hết bán</span>
                          </div>
                        )}
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => removeFromCart(item.dish.id)}>
                          <Trash2 className="h-15 w-15" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Tổng đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-3 border-b pb-4">
                  {availableItems.length > 0 ? (
                    availableItems.map(item => (
                      <div key={item.dish.id} className="flex justify-between items-start text-base">
                        <p className="font-medium flex-1 pr-4 line-clamp-2">{item.dish.name}</p>
                        <div className="text-right">
                          <span className="font-semibold">{(item.dish.price * item.quantity).toLocaleString("vi-VN")}đ</span>
                          <p className="text-sm text-muted-foreground">SL: {item.quantity}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-base text-muted-foreground text-center py-2">
                      Không có món ăn hợp lệ để thanh toán.
                    </p>
                  )}
                </div>
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-lg font-semibold">Tổng cộng</span>
                    <span className="text-2xl font-bold text-primary">{(getTotalAmount()).toLocaleString("vi-VN")}đ</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-3">
                <DialogTrigger asChild>
                  <Button className="w-full h-11 text-base" disabled={availableItems.length === 0}>
                    Đặt hàng
                  </Button>
                </DialogTrigger>
                <Button variant="outline" className="w-full h-11 text-base bg-transparent" onClick={clearCart}>
                  Xóa giỏ hàng
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Xác nhận đơn hàng</DialogTitle>
            <DialogDescription>
              Vui lòng kiểm tra lại thông tin trước khi xác nhận đặt hàng.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Thông tin giao hàng</h4>
              <div className="rounded-lg border p-4 space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Họ tên:</span> <span className="font-medium text-right">{mockUser.fullName}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Email:</span> <span className="font-medium text-right">{mockUser.email}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Số điện thoại:</span> <span className="font-medium text-right">{mockUser.phone}</span></div>
                <Separator className="my-2" />
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Địa chỉ giao hàng:</label>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="w-full">
                          <Select value={selectedAddressId} onValueChange={setSelectedAddressId}>
                            <SelectTrigger className="mt-1 h-auto w-full bg-white">
                              <span className="text-sm text-left">
                                {truncateAddress(selectedAddress?.fullAddress)}
                              </span>
                            </SelectTrigger>
                            <SelectContent className="max-w-xs">
                            {mockUser.addresses.map(addr => (
                              <SelectItem 
                                key={addr.id} 
                                value={addr.id} 
                                className="whitespace-normal text-sm"
                              >
                                <span className="block max-w-[300px]">{addr.fullAddress}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                          </Select>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="bottom" className="max-w-sm break-words">
                        <p>{selectedAddress?.fullAddress}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <h4 className="text-lg font-semibold">Chi tiết đơn hàng</h4>
              <div className="rounded-lg border p-4 space-y-4">
                <div className="space-y-5">
                  {availableItems.map(item => (
                    <div key={item.dish.id} className="flex justify-between items-start text-sm">
                      <div>
                        <p className="font-medium flex-1 pr-4 line-clamp-2">{item.dish.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{item.dish.price.toLocaleString("vi-VN")}đ</p>
                      </div>
                      
                      <div className="text-right">
                        <span className="font-medium">{(item.dish.price * item.quantity).toLocaleString("vi-VN")}đ</span>
                        <p className="text-muted-foreground text-xs mt-1">SL: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between items-baseline">
                  <span className="text-lg font-bold">Tổng cộng</span>
                  <span className="text-xl font-bold text-primary">{(getTotalAmount()).toLocaleString("vi-VN")}đ</span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Hủy</Button>
            </DialogClose>
            <Button type="button" onClick={handleConfirmOrder}>Xác nhận đặt hàng</Button>
          </DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  )
}