"use client";

import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PaymentSuccessPage() {
  const router = useRouter();

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
      <div className="flex max-w-md flex-col items-center space-y-6 text-center">
        <CheckCircle2 className="h-20 w-20 text-green-500" />
        <div>
          <h2 className="text-2xl font-bold text-foreground">Thanh toán thành công!</h2>
          <p className="mt-2 text-muted-foreground">
            Đơn hàng của bạn đã được thanh toán và đang được chuẩn bị. Cảm ơn bạn đã đặt hàng!
          </p>
        </div>
        <Button onClick={() => router.push("/user/orders")} className="w-full">
          Xem đơn hàng của tôi
        </Button>
        <Button variant="outline" onClick={() => router.push("/user/food")} className="w-full">
          Tiếp tục mua sắm
        </Button>
      </div>
    </div>
  );
}
