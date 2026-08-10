"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { calculatePrice } from "@/lib/utils";

export default function CartPage() {
  const [cart, setCart] = useState<any>(null);
  const [rates, setRates] = useState<any>(null);
  const [taxes, setTaxes] = useState({ goldTax: 0, silverTax: 0 });
  const [loading, setLoading] = useState(true);
  
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ssljnextjs.onrender.com";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const [cartRes, ratesRes, settingsRes] = await Promise.all([
        fetch(`${backendUrl}/api/cart`, { headers: { "Authorization": `Bearer ${token}` } }),
        fetch(`${backendUrl}/api/rates`),
        fetch(`${backendUrl}/api/settings`)
      ]);

      if (cartRes.ok) setCart(await cartRes.json());
      if (ratesRes.ok) setRates(await ratesRes.json());
      
      if (settingsRes.ok) {
        const settingsData = await settingsRes.json();
        setTaxes({
          goldTax: settingsData.find((s: any) => s.key === "goldTax")?.value || 0,
          silverTax: settingsData.find((s: any) => s.key === "silverTax")?.value || 0,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (productId: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(`${backendUrl}/api/cart/remove/${productId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="font-sans uppercase tracking-widest text-muted-foreground text-sm">Loading...</p></div>;

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <section className="py-24 px-8 max-w-5xl mx-auto w-full flex-grow">
        <h1 className="font-heading text-5xl font-normal text-foreground mb-12">Your Selection</h1>

        {!cart || !cart.items || cart.items.length === 0 ? (
          <div className="bg-muted/50 p-16 text-center border border-border/50">
            <p className="font-sans text-sm tracking-widest uppercase text-muted-foreground mb-8">Your cart is currently empty</p>
            <Link href="/shop" className="inline-block border-b border-foreground pb-1 font-sans text-xs tracking-widest uppercase hover:text-primary transition-colors">
              Return to Collection
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {cart.items.map((item: any) => {
              const itemPrice = calculatePrice(item.product, rates, taxes);
              return (
                <div key={item._id} className="flex items-center gap-8 bg-muted/30 p-6 border border-border/20">
                  <div className="w-24 h-24 bg-muted flex-shrink-0">
                    {item.product.imageUrl && (
                      <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-heading text-xl text-foreground mb-2">{item.product.name}</h3>
                    <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans text-sm tracking-widest mb-4">
                      {itemPrice > 0 ? `NPR ${itemPrice.toLocaleString()}` : "Price on Request"}
                    </p>
                    <button 
                      onClick={() => removeItem(item.productId)}
                      className="font-sans text-[10px] uppercase tracking-widest text-destructive hover:opacity-80 transition-opacity"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}

            <div className="mt-12 flex justify-end">
              <div className="w-full md:w-1/3 bg-muted/50 p-8 border border-border/50">
                <h3 className="font-heading text-2xl mb-6">Summary</h3>
                <div className="flex justify-between font-sans text-sm tracking-widest uppercase mb-4 border-b border-border pb-4">
                  <span>Subtotal</span>
                  <span>
                    NPR {cart.items.reduce((total: number, item: any) => total + (calculatePrice(item.product, rates, taxes) * item.quantity), 0).toLocaleString()}
                  </span>
                </div>
                <Button className="w-full bg-foreground text-background uppercase tracking-widest py-6 hover:bg-foreground/90">
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
