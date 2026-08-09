"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ firstName: "", lastName: "", phone: "" });

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ssljnextjs.onrender.com";

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    fetch(`${backendUrl}/api/auth/me`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setUser(data);
        setFormData({ firstName: data.firstName || "", lastName: data.lastName || "", phone: data.phone || "" });
      })
      .catch(err => {
        console.error(err);
        localStorage.removeItem("token");
        window.location.href = "/login";
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${backendUrl}/api/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (loading) return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center text-muted-foreground uppercase tracking-widest text-sm">
        Loading Profile...
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <section className="py-24 px-8 max-w-4xl mx-auto w-full flex-grow">
        <div className="flex justify-between items-center mb-12">
          <h1 className="font-heading text-4xl text-foreground">My Profile</h1>
          <Button onClick={handleLogout} variant="outline" className="uppercase tracking-widest text-xs">
            Logout
          </Button>
        </div>

        <div className="bg-muted/10 border border-border p-8 shadow-sm">
          {!editing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">First Name</span>
                  <span className="font-sans text-foreground">{user.firstName}</span>
                </div>
                <div>
                  <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Last Name</span>
                  <span className="font-sans text-foreground">{user.lastName}</span>
                </div>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Email Address</span>
                <span className="font-sans text-foreground">{user.email}</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Phone Number</span>
                <span className="font-sans text-foreground">{user.phone || "Not provided"}</span>
              </div>
              <div>
                <span className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Member Since</span>
                <span className="font-sans text-foreground">{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              
              <Button onClick={() => setEditing(true)} className="mt-8 bg-foreground text-background uppercase tracking-widest text-xs w-full py-6">
                Edit Profile
              </Button>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">First Name</label>
                  <input type="text" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full bg-transparent border-b border-border py-2 px-2 text-sm outline-none" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Last Name</label>
                  <input type="text" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full bg-transparent border-b border-border py-2 px-2 text-sm outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-1">Phone Number</label>
                <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-transparent border-b border-border py-2 px-2 text-sm outline-none" />
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" className="flex-1 bg-foreground text-background uppercase tracking-widest text-xs py-6">
                  Save Changes
                </Button>
                <Button type="button" onClick={() => setEditing(false)} variant="outline" className="flex-1 uppercase tracking-widest text-xs py-6">
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
