"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useCart } from "@/hooks/use-cart";
import { fetchUserProfile } from "@/services/users";
import { mockRestaurants } from "@/lib/mock-data";
import type { Order, Promotion } from "@/types";
import { MapPin, CreditCard, Wallet, Ticket, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchUserAddresses, type UserAddressResponse } from "@/services/addresses";
import { useToast } from "@/hooks/use-toast";
import { validatePromotion } from "@/services/promotions";
import { createOrder, createVnpayPayment } from "@/services/orders";

export const dynamic = "force-dynamic";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getTotalAmount, clearCart, isLoaded } = useCart();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [isProcessing, setIsProcessing] = useState(false);
  const [promotionCode, setPromotionCode] = useState("");
  const [appliedPromotion, setAppliedPromotion] = useState<Promotion | null>(null);
  const [isApplyingCode, setIsApplyingCode] = useState(false);

  const [addresses, setAddresses] = useState<UserAddressResponse[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | number | undefined>(undefined);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      fetchUserProfile({ token }).then(data => setUser(data)).catch(() => setUser(null));
      fetchUserAddresses(token)
        .then((data) => {
          setAddresses(data);
          const defaultAddr = data.find((a) => a.isDefault);
          if (defaultAddr) setSelectedAddressId(defaultAddr.id);
          else if (data.length > 0) setSelectedAddressId(data[0].id);
        })
        .catch((e) => console.error(e));
    }
  }, []);

  const restaurant = mockRestaurants.find((r) => r.id === cart.items[0]?.dish?.restaurantId);
  const deliveryFee = 15000;
  const subTotal = getTotalAmount();
  let discountAmount = 0;

  if (appliedPromotion) {
    if (appliedPromotion.type === "PERCENTAGE") {
      discountAmount = subTotal * (appliedPromotion.value / 100);
      if (appliedPromotion.maxDiscountAmount && discountAmount > appliedPromotion.maxDiscountAmount) {
        discountAmount = appliedPromotion.maxDiscountAmount;
      }
    } else {
      discountAmount = appliedPromotion.value;
    }
    if (discountAmount > subTotal) discountAmount = subTotal;
  }

  const totalAmount = subTotal + deliveryFee - discountAmount;

  useEffect(() => {
    if (isLoaded && cart.items.length === 0) {
      router.replace("/user/cart");
    }
  }, [cart.items.length, isLoaded, router]);

  if (!isLoaded || cart.items.length === 0) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const handleApplyPromotion = async () => {
    if (!promotionCode.trim()) return;
    setIsApplyingCode(true);
    try {
      const promotion = await validatePromotion(promotionCode, subTotal);
      setAppliedPromotion(promotion);
      toast({ title: "Đã áp dụng mã khuyến mãi" });
    } catch (e: any) {
      toast({ variant: "destructive", title: "Lỗi mã khuyến mãi", description: e.message });
      setAppliedPromotion(null);
    } finally {
      setIsApplyingCode(false);
    }
  };

  const handlePlaceOrder = async () => {
    setIsProcessing(true);

    try {
      // Use selectedAddressId instead of searching through user.address
      const addressId = selectedAddressId ? Number(selectedAddressId) : undefined;
      
      if (!addressId) {
        toast({ variant: "destructive", title: "Vui lòng chọn địa chỉ giao hàng" });
        setIsProcessing(false);
        return;
      }

      const orderData = {
        addressId,
        promotionCode: appliedPromotion?.code,
        paymentMethod
      };

      const newOrder = await createOrder(orderData);

      if (paymentMethod === "VNPAY") {
        const paymentRes = await createVnpayPayment(newOrder.id);
        if (paymentRes.paymentUrl) {
          clearCart();
          window.location.href = paymentRes.paymentUrl;
          return;
        }
      }

      clearCart();
      setIsProcessing(false);

      toast({
        title: "Đặt hàng thành công!",
        description: "Đơn hàng của bạn đang được xử lý",
      });

      router.push("/user/orders");
    } catch (e: any) {
      toast({ variant: "destructive", title: "Đặt hàng thất bại", description: e.message });
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold text-foreground">Thanh toán</h1>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Checkout Form */}
        <div className="space-y-6 lg:col-span-2">
          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Địa chỉ giao hàng
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border border-border bg-muted/50 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">Nhà riêng</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {addresses.find((a) => a.id === selectedAddressId)?.address || "Chưa có địa chỉ"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user?.phone}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setIsAddressModalOpen(true)}>
                    Thay đổi
                  </Button>
                </div>
              </div>

              <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Chọn địa chỉ giao hàng</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    {addresses.length === 0 ? (
                      <p className="text-center text-muted-foreground">Bạn chưa có địa chỉ nào. Hãy thêm địa chỉ trong hồ sơ.</p>
                    ) : (
                      <RadioGroup
                        value={String(selectedAddressId)}
                        onValueChange={(val) => {
                          setSelectedAddressId(Number(val));
                          setIsAddressModalOpen(false);
                        }}
                      >
                        {addresses.map((addr) => (
                          <div key={addr.id} className="flex items-center space-x-2 rounded border p-3 hover:bg-muted cursor-pointer" onClick={() => { setSelectedAddressId(addr.id); setIsAddressModalOpen(false); }}>
                            <RadioGroupItem value={String(addr.id)} id={`addr-${addr.id}`} />
                            <Label htmlFor={`addr-${addr.id}`} className="flex-1 cursor-pointer">
                              {addr.address}
                              {addr.isDefault && <span className="ml-2 text-xs font-semibold text-primary">(Mặc định)</span>}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Món ăn từ {restaurant?.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.dish.id} className="flex gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <Image
                      src={item.dish.image || "/placeholder.svg"}
                      alt={item.dish.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 items-center justify-between">
                    <div>
                      <h3 className="font-medium text-card-foreground">
                        {item.dish.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        x{item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {(item.dish.price * item.quantity).toLocaleString(
                        "vi-VN",
                      )}
                      đ
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Phương thức thanh toán
              </CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={setPaymentMethod}
              >
                <div className="flex items-center space-x-3 rounded-lg border border-border p-4">
                  <RadioGroupItem value="CASH" id="CASH" />
                  <Label
                    htmlFor="CASH"
                    className="flex flex-1 cursor-pointer items-center gap-3"
                  >
                    <Wallet className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Tiền mặt</p>
                      <p className="text-sm text-muted-foreground">
                        Thanh toán khi nhận hàng
                      </p>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border border-border p-4">
                  <RadioGroupItem value="VNPAY" id="VNPAY" />
                  <Label
                    htmlFor="VNPAY"
                    className="flex flex-1 cursor-pointer items-center gap-3"
                  >
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">VNPAY</p>
                      <p className="text-sm text-muted-foreground">
                        Thanh toán trực tuyến an toàn với VNPAY
                      </p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Note */}
          <Card>
            <CardHeader>
              <CardTitle>Ghi chú</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Ghi chú cho người bán (tùy chọn)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-5 w-5" />
                Mã khuyến mãi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập mã khuyến mãi"
                  value={promotionCode}
                  onChange={(e) => setPromotionCode(e.target.value)}
                />
                <Button variant="secondary" onClick={handleApplyPromotion} disabled={isApplyingCode}>
                  {isApplyingCode ? <Loader2 className="h-4 w-4 animate-spin" /> : "Áp dụng"}
                </Button>
              </div>
              {appliedPromotion && (
                <div className="mt-3 p-3 bg-green-50 text-green-700 border border-green-200 rounded-md text-sm">
                  Đã áp dụng mã <b>{appliedPromotion.code}</b>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Tổng đơn hàng</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tạm tính</span>
                  <span className="font-medium">
                    {subTotal.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Phí giao hàng</span>
                  <span className="font-medium">
                    {deliveryFee.toLocaleString("vi-VN")}đ
                  </span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Khuyến mãi</span>
                    <span className="font-medium">
                      -{discountAmount.toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                )}
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex justify-between">
                  <span className="font-semibold">Tổng cộng</span>
                  <span className="text-xl font-bold text-primary">
                    {totalAmount.toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
              <Button
                className="w-full"
                onClick={handlePlaceOrder}
                disabled={isProcessing}
              >
                {isProcessing ? "Đang xử lý..." : "Đặt hàng"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
