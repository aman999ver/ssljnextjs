"use client";

import { useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ssljnextjs.onrender.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Authentication failed");
      } else {
        if (data.user.role !== 'admin') {
          setError("Access denied. Admin role required.");
          return;
        }

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/admin";
      }
    } catch (err) {
      setError("Network error. Please try again later.");
    }
  };

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <section className="py-24 px-8 max-w-md mx-auto w-full flex-grow flex items-center">
        <div className="bg-muted/50 p-10 w-full border border-border/50">
          <span className="font-sans text-sm tracking-[0.3em] uppercase text-primary mb-6 block text-center">
            Admin Portal
          </span>
          <h1 className="font-heading text-4xl font-normal text-foreground mb-8 text-center">
            Staff Login
          </h1>
          
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm font-sans tracking-widest p-4 mb-6 uppercase text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Admin Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors font-sans text-sm" 
                placeholder="admin@subhalaxmi.com" 
                required
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors font-sans text-sm" 
                placeholder="••••••••" 
                required
              />
            </div>
            <Button type="submit" className="w-full bg-foreground text-background hover:bg-foreground/90 uppercase tracking-widest py-6 mt-4">
              Access Dashboard
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}
