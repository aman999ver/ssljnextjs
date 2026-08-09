import React from "react";
import Link from "next/link";

interface ProductCardProps {
  name: string;
  slug: string;
  price?: number;
  imageUrl?: string;
  category?: string;
}

export function ProductCard({ name, slug, price, imageUrl, category }: ProductCardProps) {
  return (
    <Link href={`/product/${slug}`} className="group block cursor-pointer">
      <div className="relative aspect-[4/5] bg-muted/30 overflow-hidden mb-6">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={name} 
            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/50 font-sans tracking-widest text-xs uppercase">
            No Image
          </div>
        )}
        
        {/* Subtle hover overlay */}
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/5 transition-colors duration-500" />
      </div>
      
      <div className="flex flex-col space-y-2 px-1">
        {category && (
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {category}
          </span>
        )}
        <h3 className="font-heading text-xl text-foreground font-normal leading-tight group-hover:text-primary transition-colors duration-300">
          {name}
        </h3>
        <div className="pt-2">
          {price ? (
            <span className="font-sans text-sm tracking-wide text-foreground">
              NPR {price.toLocaleString()}
            </span>
          ) : (
            <span className="font-sans text-sm tracking-wide text-muted-foreground italic">
              Price upon request
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
