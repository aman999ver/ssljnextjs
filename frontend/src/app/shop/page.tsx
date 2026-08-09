import { Navbar } from "@/components/shared/Navbar";
import { ProductCard } from "@/components/shared/ProductCard";
import dbConnect from "@/lib/mongoose";
import { Product } from "@/models/Product";

// Fetch DB Data
async function getProducts() {
  try {
    await dbConnect();
    const rawProducts = await Product.find({}).sort({ _id: -1 }).lean();
    
    // Defensive mapping to handle legacy schema fields
    return rawProducts.map((p: any) => ({
      slug: p.slug || p._id.toString(),
      name: p.name || p.productName || p.title || "Unnamed Product",
      price: p.price || p.productPrice || null,
      category: p.category || p.categoryName || null,
      imageUrl: p.image || (p.images && p.images.length > 0 ? p.images[0] : null),
    }));
  } catch (error) {
    console.error("Failed to fetch from DB:", error);
    return [];
  }
}

export default async function ShopPage() {
  const products = await getProducts();

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
            {products.map((product) => (
              <ProductCard key={product.slug} {...product} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
