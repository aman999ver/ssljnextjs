"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { calculatePrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [rates, setRates] = useState<any>(null);
  const [taxes, setTaxes] = useState({ goldTax: 0, silverTax: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
    notes: ""
  });
  
  const [paymentMethod, setPaymentMethod] = useState("WhatsApp");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ssljnextjs.onrender.com";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
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

      // Fetch user profile to prefill
      const userRes = await fetch(`${backendUrl}/api/auth/me`, { headers: { "Authorization": `Bearer ${token}` } });
      if (userRes.ok) {
        const user = await userRes.json();
        setFormData(prev => ({
          ...prev,
          fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          phone: user.phone || "",
          address: user.address || "",
        }));
      }

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return;

    if (!formData.fullName || !formData.phone || !formData.address || !formData.city) {
      alert("Please fill in all required shipping details.");
      return;
    }

    setSubmitting(true);
    
    try {
      // 1. Create the order
      const orderRes = await fetch(`${backendUrl}/api/orders/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          shippingAddress: {
            fullName: formData.fullName,
            phone: formData.phone,
            address: formData.address,
            city: formData.city
          },
          paymentMethod,
          notes: formData.notes
        })
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        setErrorMessage(`${orderData.error || "Failed to create order"}. ${orderData.details || ''}`);
        setSubmitting(false);
        return;
      }

      // 2. Handle WhatsApp Redirection via Beautiful UI
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: { addedQuantity: -100 } })); // Trigger reload
      setOrderSuccessData(orderData);
      
    } catch (error) {
      console.error(error);
      setErrorMessage("An unexpected error occurred while placing your order.");
      setSubmitting(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><p className="font-sans uppercase tracking-widest text-muted-foreground text-sm">Loading Checkout...</p></div>;

  if (orderSuccessData) {
    const waNumber = "9779807313993";
    const message = `Hello! I just placed an order on your website.\nOrder Number: ${orderSuccessData.orderNumber}\nTotal Amount: NPR ${orderSuccessData.totalAmount}\nName: ${formData.fullName}\nCity: ${formData.city}`;
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

    return (
      <main className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center px-8 py-24">
          <div className="max-w-xl w-full text-center p-16 border border-border bg-card shadow-2xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="w-24 h-24 bg-primary/10 text-primary flex items-center justify-center rounded-full mx-auto mb-8 animate-pulse relative z-10">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="font-heading text-5xl mb-4 relative z-10">Order Received</h1>
            <p className="font-sans text-sm text-muted-foreground mb-10 leading-relaxed relative z-10">
              Your order <span className="font-bold text-foreground">{orderSuccessData.orderNumber}</span> has been securely saved. 
              To finalize payment and arrange delivery, please confirm your order via WhatsApp.
            </p>
            <Button onClick={() => { window.open(waUrl, "_blank"); router.push("/profile"); }} className="w-full bg-[#25D366] text-white hover:bg-[#128C7E] py-8 text-sm uppercase tracking-widest font-bold shadow-lg hover:shadow-xl transition-all relative z-10">
              Confirm on WhatsApp
            </Button>
            <button onClick={() => router.push("/profile")} className="mt-6 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors relative z-10">
              View Order History
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <main className="flex flex-col min-h-screen bg-background">
        <Navbar />
        <div className="flex-grow flex items-center justify-center text-center px-8">
          <div>
            <h1 className="font-heading text-4xl mb-4">Your Cart is Empty</h1>
            <Button onClick={() => router.push("/shop")} variant="outline" className="uppercase tracking-widest">Return to Shop</Button>
          </div>
        </div>
      </main>
    );
  }

  const subtotal = cart.items.reduce((total: number, item: any) => total + (calculatePrice(item.product, rates, taxes) * item.quantity), 0);

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <section className="py-24 px-8 max-w-7xl mx-auto w-full flex-grow">
        <h1 className="font-heading text-5xl font-normal text-foreground mb-12">Checkout</h1>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Shipping & Payment Form */}
          <div className="w-full lg:w-2/3">
            {errorMessage && (
              <div className="mb-8 p-4 border border-red-500/50 bg-red-500/10 text-red-500 text-sm font-sans flex items-start gap-3">
                <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                <div>
                  <p className="font-bold mb-1">Error processing order</p>
                  <p className="opacity-90">{errorMessage}</p>
                </div>
              </div>
            )}
            <form onSubmit={handlePlaceOrder}>
              <h2 className="font-heading text-2xl mb-8 border-b border-border pb-4">1. Shipping Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-muted-foreground mb-2">Full Name *</label>
                  <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} required className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors font-sans text-sm" />
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-muted-foreground mb-2">Phone Number *</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors font-sans text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-sans text-xs uppercase tracking-widest text-muted-foreground mb-2">Detailed Address *</label>
                  <input type="text" name="address" value={formData.address} onChange={handleInputChange} required placeholder="House No, Street, Landmark" className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors font-sans text-sm" />
                </div>
                <div>
                  <label className="block font-sans text-xs uppercase tracking-widest text-muted-foreground mb-2">City *</label>
                  <input type="text" name="city" value={formData.city} onChange={handleInputChange} required className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors font-sans text-sm" />
                </div>
                <div className="md:col-span-2">
                  <label className="block font-sans text-xs uppercase tracking-widest text-muted-foreground mb-2">Order Notes (Optional)</label>
                  <textarea 
                    name="notes" 
                    value={formData.notes} 
                    onChange={handleInputChange} 
                    className="w-full min-h-[100px] border border-border bg-background p-3 text-sm focus:outline-none focus:ring-1 focus:ring-foreground"
                  />
                </div>
              </div>

              <h2 className="font-heading text-2xl mb-8 border-b border-border pb-4">2. Order Confirmation</h2>
              <div className="space-y-4 mb-12">
                <label className="block p-6 border border-primary bg-primary/5 cursor-pointer transition-colors">
                  <div className="flex items-center gap-4">
                    <input type="radio" name="paymentMethod" value="WhatsApp" checked={true} readOnly className="w-4 h-4 text-primary" />
                    <div>
                      <p className="font-heading text-xl">Order via WhatsApp</p>
                      <p className="font-sans text-xs text-muted-foreground mt-1 tracking-wider uppercase">You will be redirected to WhatsApp to confirm your order and arrange payment.</p>
                    </div>
                  </div>
                </label>
              </div>

              <Button type="submit" disabled={submitting} className="w-full bg-foreground text-background uppercase tracking-widest py-6 hover:bg-foreground/90">
                {submitting ? <Loader2 className="animate-spin mr-2" /> : null}
                {paymentMethod === 'Bank Transfer' ? "Place Order" : "Proceed to Payment"}
              </Button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-muted/30 p-8 border border-border/50 sticky top-32">
              <h3 className="font-heading text-2xl mb-8">Order Summary</h3>
              
              <div className="space-y-6 mb-8 border-b border-border pb-8">
                {cart.items.map((item: any) => {
                  const itemPrice = calculatePrice(item.product, rates, taxes);
                  return (
                    <div key={item._id} className="flex justify-between items-start gap-4">
                      <div>
                        <p className="font-heading text-lg">{item.product.name}</p>
                        <p className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <p className="font-sans text-sm tracking-widest text-right whitespace-nowrap">
                        {itemPrice > 0 ? `NPR ${(itemPrice * item.quantity).toLocaleString()}` : "TBD"}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4 font-sans text-xs uppercase tracking-widest mb-8 border-b border-border pb-8">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>NPR {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Calculated later</span>
                </div>
              </div>

              <div className="flex justify-between font-heading text-2xl mb-6">
                <span>Total</span>
                <span>NPR {subtotal.toLocaleString()}</span>
              </div>
              
              {paymentMethod === 'COD' && (
                <div className="bg-primary/10 p-4 border border-primary/20 mt-6 text-center">
                  <p className="font-sans text-xs uppercase tracking-widest mb-1">To Pay Now (Advance)</p>
                  <p className="font-heading text-xl text-primary">NPR 500</p>
                  <p className="font-sans text-[10px] uppercase tracking-wider text-muted-foreground mt-2">Remaining NPR {(subtotal - 500).toLocaleString()} on delivery</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
