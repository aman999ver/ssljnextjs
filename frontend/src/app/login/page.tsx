"use client";

import { useState } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { Button } from "@/components/ui/button";
import { useGoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "https://ssljnextjs.onrender.com";

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const userInfo = await userInfoRes.json();
        
        const res = await fetch(`${backendUrl}/api/auth/google`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token: tokenResponse.access_token, payload: userInfo })
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
    },
    onError: () => setError("Google login failed")
  });

  const handleGoogleClick = () => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === "placeholder-client-id" || clientId === "") {
      setError("Google Sign-In is not configured yet. Please use email login.");
      return;
    }
    googleLogin();
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
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleClick}
              className="w-full flex items-center justify-center gap-2 py-6 uppercase tracking-widest text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/><path d="M1 1h22v22H1z" fill="none"/></svg>
              Sign in with Google
            </Button>
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
