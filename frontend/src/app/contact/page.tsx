"use client";

import { useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ssljnextjs.onrender.com";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("");
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`${backendUrl}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setStatus("Thank you! Your message has been sent successfully. We will get back to you shortly.");
        setFormData({ name: "", email: "", phone: "", message: "" });
      } else {
        setError(data.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      setError("A network error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="bg-muted py-24 text-center px-4">
        <h1 className="font-heading text-5xl md:text-6xl text-foreground mb-4">Contact Us</h1>
        <p className="font-sans text-sm tracking-widest uppercase text-muted-foreground">
          We are here to assist you
        </p>
      </section>

      {/* Content */}
      <section className="py-24 px-8 max-w-6xl mx-auto w-full flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          
          {/* Contact Details */}
          <div className="flex flex-col justify-center space-y-12">
            <div>
              <h3 className="font-sans text-xs tracking-widest uppercase text-primary mb-4">Visit Our Store</h3>
              <p className="font-heading text-2xl text-foreground mb-2">Shree Shubha Laxmi Jewellery</p>
              <p className="font-sans font-light text-muted-foreground leading-relaxed">
                Main Road, Biratnagar<br />
                Koshi Province, Nepal
              </p>
            </div>
            
            <div>
              <h3 className="font-sans text-xs tracking-widest uppercase text-primary mb-4">Direct Contact</h3>
              <p className="font-sans text-lg text-foreground mb-2">
                <a href="tel:+9779807313993" className="hover:text-primary transition-colors">+977 9807313993</a>
              </p>
              <p className="font-sans font-light text-muted-foreground">
                Available Sun-Fri, 10:00 AM - 7:00 PM
              </p>
            </div>

            <div>
              <h3 className="font-sans text-xs tracking-widest uppercase text-primary mb-4">Email Concierge</h3>
              <p className="font-sans text-lg text-foreground mb-2">
                <a href="mailto:contact@subhalaxmijewellery.com" className="hover:text-primary transition-colors">
                  contact@subhalaxmijewellery.com
                </a>
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-muted/30 border border-border/50 p-8 md:p-12">
            <h2 className="font-heading text-3xl text-foreground mb-8">Send an Enquiry</h2>
            
            {status && <div className="mb-8 p-4 bg-primary/10 text-primary font-sans text-xs uppercase tracking-widest text-center">{status}</div>}
            {error && <div className="mb-8 p-4 bg-destructive/10 text-destructive font-sans text-xs uppercase tracking-widest text-center">{error}</div>}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Full Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors font-sans text-sm" 
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors font-sans text-sm" 
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Phone (Optional)</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors font-sans text-sm" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Message</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors font-sans text-sm min-h-[120px]" 
                  required
                />
              </div>
              <Button type="submit" disabled={isSubmitting} className="w-full bg-foreground text-background hover:bg-foreground/90 uppercase tracking-widest py-6 mt-4">
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
          
        </div>
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
