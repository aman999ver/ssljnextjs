"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Upload, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminPage() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("products");

  // Pagination States
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Form States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: "", description: "", category: "", metalType: "22K",
    weight: 0, lossType: "none", lossValue: 0, makingCharge: 0,
    imageUrl: "", isActive: true, featured: false
  });
  
  const [categoryForm, setCategoryForm] = useState({
    name: "", description: "", icon: "", image: "", color: "", gradient: ""
  });

  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });
  const [taxSettings, setTaxSettings] = useState({ goldTax: 0, silverTax: 0 });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const categoryFileInputRef = useRef<HTMLInputElement>(null);
  const bannerFileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ssljnextjs.onrender.com";

  useEffect(() => {
    checkAdminAndFetch();
  }, [tab, page]); // Re-fetch on tab or page change

  const checkAdminAndFetch = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || user.role !== 'admin') {
      window.location.href = "/admin/login";
      return;
    }

    try {
      if (tab === "products") await fetchProducts(token);
      else if (tab === "customers") await fetchCustomers(token);
      else if (tab === "categories") await fetchCategories(token);
      else if (tab === "orders") await fetchOrders(token);
      else if (tab === "settings") await fetchSettings(token);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async (token: string) => {
    const res = await fetch(`${backendUrl}/api/admin/customers?page=${page}`, { headers: { "Authorization": `Bearer ${token}` } });
    if (res.ok) { const d = await res.json(); setCustomers(d.data); setTotalPages(d.pagination.pages); }
  };

  const fetchProducts = async (token: string) => {
    const res = await fetch(`${backendUrl}/api/admin/products?page=${page}`, { headers: { "Authorization": `Bearer ${token}` } });
    if (res.ok) { const d = await res.json(); setProducts(d.data); setTotalPages(d.pagination.pages); }
  };

  const fetchCategories = async (token: string) => {
    const res = await fetch(`${backendUrl}/api/admin/categories?page=${page}`, { headers: { "Authorization": `Bearer ${token}` } });
    if (res.ok) { const d = await res.json(); setCategories(d.data); setTotalPages(d.pagination.pages); }
  };

  const fetchOrders = async (token: string) => {
    const res = await fetch(`${backendUrl}/api/admin/orders?page=${page}`, { headers: { "Authorization": `Bearer ${token}` } });
    if (res.ok) { const d = await res.json(); setOrders(d.data); setTotalPages(d.pagination.pages); }
  };

  const fetchSettings = async (token: string) => {
    const res = await fetch(`${backendUrl}/api/admin/settings`, { headers: { "Authorization": `Bearer ${token}` } });
    if (res.ok) { 
      const d = await res.json(); 
      setSettings(d);
      setTaxSettings({
        goldTax: d.find((s:any) => s.key === "goldTax")?.value || 0,
        silverTax: d.find((s:any) => s.key === "silverTax")?.value || 0
      });
    }
  };

  // ---- Image Upload ----
  const handleImageUpload = async (file: File, setter: (url: string) => void) => {
    setUploadingImage(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${backendUrl}/api/admin/upload`, {
        method: "POST", headers: { "Authorization": `Bearer ${token}` }, body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) setter(data.url);
      else alert(data.error || "Upload failed");
    } catch (err) {
      alert("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  // ---- Handlers ----
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const payload = { ...productForm, images: productForm.imageUrl ? [productForm.imageUrl] : [] };
    const url = editingId ? `${backendUrl}/api/admin/products/${editingId}` : `${backendUrl}/api/admin/products`;
    const res = await fetch(url, {
      method: editingId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(payload)
    });
    if (res.ok) { alert(editingId ? "Updated!" : "Created!"); setShowProductModal(false); fetchProducts(token!); }
  };

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch(`${backendUrl}/api/admin/categories`, {
      method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(categoryForm)
    });
    if (res.ok) { setCategoryForm({name:"", description:"", icon:"", image:"", color:"", gradient:""}); fetchCategories(token!); }
  };

  const handleOrderStatusUpdate = async (id: string, status: string, type: 'orderStatus'|'paymentStatus') => {
    const token = localStorage.getItem("token");
    await fetch(`${backendUrl}/api/admin/orders/${id}/status`, {
      method: "PUT", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ [type]: status })
    });
    fetchOrders(token!);
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch(`${backendUrl}/api/admin/settings`, {
      method: "PUT", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify([
        { key: "goldTax", value: taxSettings.goldTax },
        { key: "silverTax", value: taxSettings.silverTax }
      ])
    });
    if (res.ok) alert("Settings updated!");
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center font-sans tracking-widest text-sm uppercase">Loading Admin...</div>;

  return (
    <main className="flex flex-col min-h-screen bg-background relative">
      <section className="py-12 px-8 max-w-7xl mx-auto w-full flex-grow">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-heading text-5xl font-normal text-foreground">Admin Dashboard</h1>
          <Button onClick={() => { localStorage.removeItem("token"); window.location.href = "/admin/login"; }} variant="outline" className="font-sans uppercase tracking-widest text-xs">Logout</Button>
        </div>

        <div className="flex gap-8 border-b border-border mb-12 overflow-x-auto pb-2">
          {["products", "categories", "orders", "customers", "settings"].map(t => (
            <button key={t} onClick={() => { setTab(t); setPage(1); }} className={`pb-4 font-sans text-sm tracking-widest uppercase transition-colors whitespace-nowrap ${tab === t ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* PRODUCTS TAB */}
        {tab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-sans text-xl uppercase tracking-widest text-foreground">Product Catalog</h2>
              <Button onClick={() => { setEditingId(null); setProductForm({ name: "", description: "", category: "", metalType: "22K", weight: 0, lossType: "none", lossValue: 0, makingCharge: 0, imageUrl: "", isActive: true, featured: false }); setShowProductModal(true); }} className="bg-foreground text-background uppercase tracking-widest text-xs py-5 px-6">+ Add Product</Button>
            </div>
            <div className="overflow-x-auto bg-muted/10 border border-border/50">
              <table className="w-full text-left font-sans text-sm">
                <thead className="text-xs uppercase tracking-widest text-muted-foreground border-b border-border bg-muted/30">
                  <tr><th className="px-6 py-4 font-normal">Image</th><th className="px-6 py-4 font-normal">Name</th><th className="px-6 py-4 font-normal">Category</th><th className="px-6 py-4 font-normal">Weight</th><th className="px-6 py-4 font-normal text-right">Actions</th></tr>
                </thead>
                <tbody>
                  {products.map((p: any) => (
                    <tr key={p._id} className="border-b border-border/30 hover:bg-muted/20">
                      <td className="px-6 py-4">{p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover" /> : <div className="w-12 h-12 bg-muted flex items-center justify-center text-[10px]">No Img</div>}</td>
                      <td className="px-6 py-4 text-foreground">{p.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{p.category}</td>
                      <td className="px-6 py-4 text-muted-foreground">{p.weight}g</td>
                      <td className="px-6 py-4 text-right space-x-4">
                        <button onClick={() => { setEditingId(p._id); setProductForm({ name: p.name||"", description: p.description||"", category: p.category||"", metalType: p.metalType||"22K", weight: p.weight||0, lossType: p.lossType||"none", lossValue: p.lossValue||0, makingCharge: p.makingCharge||0, imageUrl: p.images?.[0]||"", isActive: p.isActive??true, featured: p.featured??false }); setShowProductModal(true); }} className="text-muted-foreground hover:text-primary"><Edit size={16}/></button>
                        <button onClick={() => deleteProduct(p._id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CATEGORIES TAB */}
        {tab === "categories" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="font-heading text-3xl mb-8">Add Category</h2>
              <form onSubmit={handleCategorySubmit} className="space-y-6 bg-muted/20 p-8 border border-border/50">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Category Name</label>
                  <input required type="text" value={categoryForm.name} onChange={e => setCategoryForm({...categoryForm, name: e.target.value})} className="w-full bg-transparent border-b border-border py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Icon (Emoji)</label>
                  <input type="text" value={categoryForm.icon} onChange={e => setCategoryForm({...categoryForm, icon: e.target.value})} className="w-full bg-transparent border-b border-border py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Color Hex</label>
                  <input type="text" value={categoryForm.color} onChange={e => setCategoryForm({...categoryForm, color: e.target.value})} className="w-full bg-transparent border-b border-border py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Tailwind Gradient</label>
                  <input type="text" value={categoryForm.gradient} onChange={e => setCategoryForm({...categoryForm, gradient: e.target.value})} className="w-full bg-transparent border-b border-border py-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Description</label>
                  <textarea rows={2} value={categoryForm.description} onChange={e => setCategoryForm({...categoryForm, description: e.target.value})} className="w-full bg-transparent border-b border-border py-2 text-sm outline-none resize-none"></textarea>
                </div>
                <div className="border-2 border-dashed border-border/50 p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30" onClick={() => categoryFileInputRef.current?.click()}>
                  {categoryForm.image ? <img src={categoryForm.image} className="h-16 object-contain mb-2" /> : <Upload className="w-6 h-6 mb-2 text-muted-foreground" />}
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{uploadingImage ? "Uploading..." : "Upload Category Image"}</span>
                  <input type="file" ref={categoryFileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, (url) => setCategoryForm({...categoryForm, image: url}));
                  }} />
                </div>
                <Button type="submit" className="uppercase tracking-widest text-xs w-full py-6 mt-4">Add Category</Button>
              </form>
            </div>
            <div>
              <h2 className="font-heading text-3xl mb-8">Existing Categories</h2>
              <ul className="space-y-4">
                {categories.map((c: any) => (
                  <li key={c._id} className="flex justify-between items-center p-4 border border-border/50 bg-muted/10">
                    <div className="flex items-center gap-4">
                      {c.image ? <img src={c.image} className="w-10 h-10 object-cover rounded" /> : <span className="text-2xl">{c.icon}</span>}
                      <span className="font-sans text-sm uppercase tracking-widest">{c.name}</span>
                    </div>
                    <button onClick={async () => {
                      if (!confirm("Delete?")) return;
                      const token = localStorage.getItem("token");
                      await fetch(`${backendUrl}/api/admin/categories/${c._id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
                      fetchCategories(token!);
                    }} className="text-muted-foreground hover:text-destructive"><Trash2 size={16}/></button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {tab === "orders" && (
          <div className="overflow-x-auto bg-muted/10 border border-border/50">
            <table className="w-full text-left font-sans text-sm">
              <thead className="text-xs uppercase tracking-widest text-muted-foreground border-b border-border bg-muted/30">
                <tr><th className="px-6 py-4 font-normal">Order #</th><th className="px-6 py-4 font-normal">Customer</th><th className="px-6 py-4 font-normal">Total</th><th className="px-6 py-4 font-normal">Status</th><th className="px-6 py-4 font-normal">Payment</th></tr>
              </thead>
              <tbody>
                {orders.map((o: any) => (
                  <tr key={o._id} className="border-b border-border/30 hover:bg-muted/20">
                    <td className="px-6 py-4 text-foreground">{o.orderNumber}</td>
                    <td className="px-6 py-4 text-muted-foreground">{o.user?.firstName || 'Unknown'} {o.user?.lastName || ''}</td>
                    <td className="px-6 py-4 text-muted-foreground">NPR {o.totalAmount}</td>
                    <td className="px-6 py-4">
                      <select value={o.orderStatus} onChange={e => handleOrderStatusUpdate(o._id, e.target.value, 'orderStatus')} className="bg-transparent border border-border p-1 text-xs outline-none">
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select value={o.paymentStatus} onChange={e => handleOrderStatusUpdate(o._id, e.target.value, 'paymentStatus')} className="bg-transparent border border-border p-1 text-xs outline-none">
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === "settings" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-muted/30 p-10 border border-border/50">
              <h2 className="font-heading text-3xl mb-8">Global Tax Settings</h2>
              <form onSubmit={handleSettingsSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Gold Tax (%)</label>
                  <input type="number" step="0.01" value={taxSettings.goldTax} onChange={e => setTaxSettings({...taxSettings, goldTax: Number(e.target.value)})} className="w-full bg-transparent border-b border-border py-2 px-0 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Silver Tax (%)</label>
                  <input type="number" step="0.01" value={taxSettings.silverTax} onChange={e => setTaxSettings({...taxSettings, silverTax: Number(e.target.value)})} className="w-full bg-transparent border-b border-border py-2 px-0 outline-none text-sm" />
                </div>
                <Button type="submit" className="bg-foreground text-background uppercase tracking-widest text-xs py-6 mt-4 w-full">Save Taxes</Button>
              </form>
            </div>
            
            <div className="bg-muted/30 p-10 border border-border/50">
              <h2 className="font-heading text-3xl mb-8">Update Homepage Banner</h2>
              <div className="border-2 border-dashed border-border/50 p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30" onClick={() => bannerFileInputRef.current?.click()}>
                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                <span className="text-xs uppercase tracking-widest text-muted-foreground">{uploadingImage ? "Uploading..." : "Click to upload Banner (Cloudinary)"}</span>
                <input type="file" ref={bannerFileInputRef} className="hidden" accept="image/*" onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleImageUpload(file, async (url) => {
                      const token = localStorage.getItem("token");
                      await fetch(`${backendUrl}/api/admin/banners`, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify({ imageUrl: url }) });
                      alert("Banner updated!");
                    });
                  }
                }} />
              </div>
            </div>
          </div>
        )}

        {/* PAGINATION */}
        {tab !== "settings" && totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 space-x-8">
            <button disabled={page === 1} onClick={() => setPage(page-1)} className="text-muted-foreground hover:text-foreground disabled:opacity-50"><ChevronLeft size={24}/></button>
            <span className="font-sans text-sm tracking-widest text-muted-foreground">Page {page} of {totalPages}</span>
            <button disabled={page === totalPages} onClick={() => setPage(page+1)} className="text-muted-foreground hover:text-foreground disabled:opacity-50"><ChevronRight size={24}/></button>
          </div>
        )}
      </section>
      
      {/* PRODUCT MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 bg-background/90 flex justify-center items-center z-50 p-4 overflow-y-auto">
          <div className="bg-background border border-border/50 max-w-3xl w-full p-8 shadow-2xl relative my-8 max-h-[90vh] overflow-y-auto">
            <button onClick={() => setShowProductModal(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground uppercase text-xs tracking-widest">Close</button>
            <h2 className="font-heading text-3xl mb-8">{editingId ? "Edit Product" : "Add Product"}</h2>
            
            <form onSubmit={handleProductSubmit} className="space-y-6">
              <div className="border-2 border-dashed border-border/50 p-6 flex flex-col items-center justify-center text-center bg-muted/10 cursor-pointer hover:bg-muted/20" onClick={() => fileInputRef.current?.click()}>
                {productForm.imageUrl ? <img src={productForm.imageUrl} className="h-32 object-contain mb-4" /> : <Upload className="text-muted-foreground w-8 h-8 mb-4" />}
                <span className="text-xs uppercase tracking-widest text-muted-foreground">{uploadingImage ? "Uploading..." : "Click to upload image"}</span>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, (url) => setProductForm({...productForm, imageUrl: url}));
                }} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Name</label><input type="text" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full bg-muted/20 border-b border-border py-2 px-2 text-sm outline-none" /></div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Category</label>
                  <select required value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full bg-muted/20 border-b border-border py-2 px-2 text-sm outline-none">
                    <option value="">Select Category</option>{categories.map((c: any) => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Metal Type</label>
                  <select required value={productForm.metalType} onChange={e => setProductForm({...productForm, metalType: e.target.value})} className="w-full bg-muted/20 border-b border-border py-2 px-2 text-sm outline-none">
                    <option value="24K">24K Gold</option><option value="22K">22K Gold</option><option value="Silver">Silver</option>
                  </select>
                </div>
                <div><label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Weight (g)</label><input type="number" step="0.01" required value={productForm.weight||''} onChange={e => setProductForm({...productForm, weight: Number(e.target.value)})} className="w-full bg-muted/20 border-b border-border py-2 px-2 text-sm outline-none" /></div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Loss Type</label>
                  <select required value={productForm.lossType} onChange={e => setProductForm({...productForm, lossType: e.target.value})} className="w-full bg-muted/20 border-b border-border py-2 px-2 text-sm outline-none">
                    <option value="none">No Loss</option><option value="percentage">%</option><option value="grams">Grams</option>
                  </select>
                </div>
                <div><label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Loss Value</label><input type="number" step="0.01" value={productForm.lossValue||''} onChange={e => setProductForm({...productForm, lossValue: Number(e.target.value)})} className="w-full bg-muted/20 border-b border-border py-2 px-2 text-sm outline-none" disabled={productForm.lossType === "none"} /></div>
                <div><label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Making Charge (NPR)</label><input type="number" value={productForm.makingCharge||''} onChange={e => setProductForm({...productForm, makingCharge: Number(e.target.value)})} className="w-full bg-muted/20 border-b border-border py-2 px-2 text-sm outline-none" /></div>
              </div>
              <Button type="submit" disabled={uploadingImage} className="w-full bg-foreground text-background uppercase tracking-widest py-6 mt-4">Save Product</Button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
