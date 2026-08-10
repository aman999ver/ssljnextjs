"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

export default function EsewaPaymentRedirect() {
  const searchParams = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);

  const amount = searchParams.get('amount') || "";
  const tax_amount = searchParams.get('tax_amount') || "0";
  const total_amount = searchParams.get('total_amount') || "";
  const transaction_uuid = searchParams.get('transaction_uuid') || "";
  const product_code = searchParams.get('product_code') || "EPAYTEST";
  const product_service_charge = searchParams.get('product_service_charge') || "0";
  const product_delivery_charge = searchParams.get('product_delivery_charge') || "0";
  const success_url = searchParams.get('success_url') || "";
  const failure_url = searchParams.get('failure_url') || "";
  const signed_field_names = searchParams.get('signed_field_names') || "";
  const signature = searchParams.get('signature') || "";

  useEffect(() => {
    if (signature && formRef.current) {
      formRef.current.submit();
    }
  }, [signature]);

  if (!signature) {
    return <div className="min-h-screen flex items-center justify-center font-sans tracking-widest text-muted-foreground uppercase text-xs">Invalid Payment Request</div>;
  }

  // Use test environment URL by default. 
  // For production: https://epay.esewa.com.np/api/epay/main/v2/form
  const esewaUrl = "https://rc-epay.esewa.com.np/api/epay/main/v2/form";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="animate-pulse flex flex-col items-center gap-6">
        <h2 className="font-heading text-2xl">Redirecting to eSewa...</h2>
        <p className="font-sans text-xs tracking-widest uppercase text-muted-foreground">Please do not refresh the page</p>
      </div>
      
      <form ref={formRef} action={esewaUrl} method="POST" className="hidden">
        <input type="hidden" id="amount" name="amount" value={amount} required />
        <input type="hidden" id="tax_amount" name="tax_amount" value={tax_amount} required />
        <input type="hidden" id="total_amount" name="total_amount" value={total_amount} required />
        <input type="hidden" id="transaction_uuid" name="transaction_uuid" value={transaction_uuid} required />
        <input type="hidden" id="product_code" name="product_code" value={product_code} required />
        <input type="hidden" id="product_service_charge" name="product_service_charge" value={product_service_charge} required />
        <input type="hidden" id="product_delivery_charge" name="product_delivery_charge" value={product_delivery_charge} required />
        <input type="hidden" id="success_url" name="success_url" value={success_url} required />
        <input type="hidden" id="failure_url" name="failure_url" value={failure_url} required />
        <input type="hidden" id="signed_field_names" name="signed_field_names" value={signed_field_names} required />
        <input type="hidden" id="signature" name="signature" value={signature} required />
      </form>
    </div>
  );
}
