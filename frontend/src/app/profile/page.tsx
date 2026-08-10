"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [user, setUser] = useState<any>(null);
  
  // Profile Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [profileMsg, setProfileMsg] = useState("");
  const [profileError, setProfileError] = useState("");
  
  // Password Form State
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ssljnextjs.onrender.com";

  useEffect(() => {
    // Check URL query param for active tab
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("tab") === "security") {
      setActiveTab("security");
    }

    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/login";
        return;
      }
      try {
        const res = await fetch(`${backendUrl}/api/auth/me`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          setFirstName(data.firstName || "");
          setLastName(data.lastName || "");
          setPhone(data.phone || "");
          // Assuming address is stored as a simple string or an object with a 'street' field. Let's use a simple string for now.
          if (typeof data.address === 'string') {
            setAddress(data.address);
          } else if (data.address && data.address.street) {
            setAddress(data.address.street); // Handle legacy object if any
          }
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };
    fetchUser();
  }, [backendUrl]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg("");
    setProfileError("");
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch(`${backendUrl}/api/auth/profile`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ firstName, lastName, phone, address })
      });
      const data = await res.json();
      if (res.ok) {
        setProfileMsg("Profile updated successfully!");
        // Update local storage user name
        const lsUser = JSON.parse(localStorage.getItem("user") || "{}");
        lsUser.name = `${firstName} ${lastName}`;
        localStorage.setItem("user", JSON.stringify(lsUser));
      } else {
        setProfileError(data.error || "Failed to update profile");
      }
    } catch (err) {
      setProfileError("Network error");
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordMsg("");
    setPasswordError("");
    const token = localStorage.getItem("token");
    
    try {
      const res = await fetch(`${backendUrl}/api/auth/password`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setPasswordMsg("Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
      } else {
        setPasswordError(data.error || "Failed to update password");
      }
    } catch (err) {
      setPasswordError("Network error");
    }
  };

  // Safe check before return to avoid Next.js hydration issues during login redirect
  if (!user && typeof window !== 'undefined') {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-grow flex items-center justify-center font-sans tracking-widest text-xs uppercase">Loading...</div>
      </main>
    );
  } else if (!user) {
    return null; // Server side render nothing
  }

  return (
    <main className="flex flex-col min-h-screen bg-background">
      <Navbar />
      
      <section className="py-24 px-8 max-w-4xl mx-auto w-full flex-grow">
        <h1 className="font-heading text-4xl text-foreground mb-12 border-b border-border pb-6">Your Account</h1>
        
        <div className="flex flex-col md:flex-row gap-12">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 flex flex-col space-y-4 font-sans text-xs tracking-widest uppercase border-r border-border/20 md:pr-4">
            <button 
              onClick={() => setActiveTab("profile")} 
              className={`text-left py-3 px-4 transition-colors ${activeTab === "profile" ? "bg-muted text-primary" : "text-foreground hover:bg-muted/50"}`}
            >
              Profile Details
            </button>
            <button 
              onClick={() => setActiveTab("orders")} 
              className={`text-left py-3 px-4 transition-colors ${activeTab === "orders" ? "bg-muted text-primary" : "text-foreground hover:bg-muted/50"}`}
            >
              Order History
            </button>
            <button 
              onClick={() => setActiveTab("security")} 
              className={`text-left py-3 px-4 transition-colors ${activeTab === "security" ? "bg-muted text-primary" : "text-foreground hover:bg-muted/50"}`}
            >
              Security
            </button>
          </div>

          {/* Content Area */}
          <div className="w-full md:w-3/4">
            {activeTab === "profile" && (
              <div className="bg-muted/30 p-8 border border-border/50">
                <h2 className="font-sans text-sm tracking-[0.2em] uppercase text-primary mb-8">Personal Information</h2>
                
                {profileMsg && <div className="mb-6 p-4 bg-primary/10 text-primary font-sans text-xs uppercase tracking-widest text-center">{profileMsg}</div>}
                {profileError && <div className="mb-6 p-4 bg-destructive/10 text-destructive font-sans text-xs uppercase tracking-widest text-center">{profileError}</div>}
                
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">First Name</label>
                      <input 
                        type="text" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors font-sans text-sm" 
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Last Name</label>
                      <input 
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors font-sans text-sm" 
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Email (Cannot be changed)</label>
                    <input 
                      type="email" 
                      value={user.email}
                      disabled
                      className="w-full bg-transparent border-b border-border py-2 px-0 outline-none opacity-50 cursor-not-allowed font-sans text-sm" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Phone Number</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors font-sans text-sm" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Delivery Address</label>
                    <textarea 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors font-sans text-sm min-h-[80px]" 
                      placeholder="Enter your full delivery address"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full md:w-auto bg-foreground text-background hover:bg-foreground/90 uppercase tracking-widest py-6 px-12 mt-4">
                    Save Changes
                  </Button>
                </form>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-muted/30 p-8 border border-border/50">
                <h2 className="font-sans text-sm tracking-[0.2em] uppercase text-primary mb-8">Order History</h2>
                <OrderHistoryList backendUrl={backendUrl} />
              </div>
            )}

            {activeTab === "security" && (
              <div className="bg-muted/30 p-8 border border-border/50">
                <h2 className="font-sans text-sm tracking-[0.2em] uppercase text-primary mb-8">Change Password</h2>
                
                {passwordMsg && <div className="mb-6 p-4 bg-primary/10 text-primary font-sans text-xs uppercase tracking-widest text-center">{passwordMsg}</div>}
                {passwordError && <div className="mb-6 p-4 bg-destructive/10 text-destructive font-sans text-xs uppercase tracking-widest text-center">{passwordError}</div>}
                
                <form onSubmit={handlePasswordUpdate} className="space-y-6">
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Current Password</label>
                    <input 
                      type="password" 
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors font-sans text-sm" 
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">New Password</label>
                    <input 
                      type="password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors font-sans text-sm" 
                      required
                      minLength={6}
                    />
                  </div>
                  <Button type="submit" className="w-full md:w-auto bg-foreground text-background hover:bg-foreground/90 uppercase tracking-widest py-6 px-12 mt-4">
                    Update Password
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function OrderHistoryList({ backendUrl }: { backendUrl: string }) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${backendUrl}/api/orders/my-orders`, {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) setOrders(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [backendUrl]);

  if (loading) return <p className="font-sans text-xs tracking-widest uppercase text-muted-foreground">Loading orders...</p>;
  if (orders.length === 0) return <p className="font-sans text-xs tracking-widest uppercase text-muted-foreground">No orders found.</p>;

  return (
    <div className="space-y-6">
      {orders.map((order) => (
        <div key={order._id} className="border border-border/50 p-6 bg-background">
          <div className="flex justify-between items-center mb-4 border-b border-border/30 pb-4">
            <div>
              <p className="font-heading text-lg">{order.orderNumber}</p>
              <p className="font-sans text-[10px] tracking-widest uppercase text-muted-foreground">
                {new Date(order.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="font-sans text-sm font-medium tracking-widest">NPR {order.totalAmount.toLocaleString()}</p>
              <p className="font-sans text-[10px] tracking-widest uppercase text-muted-foreground mt-1">
                Status: <span className="text-primary">{order.orderStatus}</span>
              </p>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            {order.items.map((item: any, index: number) => (
              <div key={index} className="flex justify-between font-sans text-xs text-muted-foreground">
                <span>{item.name} x {item.quantity}</span>
                <span>NPR {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>
          <div className="bg-muted/20 p-4 border border-border/20 flex flex-col md:flex-row justify-between gap-4 font-sans text-[10px] uppercase tracking-widest">
            <div>
              <p className="text-muted-foreground mb-1">Payment Method</p>
              <p>{order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Payment Status</p>
              <p className={order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-primary'}>{order.paymentStatus}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
