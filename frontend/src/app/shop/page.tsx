import { Navbar } from "@/components/shared/Navbar";
import { ProductCard } from "@/components/shared/ProductCard";

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

export default async function ShopPage() {
  const products = await getProducts();
  const rates = await getRates();

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
        <div className="flex justify-between items-center mb-12">
          <span className="font-sans text-sm tracking-widest text-muted-foreground uppercase">Showing {products.length} Results</span>
          {/* Mock Filter */}
          <select className="bg-transparent border-b border-border py-2 px-4 font-sans text-xs tracking-widest uppercase outline-none focus:border-primary">
            <option>Sort by: Featured</option>
            <option>Sort by: Price (Low to High)</option>
            <option>Sort by: Price (High to Low)</option>
          </select>
        </div>

        {products.length === 0 ? (
          <div className="text-center text-muted-foreground font-sans text-sm tracking-widest uppercase py-12">
            No products found in the database.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {products.map((product: any) => (
              <ProductCard key={product.slug} {...product} rates={rates} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
