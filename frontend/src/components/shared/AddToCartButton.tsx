"use client";

import React from "react";
import { Button } from "@/components/ui/button";

interface AddToCartButtonProps {
  productId: string;
  className?: string;
  variant?: "default" | "outline" | "ghost";
}

export function AddToCartButton({ productId, className, variant = "default" }: AddToCartButtonProps) {
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login first to add to cart");
      window.location.href = "/login";
      return;
    }

    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ssljnextjs.onrender.com";
    try {
      const res = await fetch(`${backendUrl}/api/cart/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ productId, quantity: 1 })
      });
      
      if (res.ok) {
        alert("Added to cart!");
        window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { addedQuantity: 1 } }));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to add to cart");
      }
    } catch (error) {
      console.error(error);
      alert("An unexpected error occurred.");
    }
  };

  return (
    <Button 
      variant={variant}
      className={className || "w-full py-3 border border-border text-xs uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background transition-colors duration-300"}
      onClick={handleAddToCart}
    >
      Add to Cart
    </Button>
  );
}
