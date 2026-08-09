import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/shared/Navbar";
import Link from "next/link";
import React from "react";

// Mock Data
const MOCK_PRODUCT = {
  id: "prod_1",
  name: "Bridal Gold Necklace Set",
  price: 450000,
  category: "Necklace",
  description: "An exquisite 24K gold bridal necklace set featuring intricate traditional craftsmanship. This stunning piece is designed to be the centerpiece of your special day, combining heritage with timeless elegance.",
  specifications: [
    { label: "Purity", value: "24K Gold" },
    { label: "Weight", value: "3.5 Tola" },
    { label: "Design", value: "Traditional Bridal" },
  ]
};

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // In a real app, fetch the product using the slug
  const product = MOCK_PRODUCT;

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
          <Link href={`/category/${product.category.toLowerCase()}`} className="hover:text-foreground transition-colors">{product.category}</Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Product Images */}
          <div className="flex flex-col space-y-4">
            <div className="aspect-[4/5] bg-muted/30 w-full relative">
              <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/50 font-sans tracking-widest text-sm uppercase">
                Product Image Placeholder
              </div>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer" />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col pt-8">
            <span className="font-sans text-xs tracking-[0.2em] uppercase text-primary mb-4">{product.category}</span>
            <h1 className="font-heading text-4xl md:text-5xl text-foreground mb-6 leading-tight">{product.name}</h1>
            
            <div className="font-sans text-2xl tracking-wide text-foreground mb-10">
              NPR {product.price.toLocaleString()}
            </div>
            
            <p className="font-sans font-light text-muted-foreground leading-relaxed mb-12">
              {product.description}
            </p>

            <div className="mb-12">
              <h3 className="font-sans text-xs tracking-widest uppercase mb-4 opacity-60">Specifications</h3>
              <ul className="space-y-3 font-sans text-sm font-light">
                {product.specifications.map((spec, i) => (
                  <li key={i} className="flex justify-between border-b border-border pb-2">
                    <span className="text-muted-foreground">{spec.label}</span>
                    <span className="text-foreground text-right">{spec.value}</span>
                  </li>
                ))}
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
