import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import Link from "next/link";
import React from "react";
import { calculatePrice } from "@/lib/utils";

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

// Fetch Product and Settings
async function getProductData(slug: string) {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ssljnextjs.onrender.com";
  try {
    const [productRes, settingsRes] = await Promise.all([
      fetch(`${backendUrl}/api/products/${slug}`, { cache: 'no-store' }),
      fetch(`${backendUrl}/api/settings`, { cache: 'no-store' })
    ]);

    const product = productRes.ok ? await productRes.json() : null;
    const settings = settingsRes.ok ? await settingsRes.json() : [];

    const taxes = {
      goldTax: settings.find((s: any) => s.key === "goldTax")?.value || 0,
      silverTax: settings.find((s: any) => s.key === "silverTax")?.value || 0,
    };

    return { product, taxes };
  } catch (error) {
    console.error("Failed to fetch product data:", error);
    return { product: null, taxes: { goldTax: 0, silverTax: 0 } };
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const ratesData = await getRates();
  const { product, taxes } = await getProductData(slug);

  if (!product) {
    return (
      <main className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center font-sans uppercase tracking-widest text-muted-foreground">
          Product Not Found
        </div>
      </main>
    );
  }

  const finalPrice = calculatePrice(product, ratesData, taxes);

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <section className="py-12 md:py-24 px-8 max-w-7xl mx-auto w-full flex-grow">
        {/* Breadcrumb */}
        <div className="mb-12 font-sans text-xs tracking-widest uppercase text-muted-foreground flex space-x-2">
          <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <Link href="/shop" className="hover:text-foreground transition-colors">Shop</Link>
          <span>/</span>
          <Link href={`/category/${product.category?.toLowerCase()}`} className="hover:text-foreground transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Product Images */}
          <div className="flex flex-col space-y-4">
            <div className="aspect-[4/5] bg-muted/30 w-full relative">
              {product.imageUrl ? (
                <img src={product.imageUrl} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 font-sans tracking-widest text-sm uppercase">
                  No Image
                </div>
              )}
            </div>
            {product.images && product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img: string, i: number) => (
                  <div key={i} className="aspect-square bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer overflow-hidden">
                    <img src={img} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col pt-8">
            <span className="font-sans text-xs tracking-[0.2em] uppercase text-primary mb-4">{product.category} {product.metalType ? `| ${product.metalType}` : ''}</span>
            <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-6 leading-tight">{product.name}</h1>
            
            {finalPrice > 0 ? (
              <div className="font-sans text-2xl tracking-wide text-foreground mb-10">
                NPR {finalPrice.toLocaleString()}
              </div>
            ) : (
              <div className="font-sans text-2xl tracking-wide text-muted-foreground italic mb-10">
                Price upon request
              </div>
            )}
            
            <p className="font-sans font-light text-muted-foreground leading-relaxed mb-12">
              {product.description || "No description provided."}
            </p>

            <div className="mb-12">
              <h3 className="font-sans text-xs tracking-widest uppercase mb-4 opacity-60">Specifications</h3>
              <ul className="space-y-3 font-sans text-sm font-light">
                <li className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Metal Type</span>
                  <span className="text-foreground text-right">{product.metalType || "N/A"}</span>
                </li>
                <li className="flex justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Weight</span>
                  <span className="text-foreground text-right">{product.weight ? `${product.weight}g` : "N/A"}</span>
                </li>
                {product.makingCharge > 0 && (
                  <li className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">Making Charge</span>
                    <span className="text-foreground text-right">NPR {product.makingCharge.toLocaleString()}</span>
                  </li>
                )}
              </ul>
            </div>

            <Button className="w-full h-16 rounded-none font-sans tracking-widest uppercase text-sm border border-primary bg-primary hover:bg-transparent hover:text-primary transition-all duration-500">
              Add to Cart
            </Button>
            
            <div className="mt-8 pt-8 border-t border-border flex justify-between items-center font-sans text-xs uppercase tracking-widest text-muted-foreground">
              <span>Need Assistance?</span>
              <Link href="/contact" className="hover:text-primary transition-colors border-b border-foreground hover:border-primary pb-1">Contact Concierge</Link>
            </div>
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
