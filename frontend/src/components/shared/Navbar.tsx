import Link from "next/link";
import Image from "next/image";

export function Navbar() {
  return (
    <nav className="border-b border-border py-6 px-8 flex justify-between items-center bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/logo.png" alt="Shree Shubha Laxmi Jewellery" width={150} height={150} className="h-16 w-auto object-contain" />
        <span className="font-heading text-xl md:text-2xl uppercase tracking-widest text-primary hidden sm:block">
          SUBHA LAXMI JEWELLERY
        </span>
      </Link>
      <div className="hidden md:flex space-x-12 font-sans text-sm tracking-widest uppercase">
        <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
        <Link href="/rates" className="hover:text-primary transition-colors">Today's Rates</Link>
        <Link href="/about" className="hover:text-primary transition-colors">Our Story</Link>
        <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
      </div>
    </nav>
  );
}
