"use client";

import Link from "next/link";
import Image from "next/image";
import { User, ShoppingBag, Menu, X, LogOut, Settings } from "lucide-react";
import { useEffect, useState } from "react";

export function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    
    const fetchCartCount = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ssljnextjs.onrender.com";
      try {
        const res = await fetch(`${backendUrl}/api/cart`, { headers: { "Authorization": `Bearer ${token}` } });
        if (res.ok) {
          const data = await res.json();
          if (data && data.items) {
            setCartCount(data.items.reduce((acc: number, item: any) => acc + item.quantity, 0));
          }
        }
      } catch (error) {
        console.error("Failed to fetch cart count:", error);
      }
    };

    fetchCartCount();

    const handleCartUpdate = (e: any) => {
      if (e.detail && typeof e.detail.addedQuantity === 'number') {
        setCartCount(prev => prev + e.detail.addedQuantity);
      } else {
        fetchCartCount();
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setIsProfileMenuOpen(false);
    window.location.href = "/";
  };

  return (
    <nav className="border-b border-border py-3 px-4 md:py-4 md:px-8 flex justify-between items-center bg-background/95 backdrop-blur-md sticky top-0 z-50">
      <Link href="/" className="flex items-center gap-2 md:gap-4 z-50">
        <Image src="/logo.png" alt="Shree Shubha Laxmi Jewellery" width={150} height={150} className="h-10 md:h-12 w-auto object-contain" />
        <span className="font-heading text-sm md:text-xl lg:text-2xl uppercase tracking-widest text-primary block">
          SUBHA LAXMI JEWELLERY
        </span>
      </Link>

      <div className="flex items-center space-x-6 md:space-x-12 z-50">
        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-8 lg:space-x-12 font-sans text-xs lg:text-sm tracking-widest uppercase">
          <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <Link href="/rates" className="hover:text-primary transition-colors">Rates</Link>
          <Link href="/about" className="hover:text-primary transition-colors">Heritage</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
        </div>

        {/* Action Icons (Always Visible) */}
        <div className="flex items-center space-x-4 md:space-x-6">
          {isLoggedIn ? (
            <div className="relative">
              <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="text-foreground hover:text-primary transition-colors focus:outline-none flex items-center" title="Account Menu">
                <User className="w-5 h-5 font-light" />
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-6 w-48 bg-background border border-border shadow-xl flex flex-col z-50 animate-fade-in-down divide-y divide-border/50">
                  <Link href="/profile" onClick={() => setIsProfileMenuOpen(false)} className="px-4 py-3 font-sans text-xs tracking-widest uppercase hover:bg-muted transition-colors flex items-center gap-3">
                    <User className="w-4 h-4 text-primary" /> Profile
                  </Link>
                  <Link href="/profile?tab=security" onClick={() => setIsProfileMenuOpen(false)} className="px-4 py-3 font-sans text-xs tracking-widest uppercase hover:bg-muted transition-colors flex items-center gap-3">
                    <Settings className="w-4 h-4 text-primary" /> Password
                  </Link>
                  <button onClick={handleLogout} className="px-4 py-3 font-sans text-xs tracking-widest uppercase hover:bg-destructive/10 transition-colors text-left flex items-center gap-3 text-destructive w-full">
                    <LogOut className="w-4 h-4" /> Exit
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="text-foreground hover:text-primary transition-colors" title="Account / Login">
              <User className="w-5 h-5 font-light" />
            </Link>
          )}

          <Link href="/cart" className="relative text-foreground hover:text-primary transition-colors" title="Shopping Cart">
            <ShoppingBag className="w-5 h-5 font-light" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-sans">
                {cartCount}
              </span>
            )}
          </Link>
          
          {/* Mobile Hamburger Toggle */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-foreground focus:outline-none md:hidden">
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="absolute top-[100%] left-0 w-full bg-background border-b border-border shadow-2xl flex flex-col md:hidden py-8 px-6 space-y-8 animate-fade-in-down z-40 text-center">
          <Link href="/shop" onClick={() => setIsMenuOpen(false)} className="font-sans text-sm tracking-widest uppercase hover:text-primary transition-colors block">Shop</Link>
          <Link href="/rates" onClick={() => setIsMenuOpen(false)} className="font-sans text-sm tracking-widest uppercase hover:text-primary transition-colors block">Rates</Link>
          <Link href="/about" onClick={() => setIsMenuOpen(false)} className="font-sans text-sm tracking-widest uppercase hover:text-primary transition-colors block">Heritage</Link>
          <Link href="/contact" onClick={() => setIsMenuOpen(false)} className="font-sans text-sm tracking-widest uppercase hover:text-primary transition-colors block">Contact</Link>
        </div>
      )}
    </nav>
  );
}
