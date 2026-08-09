"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { Trash2, Edit } from "lucide-react";

export default function AdminPage() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerUrl, setBannerUrl] = useState("");
  const [tab, setTab] = useState("products");

  // Product Form State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: "", description: "", category: "", metalType: "22K",
    weight: 0, lossPercentage: 0, makingCharge: 0, price: 0,
    imageUrl: "", isActive: true, featured: false
  });

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ssljnextjs.onrender.com";

  useEffect(() => {
    checkAdminAndFetch();
  }, []);

  const checkAdminAndFetch = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || user.role !== 'admin') {
      window.location.href = "/admin/login";
      return;
    }

    try {
      await Promise.all([
        fetchCustomers(token),
        fetchProducts(token)
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async (token: string) => {
    const res = await fetch(`${backendUrl}/api/admin/customers`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) setCustomers(await res.json());
  };

  const fetchProducts = async (token: string) => {
    const res = await fetch(`${backendUrl}/api/admin/products`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (res.ok) setProducts(await res.json());
  };

  const handleBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${backendUrl}/api/admin/banners`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
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

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const payload = {
      ...productForm,
      images: productForm.imageUrl ? [productForm.imageUrl] : []
    };

    try {
      const url = editingId ? `${backendUrl}/api/admin/products/${editingId}` : `${backendUrl}/api/admin/products`;
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(editingId ? "Product updated!" : "Product created!");
        setShowProductModal(false);
        setEditingId(null);
        fetchProducts(token!);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${backendUrl}/api/admin/products/${id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) fetchProducts(token!);
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (p: any) => {
    setEditingId(p._id);
    setProductForm({
      name: p.name || "",
      description: p.description || "",
      category: p.category || "",
      metalType: p.metalType || "22K",
      weight: p.weight || 0,
      lossPercentage: p.lossPercentage || 0,
      makingCharge: p.makingCharge || 0,
      price: p.price || 0,
      imageUrl: p.images && p.images.length > 0 ? p.images[0] : "",
      isActive: p.isActive ?? true,
      featured: p.featured ?? false
    });
    setShowProductModal(true);
  };

  const openNewModal = () => {
    setEditingId(null);
    setProductForm({
      name: "", description: "", category: "", metalType: "22K",
      weight: 0, lossPercentage: 0, makingCharge: 0, price: 0,
      imageUrl: "", isActive: true, featured: false
    });
    setShowProductModal(true);
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center font-sans tracking-widest text-sm uppercase">Loading Admin...</div>;

  return (
    <main className="flex flex-col min-h-screen bg-background relative">
      <Navbar />

      <section className="py-24 px-8 max-w-7xl mx-auto w-full flex-grow">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-heading text-5xl font-normal text-foreground">Admin Dashboard</h1>
          <Button 
            onClick={() => { localStorage.removeItem("token"); window.location.href = "/admin/login"; }}
            variant="outline" className="font-sans uppercase tracking-widest text-xs"
          >
            Logout
          </Button>
        </div>

        <div className="flex gap-8 border-b border-border mb-12">
          <button onClick={() => setTab("products")} className={`pb-4 font-sans text-sm tracking-widest uppercase transition-colors ${tab === "products" ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground hover:text-foreground"}`}>Products</button>
          <button onClick={() => setTab("customers")} className={`pb-4 font-sans text-sm tracking-widest uppercase transition-colors ${tab === "customers" ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground hover:text-foreground"}`}>Customers</button>
          <button onClick={() => setTab("banners")} className={`pb-4 font-sans text-sm tracking-widest uppercase transition-colors ${tab === "banners" ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground hover:text-foreground"}`}>Banners</button>
        </div>

        {/* PRODUCTS TAB */}
        {tab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-sans text-xl uppercase tracking-widest text-foreground">Product Catalog</h2>
              <Button onClick={openNewModal} className="bg-foreground text-background uppercase tracking-widest text-xs py-5 px-6">
                + Add Product
              </Button>
            </div>
            <div className="overflow-x-auto bg-muted/10 border border-border/50">
              <table className="w-full text-left font-sans text-sm">
                <thead className="text-xs uppercase tracking-widest text-muted-foreground border-b border-border bg-muted/30">
                  <tr>
                    <th className="px-6 py-4 font-normal">Image</th>
                    <th className="px-6 py-4 font-normal">Name</th>
                    <th className="px-6 py-4 font-normal">Category</th>
                    <th className="px-6 py-4 font-normal">Price</th>
                    <th className="px-6 py-4 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p: any) => (
                    <tr key={p._id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        {p.images && p.images[0] ? (
                          <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover border border-border/50" />
                        ) : (
                          <div className="w-12 h-12 bg-muted flex items-center justify-center text-[10px] uppercase text-muted-foreground">No Img</div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-foreground">{p.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{p.category}</td>
                      <td className="px-6 py-4 text-foreground">NPR {p.price?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right space-x-4">
                        <button onClick={() => openEditModal(p)} className="text-muted-foreground hover:text-primary transition-colors inline-block"><Edit size={16}/></button>
                        <button onClick={() => deleteProduct(p._id)} className="text-muted-foreground hover:text-destructive transition-colors inline-block"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-muted-foreground uppercase tracking-widest text-xs">No products found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {tab === "customers" && (
          <div className="overflow-x-auto bg-muted/10 border border-border/50">
            <table className="w-full text-left font-sans text-sm">
              <thead className="text-xs uppercase tracking-widest text-muted-foreground border-b border-border bg-muted/30">
                <tr>
                  <th className="px-6 py-4 font-normal">Name</th>
                  <th className="px-6 py-4 font-normal">Email</th>
                  <th className="px-6 py-4 font-normal">Phone</th>
                  <th className="px-6 py-4 font-normal">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((c: any) => (
                  <tr key={c._id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 text-foreground">{c.firstName} {c.lastName}</td>
                    <td className="px-6 py-4 text-muted-foreground">{c.email}</td>
                    <td className="px-6 py-4 text-muted-foreground">{c.phone}</td>
                    <td className="px-6 py-4 text-muted-foreground">{new Date(c.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* BANNERS TAB */}
        {tab === "banners" && (
          <div className="max-w-xl bg-muted/30 p-10 border border-border/50">
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

      {/* PRODUCT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 bg-background/90 flex justify-center items-center z-50 p-4 overflow-y-auto">
          <div className="bg-background border border-border/50 max-w-2xl w-full p-8 shadow-2xl relative my-8">
            <button 
              onClick={() => setShowProductModal(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground uppercase text-xs tracking-widest"
            >
              Close
            </button>
            <h2 className="font-heading text-3xl mb-8">{editingId ? "Edit Product" : "Add Product"}</h2>
            
            <form onSubmit={handleProductSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Product Name</label>
                  <input type="text" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full bg-muted/20 border-b border-border py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Category</label>
                  <input type="text" required value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full bg-muted/20 border-b border-border py-2 text-sm outline-none" placeholder="e.g. Necklace, Ring" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Price (NPR)</label>
                  <input type="number" required value={productForm.price || ''} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} className="w-full bg-muted/20 border-b border-border py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Metal Type</label>
                  <input type="text" value={productForm.metalType} onChange={e => setProductForm({...productForm, metalType: e.target.value})} className="w-full bg-muted/20 border-b border-border py-2 text-sm outline-none" placeholder="22K, 24K, Silver" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Weight (grams)</label>
                  <input type="number" step="0.01" value={productForm.weight || ''} onChange={e => setProductForm({...productForm, weight: Number(e.target.value)})} className="w-full bg-muted/20 border-b border-border py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Making Charge (NPR)</label>
                  <input type="number" value={productForm.makingCharge || ''} onChange={e => setProductForm({...productForm, makingCharge: Number(e.target.value)})} className="w-full bg-muted/20 border-b border-border py-2 text-sm outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Image URL</label>
                  <input type="url" required value={productForm.imageUrl} onChange={e => setProductForm({...productForm, imageUrl: e.target.value})} className="w-full bg-muted/20 border-b border-border py-2 text-sm outline-none" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Description</label>
                  <textarea rows={3} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full bg-muted/20 border-b border-border py-2 text-sm outline-none resize-none"></textarea>
                </div>
              </div>

              <div className="flex gap-6 mt-8 border-t border-border/50 pt-8">
                <label className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-widest">
                  <input type="checkbox" checked={productForm.isActive} onChange={e => setProductForm({...productForm, isActive: e.target.checked})} className="accent-primary" /> Active
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs uppercase tracking-widest">
                  <input type="checkbox" checked={productForm.featured} onChange={e => setProductForm({...productForm, featured: e.target.checked})} className="accent-primary" /> Featured
                </label>
              </div>

              <Button type="submit" className="w-full bg-foreground text-background uppercase tracking-widest py-6 mt-4 hover:bg-foreground/90">
                {editingId ? "Update Product" : "Save Product"}
              </Button>
            </form>
          </div>
        </div>
      )}

    </main>
  );
}
