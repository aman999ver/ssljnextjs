import { Navbar } from "@/components/shared/Navbar";
import { RateCard } from "@/components/shared/RateCard";
import { Metadata } from 'next';
import Link from "next/link";

export const metadata: Metadata = {
  title: "Live Metal Rates",
  description: "Check today's live Gold and Silver rates in Biratnagar. Accurate and real-time market updates.",
};

// Fetch Live Rates
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
  const rates = await getRates();
  
  const gold24k = rates?.offset?.final_gold_rate || 0;
  const gold22k = Math.round(gold24k * 0.92);
  const silver = rates?.offset?.final_silver_rate || 0;
  
  const formattedDate = new Date().toLocaleDateString("en-US", {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-muted py-24 text-center px-4">
        <h1 className="font-heading text-5xl md:text-6xl text-foreground mb-4">Live Market Rates</h1>
        <p className="font-sans text-sm tracking-widest uppercase text-muted-foreground">
          Transparent pricing for {formattedDate}
        </p>
      </section>

      {/* Rates Section */}
      <section className="py-24 px-8 max-w-4xl mx-auto w-full flex-grow">
        
        {rates ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* 24K Gold Card */}
            <div className="bg-muted/30 border border-border/50 p-12 text-center hover:border-primary transition-colors duration-500 flex flex-col items-center justify-center">
              <h2 className="font-heading text-2xl text-foreground mb-2">24K Fine Gold</h2>
              <div className="w-12 h-[1px] bg-primary mb-6"></div>
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Per Tola</span>
              <p className="font-sans text-3xl tracking-widest text-foreground">
                NPR {gold24k.toLocaleString()}
              </p>
              <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mt-6 opacity-60">
                (99.9% Purity)
              </p>
            </div>

            {/* 22K Gold Card */}
            <div className="bg-muted/30 border border-border/50 p-12 text-center hover:border-primary transition-colors duration-500 flex flex-col items-center justify-center">
              <h2 className="font-heading text-2xl text-foreground mb-2">22K Tejabi Gold</h2>
              <div className="w-12 h-[1px] bg-primary mb-6"></div>
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Per Tola</span>
              <p className="font-sans text-3xl tracking-widest text-foreground">
                NPR {gold22k.toLocaleString()}
              </p>
              <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mt-6 opacity-60">
                (91.6% Purity)
              </p>
            </div>

            {/* Silver Card */}
            <div className="bg-muted/30 border border-border/50 p-12 text-center hover:border-primary transition-colors duration-500 flex flex-col items-center justify-center">
              <h2 className="font-heading text-2xl text-foreground mb-2">Fine Silver</h2>
              <div className="w-12 h-[1px] bg-primary mb-6"></div>
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">Per Tola</span>
              <p className="font-sans text-3xl tracking-widest text-foreground">
                NPR {silver.toLocaleString()}
              </p>
              <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground mt-6 opacity-60">
                (99.9% Purity)
              </p>
            </div>

          </div>
        ) : (
          <div className="text-center p-16 bg-muted/20 border border-border/50">
            <p className="font-sans uppercase tracking-widest text-sm text-muted-foreground">
              Market rates are currently unavailable. Please check back later.
            </p>
          </div>
        )}

        <div className="mt-24 border-t border-border/50 pt-12 text-center max-w-2xl mx-auto">
          <p className="font-sans font-light text-muted-foreground leading-relaxed text-sm">
            At Shree Shubha Laxmi Jewellery, we believe in complete transparency. Our daily rates are directly sourced from the Nepal Gold and Silver Dealers' Association (NEGOSIDA). Final product prices may include applicable craftsmanship charges and government taxes.
          </p>
          <div className="mt-8 flex justify-center gap-6">
             <Link href="/shop" className="font-sans text-xs tracking-widest uppercase border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors">
               Explore Collection
             </Link>
             <Link href="/contact" className="font-sans text-xs tracking-widest uppercase border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors">
               Contact Us
             </Link>
          </div>
        </div>

      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-20 px-8 mt-12">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-heading text-xl uppercase tracking-widest text-primary mb-4">Shree Shubha Laxmi</p>
          <p className="font-sans text-xs font-light tracking-widest uppercase opacity-60">Biratnagar, Nepal</p>
        </div>
      </footer>
    </main>
  );
}
