"use client";

import { Suspense } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { XCircle, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

function FailureContent() {
  const searchParams = useSearchParams();
  const reason = searchParams.get('reason');

  return (
    <div className="flex-grow flex flex-col items-center justify-center py-24 px-8 max-w-2xl mx-auto text-center">
      <XCircle className="w-20 h-20 text-destructive mb-8 mx-auto" />
      <h1 className="font-heading text-4xl mb-4">Payment Failed</h1>
      <p className="font-sans tracking-widest text-muted-foreground uppercase text-sm mb-8">
        {reason === 'incomplete' 
          ? "The payment was not completed on eSewa." 
          : "Your payment could not be processed at this time."}
      </p>
      <div className="flex gap-4 justify-center">
        <Link href="/checkout">
          <Button className="uppercase tracking-widest px-8">Try Again</Button>
        </Link>
        <Link href="/contact">
          <Button variant="outline" className="uppercase tracking-widest px-8">Contact Support</Button>
        </Link>
      </div>
    </div>
  );
}

export default function PaymentFailurePage() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <Suspense fallback={<div className="flex-grow flex items-center justify-center"><Loader2 className="animate-spin" /></div>}>
        <FailureContent />
      </Suspense>
    </main>
  );
}
