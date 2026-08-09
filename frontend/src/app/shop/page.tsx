import { Navbar } from "@/components/shared/Navbar";
import { ProductCard } from "@/components/shared/ProductCard";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Shop Collection",
  description: "Browse our exquisite collection of necklaces, rings, earrings, and bangles crafted with purity and precision.",
};

// Fetch Data from Render API
async function getProducts() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ssljnextjs.onrender.com";
  try {
    const res = await fetch(`${backendUrl}/api/products`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch products from API:", error);
    return [];
  }
}

// Fetch Live Rates
async function getRates() {
  const apiUrl = process.env.NEXT_PUBLIC_RATES_API_URL || "https://swarna-mobile.onrender.com/api/rates/regional?town=Biratnagar";
  try {
    const res = await fetch(apiUrl, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

// Fetch Settings
async function getSettings() {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ssljnextjs.onrender.com";
  try {
    const res = await fetch(`${backendUrl}/api/settings`, { cache: 'no-store' });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    return [];
  }
}

import { Search } from "lucide-react";

export default async function ShopPage({ searchParams }: { searchParams: Promise<{ q?: string, page?: string }> }) {
  const resolvedParams = await searchParams;
  const q = (resolvedParams.q || "").toLowerCase();
  const page = parseInt(resolvedParams.page || "1", 10);
  const itemsPerPage = 9;

  let allProducts = await getProducts();
  
  if (q) {
    allProducts = allProducts.filter((p: any) => 
      (p.name && p.name.toLowerCase().includes(q)) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const products = allProducts.slice(startIndex, startIndex + itemsPerPage);

  const rates = await getRates();
  const settings = await getSettings();
  
  const taxes = {
    goldTax: settings.find((s: any) => s.key === "goldTax")?.value || 0,
    silverTax: settings.find((s: any) => s.key === "silverTax")?.value || 0,
  };

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-muted py-24 text-center px-4">
        <h1 className="font-heading text-5xl md:text-6xl text-foreground mb-4">Our Collection</h1>
        <p className="font-sans text-sm tracking-widest uppercase text-muted-foreground">
          Discover timeless elegance and purity
        </p>
      </section>

      {/* Shop Grid */}
      <section className="py-24 px-8 max-w-7xl mx-auto w-full flex-grow">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <form action="/shop" method="GET" className="relative w-full md:w-1/3">
            <input 
              type="text" 
              name="q" 
              defaultValue={q} 
              placeholder="Search products, categories..." 
              className="w-full bg-transparent border-b border-border py-2 pl-2 pr-10 outline-none focus:border-primary transition-colors font-sans text-sm tracking-widest"
            />
            <button type="submit" className="absolute right-0 top-2 text-muted-foreground hover:text-primary transition-colors">
              <Search className="w-5 h-5" />
            </button>
          </form>

          <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
            <span className="font-sans text-xs tracking-widest text-muted-foreground uppercase">
              Showing {products.length > 0 ? startIndex + 1 : 0}-{Math.min(startIndex + itemsPerPage, allProducts.length)} of {allProducts.length} Results
            </span>
            <select className="bg-transparent border-b border-border py-2 px-2 font-sans text-xs tracking-widest uppercase outline-none focus:border-primary cursor-pointer">
              <option>Sort by: Featured</option>
              <option>Sort by: Price (Low to High)</option>
              <option>Sort by: Price (High to Low)</option>
            </select>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="text-center text-muted-foreground font-sans text-sm tracking-widest uppercase py-12">
            {q ? `No products found for "${q}"` : "No products found in the database."}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {products.map((product: any) => (
              <ProductCard key={product.slug} {...product} rates={rates} taxes={taxes} />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-8 mt-16 font-sans text-xs tracking-widest uppercase">
            {page > 1 ? (
              <a href={`/shop?page=${page - 1}${q ? `&q=${encodeURIComponent(q)}` : ''}`} className="hover:text-primary transition-colors py-2 px-4 border border-border hover:border-primary">
                Previous
              </a>
            ) : (
              <span className="text-muted-foreground/50 py-2 px-4 border border-border/50 cursor-not-allowed">Previous</span>
            )}
            
            <span>Page {page} of {totalPages}</span>

            {page < totalPages ? (
              <a href={`/shop?page=${page + 1}${q ? `&q=${encodeURIComponent(q)}` : ''}`} className="hover:text-primary transition-colors py-2 px-4 border border-border hover:border-primary">
                Next
              </a>
            ) : (
              <span className="text-muted-foreground/50 py-2 px-4 border border-border/50 cursor-not-allowed">Next</span>
            )}
          </div>
        )}
      </section>
    </main>
  );
}
