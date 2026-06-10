"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { verifyVnpayPayment } from "@/services/orders";

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      const queryString = window.location.search;
      if (!queryString) {
        setStatus("error");
        setMessage("Không có thông tin thanh toán");
        return;
      }
      try {
        const responseMessage = await verifyVnpayPayment(queryString);
        if (responseMessage === "Payment successful") {
          router.push("/payment/success");
        } else {
          router.push(`/payment/failed?reason=${encodeURIComponent("Thanh toán thất bại hoặc đã bị hủy.")}`);
        }
      } catch (e: any) {
        router.push(`/payment/failed?reason=${encodeURIComponent(e.message || "Đã xảy ra lỗi khi xác minh thanh toán.")}`);
      }
    };
    verify();
  }, [searchParams, router]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-4">
      {status === "loading" ? (
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <h2 className="text-xl font-semibold">Đang xác minh thanh toán...</h2>
        </div>
      ) : null}
    </div>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[60vh] items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>}>
      <PaymentCallbackContent />
    </Suspense>
  );
}
