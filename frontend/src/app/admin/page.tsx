"use client";

import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Edit, Upload } from "lucide-react";

export default function AdminPage() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bannerUrl, setBannerUrl] = useState("");
  const [tab, setTab] = useState("products");

  // Product Form State
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: "", description: "", category: "", metalType: "22K",
    weight: 0, lossType: "none", lossValue: 0, makingCharge: 0, tax: 0,
    imageUrl: "", isActive: true, featured: false
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Category Form State
  const [categoryName, setCategoryName] = useState("");
  
  // Password Form State
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });

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
        fetchProducts(token),
        fetchCategories(token)
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async (token: string) => {
    const res = await fetch(`${backendUrl}/api/admin/customers`, { headers: { "Authorization": `Bearer ${token}` } });
    if (res.ok) setCustomers(await res.json());
  };

  const fetchProducts = async (token: string) => {
    const res = await fetch(`${backendUrl}/api/admin/products`, { headers: { "Authorization": `Bearer ${token}` } });
    if (res.ok) setProducts(await res.json());
  };

  const fetchCategories = async (token: string) => {
    const res = await fetch(`${backendUrl}/api/admin/categories`, { headers: { "Authorization": `Bearer ${token}` } });
    if (res.ok) setCategories(await res.json());
  };

  // ---- Image Upload ----
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`${backendUrl}/api/admin/upload`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setProductForm(prev => ({ ...prev, imageUrl: data.url }));
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload image.");
    } finally {
      setUploadingImage(false);
    }
  };

  // ---- Product Handlers ----
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const payload = { ...productForm, images: productForm.imageUrl ? [productForm.imageUrl] : [] };

    try {
      const url = editingId ? `${backendUrl}/api/admin/products/${editingId}` : `${backendUrl}/api/admin/products`;
      const res = await fetch(url, {
        method: editingId ? "PUT" : "POST",
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
    if (!confirm("Delete this product?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`${backendUrl}/api/admin/products/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
    if (res.ok) fetchProducts(token!);
  };

  // ---- Category Handlers ----
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch(`${backendUrl}/api/admin/categories`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ name: categoryName })
    });
    if (res.ok) {
      setCategoryName("");
      fetchCategories(token!);
    }
  };

  const deleteCategory = async (id: string) => {
    if (!confirm("Delete category?")) return;
    const token = localStorage.getItem("token");
    const res = await fetch(`${backendUrl}/api/admin/categories/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
    if (res.ok) fetchCategories(token!);
  };

  // ---- Settings Handlers ----
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const res = await fetch(`${backendUrl}/api/auth/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify(passwords)
    });
    const data = await res.json();
    if (res.ok) {
      alert("Password updated!");
      setPasswords({ oldPassword: "", newPassword: "" });
    } else {
      alert(data.error || "Update failed");
    }
  };

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center font-sans tracking-widest text-sm uppercase">Loading Admin...</div>;

  return (
    <main className="flex flex-col min-h-screen bg-background relative">
      <section className="py-12 px-8 max-w-7xl mx-auto w-full flex-grow">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-heading text-5xl font-normal text-foreground">Admin Dashboard</h1>
          <Button 
            onClick={() => { localStorage.removeItem("token"); window.location.href = "/admin/login"; }}
            variant="outline" className="font-sans uppercase tracking-widest text-xs"
          >
            Logout
          </Button>
        </div>

        <div className="flex gap-8 border-b border-border mb-12 overflow-x-auto pb-2">
          {["products", "categories", "customers", "settings"].map(t => (
            <button key={t} onClick={() => setTab(t)} className={`pb-4 font-sans text-sm tracking-widest uppercase transition-colors whitespace-nowrap ${tab === t ? "border-b-2 border-foreground text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>

        {/* PRODUCTS TAB */}
        {tab === "products" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-sans text-xl uppercase tracking-widest text-foreground">Product Catalog</h2>
              <Button onClick={() => {
                setEditingId(null);
                setProductForm({ name: "", description: "", category: "", metalType: "22K", weight: 0, lossType: "none", lossValue: 0, makingCharge: 0, tax: 0, imageUrl: "", isActive: true, featured: false });
                setShowProductModal(true);
              }} className="bg-foreground text-background uppercase tracking-widest text-xs py-5 px-6">
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
                    <th className="px-6 py-4 font-normal">Metal</th>
                    <th className="px-6 py-4 font-normal">Weight</th>
                    <th className="px-6 py-4 font-normal text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p: any) => (
                    <tr key={p._id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover border border-border/50" /> : <div className="w-12 h-12 bg-muted text-[10px] text-muted-foreground flex items-center justify-center">No Img</div>}
                      </td>
                      <td className="px-6 py-4 text-foreground">{p.name}</td>
                      <td className="px-6 py-4 text-muted-foreground">{p.category}</td>
                      <td className="px-6 py-4 text-muted-foreground">{p.metalType}</td>
                      <td className="px-6 py-4 text-muted-foreground">{p.weight}g</td>
                      <td className="px-6 py-4 text-right space-x-4">
                        <button onClick={() => {
                          setEditingId(p._id);
                          setProductForm({
                            name: p.name||"", description: p.description||"", category: p.category||"", metalType: p.metalType||"22K",
                            weight: p.weight||0, lossType: p.lossType||"none", lossValue: p.lossValue||0, makingCharge: p.makingCharge||0, tax: p.tax||0,
                            imageUrl: p.images?.[0]||"", isActive: p.isActive??true, featured: p.featured??false
                          });
                          setShowProductModal(true);
                        }} className="text-muted-foreground hover:text-primary"><Edit size={16}/></button>
                        <button onClick={() => deleteProduct(p._id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16}/></button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr><td colSpan={6} className="text-center py-12 text-muted-foreground text-xs uppercase">No products found.</td></tr>
                  )}
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
                  <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Category Name</label>
                  <input required type="text" value={categoryName} onChange={e => setCategoryName(e.target.value)} className="w-full bg-transparent border-b border-border py-2 px-0 outline-none text-sm" placeholder="e.g. Ring, Necklace" />
                </div>
                <Button type="submit" className="uppercase tracking-widest text-xs">Add Category</Button>
              </form>
            </div>
            <div>
              <h2 className="font-heading text-3xl mb-8">Existing Categories</h2>
              <ul className="space-y-4">
                {categories.map((c: any) => (
                  <li key={c._id} className="flex justify-between items-center p-4 border border-border/50 bg-muted/10">
                    <span className="font-sans text-sm uppercase tracking-widest">{c.name}</span>
                    <button onClick={() => deleteCategory(c._id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={16}/></button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* CUSTOMERS TAB */}
        {tab === "customers" && (
          <div className="overflow-x-auto bg-muted/10 border border-border/50">
            <table className="w-full text-left font-sans text-sm">
              <thead className="text-xs uppercase tracking-widest text-muted-foreground border-b border-border bg-muted/30">
                <tr><th className="px-6 py-4 font-normal">Name</th><th className="px-6 py-4 font-normal">Email</th><th className="px-6 py-4 font-normal">Phone</th><th className="px-6 py-4 font-normal">Joined</th></tr>
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

        {/* SETTINGS TAB */}
        {tab === "settings" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-muted/30 p-10 border border-border/50">
              <h2 className="font-heading text-3xl mb-8">Change Password</h2>
              <form onSubmit={handlePasswordChange} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Old Password</label>
                  <input required type="password" value={passwords.oldPassword} onChange={e => setPasswords({...passwords, oldPassword: e.target.value})} className="w-full bg-transparent border-b border-border py-2 px-0 outline-none text-sm" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">New Password</label>
                  <input required type="password" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword: e.target.value})} className="w-full bg-transparent border-b border-border py-2 px-0 outline-none text-sm" />
                </div>
                <Button type="submit" className="bg-foreground text-background hover:bg-foreground/90 uppercase tracking-widest text-xs py-6 mt-4">Update Password</Button>
              </form>
            </div>
            
            <div className="bg-muted/30 p-10 border border-border/50">
              <h2 className="font-heading text-3xl mb-8">Update Homepage Banner</h2>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const token = localStorage.getItem("token");
                const res = await fetch(`${backendUrl}/api/admin/banners`, { method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }, body: JSON.stringify({ imageUrl: bannerUrl }) });
                if (res.ok) { alert("Banner updated!"); setBannerUrl(""); }
              }} className="space-y-6">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Banner Image URL</label>
                  <input type="url" value={bannerUrl} onChange={e => setBannerUrl(e.target.value)} className="w-full bg-transparent border-b border-border py-2 outline-none text-sm" required />
                </div>
                <Button type="submit" className="bg-foreground text-background hover:bg-foreground/90 uppercase tracking-widest text-xs py-6 mt-4">Update Banner</Button>
              </form>
            </div>
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
              {/* Image Upload Area */}
              <div className="border-2 border-dashed border-border/50 p-6 flex flex-col items-center justify-center text-center bg-muted/10 cursor-pointer hover:bg-muted/20 transition-colors" onClick={() => fileInputRef.current?.click()}>
                {productForm.imageUrl ? (
                  <img src={productForm.imageUrl} alt="Preview" className="h-32 object-contain mb-4" />
                ) : (
                  <Upload className="text-muted-foreground w-8 h-8 mb-4" />
                )}
                <span className="text-xs uppercase tracking-widest text-muted-foreground">
                  {uploadingImage ? "Uploading..." : "Click to upload product image (Cloudinary)"}
                </span>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Product Name</label>
                  <input type="text" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full bg-muted/20 border-b border-border py-2 px-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Category</label>
                  <select required value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="w-full bg-muted/20 border-b border-border py-2 px-2 text-sm outline-none">
                    <option value="">Select Category</option>
                    {categories.map((c: any) => <option key={c._id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Metal Type</label>
                  <select required value={productForm.metalType} onChange={e => setProductForm({...productForm, metalType: e.target.value})} className="w-full bg-muted/20 border-b border-border py-2 px-2 text-sm outline-none">
                    <option value="24K">24K Gold</option>
                    <option value="22K">22K Gold</option>
                    <option value="Silver">Silver</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Weight (grams)</label>
                  <input type="number" step="0.01" required value={productForm.weight || ''} onChange={e => setProductForm({...productForm, weight: Number(e.target.value)})} className="w-full bg-muted/20 border-b border-border py-2 px-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Loss Type</label>
                  <select required value={productForm.lossType} onChange={e => setProductForm({...productForm, lossType: e.target.value})} className="w-full bg-muted/20 border-b border-border py-2 px-2 text-sm outline-none">
                    <option value="none">No Loss</option>
                    <option value="percentage">Percentage (%)</option>
                    <option value="grams">Grams (g)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Loss Value</label>
                  <input type="number" step="0.01" value={productForm.lossValue || ''} onChange={e => setProductForm({...productForm, lossValue: Number(e.target.value)})} className="w-full bg-muted/20 border-b border-border py-2 px-2 text-sm outline-none" disabled={productForm.lossType === "none"} />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Making Charge (NPR)</label>
                  <input type="number" value={productForm.makingCharge || ''} onChange={e => setProductForm({...productForm, makingCharge: Number(e.target.value)})} className="w-full bg-muted/20 border-b border-border py-2 px-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Tax (%)</label>
                  <input type="number" step="0.01" value={productForm.tax || ''} onChange={e => setProductForm({...productForm, tax: Number(e.target.value)})} className="w-full bg-muted/20 border-b border-border py-2 px-2 text-sm outline-none" />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-[10px] uppercase tracking-widest mb-1 text-muted-foreground">Description</label>
                  <textarea rows={3} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full bg-muted/20 border-b border-border py-2 px-2 text-sm outline-none resize-none"></textarea>
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

              <Button type="submit" disabled={uploadingImage} className="w-full bg-foreground text-background uppercase tracking-widest py-6 mt-4 hover:bg-foreground/90">
                {editingId ? "Update Product" : "Save Product"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
