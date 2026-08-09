import Link from "next/link";
import Image from "next/image";
import { User, ShoppingBag } from "lucide-react";

export function Navbar() {
  return (
    <nav className="border-b border-border py-6 px-8 flex justify-between items-center bg-background/80 backdrop-blur-md sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-4">
        <Image src="/logo.png" alt="Shree Shubha Laxmi Jewellery" width={150} height={150} className="h-16 w-auto object-contain" />
        <span className="font-heading text-xl md:text-2xl uppercase tracking-widest text-primary hidden sm:block">
          SUBHA LAXMI JEWELLERY
        </span>
      </Link>
      <div className="hidden md:flex items-center space-x-12">
        <div className="flex space-x-12 font-sans text-sm tracking-widest uppercase">
          <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <Link href="/rates" className="font-sans text-xs tracking-widest uppercase hover:text-primary transition-colors">Rates</Link>
          <Link href="/about" className="font-sans text-xs tracking-widest uppercase hover:text-primary transition-colors">Heritage</Link>
          <Link href="/contact" className="font-sans text-xs tracking-widest uppercase hover:text-primary transition-colors">Contact</Link>
        </div>

        {/* Action Icons */}
        <div className="flex items-center space-x-6">
          <Link href="/admin" className="text-foreground hover:text-primary transition-colors" title="Account / Admin">
            <User className="w-5 h-5 font-light" />
          </Link>
          <Link href="/cart" className="text-foreground hover:text-primary transition-colors" title="Shopping Cart">
            <ShoppingBag className="w-5 h-5 font-light" />
          </Link>
        </div>
      </div>
    </nav>
  );
}
