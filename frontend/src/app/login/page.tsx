"use client";

import { useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ssljnextjs.onrender.com";

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const res = await fetch(`${backendUrl}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: credentialResponse.credential, payload: decoded })
      });
      const data = await res.json();
      
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = data.user.role === 'admin' ? "/admin" : "/";
      } else {
        setError(data.error || "Google login failed on backend");
      }
    } catch (error) {
      console.error(error);
      setError("Google authentication failed");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const body = isLogin ? { email, password } : { firstName, lastName, phone, email, password };

    try {
      const res = await fetch(`${backendUrl}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      
      if (!res.ok) {
        setError(data.error || "Authentication failed");
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        if (data.user.role === 'admin') {
          window.location.href = "/admin";
        } else {
          window.location.href = "/";
        }
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
            {isLogin ? "Welcome Back" : "Join Us"}
          </span>
          <h1 className="font-heading text-4xl font-normal text-foreground mb-8 text-center">
            {isLogin ? "Sign In" : "Create Account"}
          </h1>
          
          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google login failed")}
            />
          </div>
          
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
            <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="bg-background px-2 text-muted-foreground">or</span></div>
          </div>

          {error && (
            <div className="bg-destructive/10 text-destructive text-sm font-sans tracking-widest p-4 mb-6 uppercase text-center">
              {error}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">First Name</label>
                  <input 
                    type="text" 
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors font-sans text-sm" 
                    placeholder="First Name" 
                    required={!isLogin}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Last Name</label>
                  <input 
                    type="text" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors font-sans text-sm" 
                    placeholder="Last Name" 
                    required={!isLogin}
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Phone Number</label>
                  <input 
                    type="tel" 
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors font-sans text-sm" 
                    placeholder="Your Phone Number" 
                    required={!isLogin}
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs uppercase tracking-widest mb-2 text-muted-foreground">Email Address</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-border py-2 px-0 outline-none focus:border-primary transition-colors font-sans text-sm" 
                placeholder="your@email.com" 
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
              {isLogin ? "Sign In" : "Register"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)} 
              className="font-sans text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors"
            >
              {isLogin ? "Need an account? Register" : "Already have an account? Sign In"}
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
