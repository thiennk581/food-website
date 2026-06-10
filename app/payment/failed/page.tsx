"use client";

import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function PaymentFailedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reason = searchParams.get("reason");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
      <div className="flex max-w-md flex-col items-center space-y-6 text-center">
        <XCircle className="h-20 w-20 text-destructive" />
        <div>
          <h2 className="text-2xl font-bold text-foreground">Thanh toán thất bại</h2>
          <p className="mt-2 text-muted-foreground">
            {reason ? decodeURIComponent(reason) : "Đã xảy ra lỗi trong quá trình thanh toán hoặc giao dịch bị hủy."}
          </p>
        </div>
        <div className="flex w-full gap-4">
          <Button variant="outline" onClick={() => router.push("/user/cart")} className="flex-1">
            Về giỏ hàng
          </Button>
          <Button onClick={() => router.push("/user/checkout")} className="flex-1">
            Thử lại
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaymentFailedPage() {
  return (
    <Suspense>
      <PaymentFailedContent />
    </Suspense>
  );
}
