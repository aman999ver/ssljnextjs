import { RateCard } from "@/components/shared/RateCard";
import { Navbar } from "@/components/shared/Navbar";
import Link from "next/link";

async function getRates() {
  const apiUrl = process.env.NEXT_PUBLIC_RATES_API_URL || "https://swarna-mobile.onrender.com/api/rates/regional?town=Biratnagar";
  
  try {
    const res = await fetch(apiUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch rates:", error);
    return null;
  }
}

export default async function RatesPage() {
  const ratesData = await getRates();
  const offset = ratesData?.offset;
  
  const gold24k = offset?.final_gold_rate || 0;
  const gold22k = Math.round(gold24k * 0.92);
  const silver = offset?.final_silver_rate || 0;

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <section className="py-24 px-8 max-w-7xl mx-auto w-full flex-grow">
        <div className="mb-16">
          <span className="font-sans text-xs tracking-[0.2em] uppercase text-primary mb-2 block">Market Update</span>
          <h1 className="font-heading text-5xl md:text-6xl text-foreground mb-6 leading-tight">Biratnagar Regional Rates</h1>
          <p className="font-sans text-lg font-light text-muted-foreground max-w-2xl">
            Current market prices for gold and silver in the Biratnagar region. These rates are verified by the local jewellers association.
          </p>
        </div>

        {!ratesData ? (
          <div className="p-12 border border-destructive/20 bg-destructive/5 flex items-center justify-center">
            <p className="font-sans text-destructive tracking-widest uppercase">Currently unable to fetch live rates. Please try again later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <RateCard metal="Gold" purity="24K" rate={gold24k} unit="Tola" />
            <RateCard metal="Gold" purity="22K" rate={gold22k} unit="Tola" />
            <RateCard metal="Silver" purity="Pure" rate={silver} unit="Tola" />
          </div>
        )}
        
        <div className="mt-20 pt-10 border-t border-border flex flex-col md:flex-row justify-between text-muted-foreground font-sans text-sm font-light">
          <p>Prices are indicative and subject to change without prior notice.</p>
          <p className="mt-4 md:mt-0">Source: Local Federation of Nepal Gold Silver Dealers' Association</p>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-foreground text-background py-20 px-8">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-heading text-xl uppercase tracking-widest text-primary mb-4">Shree Shubha Laxmi</p>
          <p className="font-sans text-xs font-light tracking-widest uppercase opacity-60">Biratnagar, Nepal</p>
        </div>
      </footer>
    </main>
  );
}
