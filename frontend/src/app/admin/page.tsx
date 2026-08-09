"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";

export default function AdminPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerUrl, setBannerUrl] = useState("");
  const [tab, setTab] = useState("customers");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ssljnextjs.onrender.com";

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || user.role !== 'admin') {
      window.location.href = "/login";
      return;
    }

    try {
      const res = await fetch(`${backendUrl}/api/admin/customers`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setCustomers(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch(`${backendUrl}/api/admin/banners`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ imageUrl: bannerUrl })
      });
      if (res.ok) {
        alert("Banner updated successfully!");
        setBannerUrl("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center font-sans tracking-widest text-sm uppercase">Loading Admin...</div>;

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />

      <section className="py-24 px-8 max-w-7xl mx-auto w-full flex-grow">
        <h1 className="font-heading text-5xl font-normal text-foreground mb-12">Admin Dashboard</h1>

        <div className="flex gap-8 border-b border-border mb-12">
          <button 
            onClick={() => setTab("customers")}
            className={`pb-4 font-sans text-sm tracking-widest uppercase transition-colors ${tab === "customers" ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Customers
          </button>
          <button 
            onClick={() => setTab("banners")}
            className={`pb-4 font-sans text-sm tracking-widest uppercase transition-colors ${tab === "banners" ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            Banners
          </button>
        </div>

        {tab === "customers" && (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-sm">
              <thead className="text-xs uppercase tracking-widest text-muted-foreground border-b border-border">
                <tr>
                  <th className="px-4 py-6 font-normal">Name</th>
                  <th className="px-4 py-6 font-normal">Email</th>
                  <th className="px-4 py-6 font-normal">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c: any) => (
                  <tr key={c._id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-6 text-foreground">{c.name}</td>
                    <td className="px-4 py-6 text-muted-foreground">{c.email}</td>
                    <td className="px-4 py-6 text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "banners" && (
          <div className="max-w-xl bg-muted/50 p-10 border border-border/50">
            <h2 className="font-heading text-3xl mb-8">Update Homepage Banner</h2>
            <form onSubmit={handleBannerSubmit} className="space-y-6">
              <div>
                <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Banner Image URL</label>
                <input 
                  type="url" 
                  value={bannerUrl}
                  onChange={(e) => setBannerUrl(e.target.value)}
                  className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors font-sans text-sm" 
                  placeholder="https://example.com/banner.jpg" 
                  required
                />
              </div>
              <Button type="submit" className="bg-foreground text-background hover:bg-foreground/90 uppercase tracking-widest py-6 mt-4">
                Update Banner
              </Button>
            </form>
          </div>
        )}
      </section>
    </main>
  );
}
