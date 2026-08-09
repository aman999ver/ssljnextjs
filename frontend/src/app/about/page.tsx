import { Navbar } from "@/components/shared/Navbar";
import Link from "next/link";

export default function HeritagePage() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center bg-muted overflow-hidden">
        {/* Placeholder image for heritage */}
        <div className="absolute inset-0 bg-black/60 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2070&auto=format&fit=crop" 
          alt="Jewellery Craftsmanship" 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        
        <div className="relative z-20 text-center px-4 md:px-8 max-w-4xl mx-auto flex flex-col items-center w-full">
          <span className="font-sans text-xs md:text-sm tracking-[0.3em] uppercase text-primary mb-4 md:mb-6 animate-fade-in-up opacity-0">Our Heritage</span>
          <h1 className="font-heading text-4xl sm:text-5xl md:text-7xl font-normal text-white leading-tight animate-fade-in-up opacity-0 animate-delay-100">
            A Legacy of Purity
          </h1>
        </div>
      </section>

      {/* The Story Section */}
      <section className="py-24 px-8 max-w-4xl mx-auto text-center">
        <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-8">Crafting Elegance Since Inception</h2>
        <p className="font-sans font-light text-muted-foreground leading-relaxed md:text-lg mb-8">
          Located in the heart of Biratnagar, Shree Shubha Laxmi Jewellery has been synonymous with unparalleled craftsmanship, absolute purity, and trust. For generations, we have dedicated ourselves to the art of fine jewellery making, blending traditional Nepalese artistry with contemporary elegance.
        </p>
        <p className="font-sans font-light text-muted-foreground leading-relaxed md:text-lg mb-12">
          Every piece that leaves our atelier is a testament to our commitment to excellence. We source only the finest 24K and 22K gold, ensuring that our patrons receive nothing but the highest quality ornaments that can be passed down as family heirlooms.
        </p>
        <div className="w-16 h-[1px] bg-primary mx-auto"></div>
      </section>

      {/* Core Values */}
      <section className="bg-muted py-24 px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div className="text-center">
            <h3 className="font-heading text-2xl text-foreground mb-4">Purity Guaranteed</h3>
            <p className="font-sans font-light text-muted-foreground text-sm leading-relaxed">
              We stand by the authenticity of our metals. Our 24K Fine Gold and 22K Tejabi Gold are rigorously tested and hallmark certified, offering you complete peace of mind.
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-heading text-2xl text-foreground mb-4">Master Craftsmanship</h3>
            <p className="font-sans font-light text-muted-foreground text-sm leading-relaxed">
              Our artisans possess decades of experience, intricately hand-carving designs that reflect both our rich cultural heritage and modern sophistication.
            </p>
          </div>
          <div className="text-center">
            <h3 className="font-heading text-2xl text-foreground mb-4">Customer Trust</h3>
            <p className="font-sans font-light text-muted-foreground text-sm leading-relaxed">
              Trust is the foundation of our business. We ensure transparent pricing based on daily market rates, building lifelong relationships with families across Nepal.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 px-8 text-center max-w-3xl mx-auto">
        <h2 className="font-heading text-3xl text-foreground mb-6">Experience the Masterpiece</h2>
        <p className="font-sans font-light text-muted-foreground mb-10">
          We invite you to explore our curated collections and discover the perfect piece that resonates with your personal style.
        </p>
        <Link href="/shop" className="inline-block border border-foreground text-foreground bg-transparent px-10 py-4 font-sans text-xs tracking-widest uppercase hover:bg-foreground hover:text-background transition-all duration-300">
          View Collection
        </Link>
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
