"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [orderNumber, setOrderNumber] = useState<string>("");

  useEffect(() => {
    const verifyPayment = async () => {
      const data = searchParams.get('data');
      if (!data) {
        setStatus("error");
        return;
      }

      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ssljnextjs.onrender.com";
      try {
        const res = await fetch(`${backendUrl}/api/payment/esewa/verify?data=${data}`);
        if (res.ok) {
          const result = await res.json();
          setOrderNumber(result.orderNumber);
          setStatus("success");
          
          // Dispatch event to clear cart in UI
          window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { addedQuantity: -100 } })); // Trigger reload
        } else {
          setStatus("error");
        }
      } catch (err) {
        setStatus("error");
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <div className="flex-grow flex flex-col items-center justify-center py-24 px-8 max-w-2xl mx-auto text-center">
      {status === "loading" && (
        <>
          <Loader2 className="w-16 h-16 animate-spin text-muted-foreground mb-8 mx-auto" />
          <h1 className="font-heading text-4xl mb-4">Verifying Payment...</h1>
          <p className="font-sans tracking-widest text-muted-foreground uppercase text-sm">Please wait while we confirm with eSewa</p>
        </>
      )}

      {status === "success" && (
        <>
          <CheckCircle2 className="w-20 h-20 text-green-600 mb-8 mx-auto" />
          <h1 className="font-heading text-4xl mb-4">Payment Successful!</h1>
          <p className="font-sans tracking-widest text-muted-foreground uppercase text-sm mb-8">
            Order #{orderNumber} has been confirmed.
          </p>
          <Link href="/profile">
            <Button className="uppercase tracking-widest px-8">View Order History</Button>
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="w-20 h-20 text-destructive mb-8 mx-auto" />
          <h1 className="font-heading text-4xl mb-4">Verification Failed</h1>
          <p className="font-sans tracking-widest text-muted-foreground uppercase text-sm mb-8">
            We could not verify your payment with eSewa. Please contact support.
          </p>
          <Link href="/contact">
            <Button variant="outline" className="uppercase tracking-widest px-8">Contact Support</Button>
          </Link>
        </>
      )}
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <Suspense fallback={<div className="flex-grow flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
        <SuccessContent />
      </Suspense>
    </main>
  );
}
