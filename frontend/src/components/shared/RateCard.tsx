import React from "react";

interface RateCardProps {
  metal: "Gold" | "Silver";
  purity?: "24K" | "22K" | "Pure";
  rate: number;
  unit: string;
}

export function RateCard({ metal, purity, rate, unit }: RateCardProps) {
  const isGold = metal === "Gold";

  return (
    <div className={`group relative p-8 border-b ${isGold ? 'border-primary/40' : 'border-border'} bg-transparent flex flex-col justify-between transition-colors duration-500 hover:bg-muted/10`}>
      <div className="flex justify-between items-start mb-12">
        <div>
          <h3 className="font-heading text-3xl font-normal text-foreground leading-none">
            {metal}
          </h3>
          <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mt-3">
            {purity || "Standard"}
          </p>
        </div>
        
        {/* Decorative corner accent */}
        <div className="w-2 h-2 border-t border-r border-foreground/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
      
      <div className="flex flex-col">
        <span className="font-sans text-sm font-light text-muted-foreground uppercase tracking-widest mb-1">
          Per {unit}
        </span>
        <span className="font-heading text-4xl lg:text-5xl font-light tracking-tight text-foreground">
          NPR {rate.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
