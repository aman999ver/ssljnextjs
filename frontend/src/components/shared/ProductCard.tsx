"use client";

import React from "react";
import { calculatePrice } from "@/lib/utils";

interface ProductCardProps {
  name: string;
  slug: string;
  price?: number; // legacy static price
  metalType?: string;
  weight?: number;
  lossType?: string;
  lossValue?: number;
  makingCharge?: number;
  imageUrl?: string;
  category?: string;
  rates?: any; // The fetched live rates
  taxes?: { goldTax: number, silverTax: number };
}

export function ProductCard({ 
  name, slug, price, metalType, weight, lossType, lossValue, makingCharge, imageUrl, category, rates, taxes 
}: ProductCardProps) {
  
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const token = localStorage.getItem("token");
    if (!token) {
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
        body: JSON.stringify({ productId: slug, quantity: 1 }) // Using slug as ID for simplicity
      });
      
      if (res.ok) {
        alert("Added to cart!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const displayPrice = calculatePrice({ price, metalType, weight, lossType, lossValue, makingCharge }, rates, taxes);

  return (
    <div className="group block cursor-pointer transition-all duration-300 hover:-translate-y-1" onClick={() => window.location.href = `/product/${slug}`}>
      <div className="relative aspect-[4/5] bg-muted/20 overflow-hidden mb-6 shadow-sm group-hover:shadow-xl transition-shadow duration-300">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/50 font-sans text-xs uppercase tracking-widest">
            No Image
          </div>
        )}
        
        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>
      
      <div className="flex flex-col space-y-2 px-1 text-center">
        {category && (
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {category} {metalType ? `| ${metalType}` : ''}
          </span>
        )}
        <h3 className="font-heading text-xl text-foreground font-normal leading-tight group-hover:text-primary transition-colors duration-300">
          {name}
        </h3>
        
        {displayPrice > 0 ? (
          <p className="font-sans text-sm tracking-wide text-foreground mb-4">
            NPR {displayPrice.toLocaleString()}
          </p>
        ) : (
          <p className="font-sans text-sm tracking-wide text-muted-foreground italic mb-4">
            Price upon request
          </p>
        )}
        
        <button 
          onClick={handleAddToCart}
          className="w-full py-3 border border-border text-xs uppercase tracking-widest text-foreground hover:bg-foreground hover:text-background transition-colors duration-300"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
