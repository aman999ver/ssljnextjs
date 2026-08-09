import { Navbar } from "@/components/shared/Navbar";
import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <section className="py-24 px-8 max-w-4xl mx-auto w-full flex-grow text-center">
        <span className="font-sans text-sm tracking-[0.3em] uppercase text-primary mb-6 block">Our Story</span>
        <h1 className="font-heading text-5xl md:text-7xl font-normal text-foreground mb-12 leading-tight">
          A Legacy of Purity and Trust in Biratnagar
        </h1>

        <div className="prose prose-lg mx-auto text-muted-foreground font-sans font-light">
          <p className="mb-8">
            Founded with a vision to offer the finest craftsmanship and the purest metals, 
            <strong> Shree Shubha Laxmi Jewellery</strong> has been a cornerstone of trust for families in Biratnagar for generations.
          </p>
          <p className="mb-8">
            Our master artisans specialize in creating timeless pieces that honor Nepalese heritage while 
            embracing modern elegance. Whether you are looking for a bridal set that will be passed down 
            for generations, or an everyday piece that speaks to your personal style, we ensure 
            uncompromising quality.
          </p>
          <p>
            We pride ourselves on full transparency, using certified 24K and 22K gold, 
            and offering real-time pricing based on regional market rates.
          </p>
        </div>
      </section>
    </main>
  );
}
