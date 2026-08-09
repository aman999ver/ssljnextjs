import { Navbar } from "@/components/shared/Navbar";
import { ProductCard } from "@/components/shared/ProductCard";

const MOCK_CATEGORY_PRODUCTS = [
  { slug: "bridal-gold-necklace", name: "Bridal Gold Necklace Set", price: 450000, category: "Necklace" },
  { slug: "ruby-emerald-choker", name: "Ruby Emerald Choker", price: 275000, category: "Necklace" },
];

export default function CategoryPage({ params }: { params: { slug: string } }) {
  // Mock capitalize slug
  const categoryName = params.slug.replace("-", " ");

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-muted py-24 text-center px-4">
        <h1 className="font-heading text-5xl md:text-6xl text-foreground mb-4 capitalize">{categoryName}</h1>
        <p className="font-sans text-sm tracking-widest uppercase text-muted-foreground">
          Explore our exclusive {categoryName} collection
        </p>
      </section>

      {/* Category Grid */}
      <section className="py-24 px-8 max-w-7xl mx-auto w-full flex-grow">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
          {MOCK_CATEGORY_PRODUCTS.map((product) => (
            <ProductCard key={product.slug} {...product} />
          ))}
        </div>
      </section>
    </main>
  );
}
