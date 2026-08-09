import { RateCard } from "@/components/shared/RateCard";
import { ProductCard } from "@/components/shared/ProductCard";
import { Navbar } from "@/components/shared/Navbar";
import Link from "next/link";

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

// Fetch Data from Render API
async function getDbData() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ssljnextjs.onrender.com";
  try {
    // Fetch featured products
    const prodRes = await fetch(`${backendUrl}/api/products/featured`, { cache: 'no-store' });
    const products = prodRes.ok ? await prodRes.json() : [];

    // Fetch active banner
    const bannerRes = await fetch(`${backendUrl}/api/banners/active`, { cache: 'no-store' });
    const banner = bannerRes.ok ? await bannerRes.json() : null;
    
    return { products, banner };
  } catch (error) {
    console.error("Failed to fetch from Backend API:", error);
    return { products: [], banner: null };
  }
}

export default async function Home() {
  const ratesData = await getRates();
  const dbData = await getDbData();
  const offset = ratesData?.offset;
  
  const gold24k = offset?.final_gold_rate || 0;
  const gold22k = Math.round(gold24k * 0.92);
  const silver = offset?.final_silver_rate || 0;

  const bannerImageUrl = dbData.banner?.image || dbData.banner?.imageUrl || null;

  return (
    <main className="flex flex-col min-h-screen">
      {/* 1. Announcement Bar */}
      <div className="bg-foreground text-background py-2 text-center text-xs tracking-widest uppercase font-sans font-light">
        Free secure delivery across Biratnagar on orders over NPR 50,000
      </div>

      {/* 2. Elegant Navigation */}
      <Navbar />

      {/* 3. Hero Section (Dynamic Banner) */}
      <section className="relative h-[80vh] flex items-center justify-center bg-muted overflow-hidden">
        {bannerImageUrl && (
          <img src={bannerImageUrl} alt="Banner" className="absolute inset-0 w-full h-full object-cover opacity-70 mix-blend-overlay animate-fade-in-up" style={{ animationDuration: '1.5s' }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/10 to-background/80" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
          <span className="font-sans text-sm tracking-[0.3em] uppercase text-primary mb-6 animate-fade-in-up opacity-0">Legacy of Purity</span>
          <h1 className="font-heading text-5xl md:text-7xl font-normal text-foreground mb-8 leading-tight animate-fade-in-up opacity-0 animate-delay-100">
            Crafting Timeless Elegance in Biratnagar
          </h1>
          <Link href="/shop" className="inline-block border border-foreground bg-foreground/5 backdrop-blur-sm px-12 py-4 font-sans text-sm tracking-widest uppercase hover:bg-foreground hover:text-background transition-all duration-500 animate-fade-in-up opacity-0 animate-delay-200">
            Explore the Collection
          </Link>
        </div>
      </section>

      {/* 4. Today's Jewellery Rates */}
      <section className="py-24 px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16">
          <div>
            <span className="font-sans text-xs tracking-[0.2em] uppercase text-primary mb-2 block">Market Update</span>
            <h2 className="font-heading text-4xl text-foreground">Today's Regional Rates</h2>
          </div>
          <Link href="/rates" className="font-sans text-xs tracking-widest uppercase border-b border-foreground pb-1 hover:text-primary hover:border-primary transition-colors mt-6 md:mt-0">
            View Historical Data
          </Link>
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
      </section>

      {/* 5. Featured Jewellery (Dynamic Products) */}
      <section className="py-24 px-8 max-w-7xl mx-auto w-full">
        <div className="text-center mb-16">
          <span className="font-sans text-xs tracking-[0.2em] uppercase text-primary mb-2 block">Curated Selection</span>
          <h2 className="font-heading text-4xl text-foreground">Featured Masterpieces</h2>
        </div>
        
        {dbData.products.length === 0 ? (
          <div className="text-center text-muted-foreground font-sans text-sm tracking-widest uppercase py-12">
            No products found in the database.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {dbData.products.map((product) => (
              <ProductCard key={product.slug} {...product} />
            ))}
          </div>
        )}

        <div className="mt-16 text-center">
          <Link href="/shop" className="inline-block border-b border-foreground pb-1 font-sans text-xs tracking-widest uppercase hover:text-primary hover:border-primary transition-colors">
            View All Creations
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-background py-20 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <h3 className="font-heading text-2xl uppercase tracking-widest text-primary mb-6">Shree Shubha Laxmi</h3>
            <p className="font-sans text-sm font-light leading-relaxed max-w-sm opacity-80">
              A trusted name in Biratnagar for pure gold and silver jewellery. We craft pieces that celebrate life's most precious moments.
            </p>
          </div>
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase mb-6 opacity-60">Explore</h4>
            <ul className="space-y-4 font-sans text-sm font-light">
              <li><Link href="/shop" className="hover:text-primary transition-colors">Collections</Link></li>
              <li><Link href="/rates" className="hover:text-primary transition-colors">Daily Rates</Link></li>
              <li><Link href="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-sans text-xs tracking-widest uppercase mb-6 opacity-60">Visit Us</h4>
            <address className="not-italic font-sans text-sm font-light space-y-2 opacity-80">
              <p>Main Road, Biratnagar</p>
              <p>Morang, Nepal</p>
              <p className="pt-4 hover:text-primary transition-colors cursor-pointer">info@subhalaxmijewellery.com.np</p>
            </address>
          </div>
        </div>
      </footer>
    </main>
  );
}
