"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signInUser } from "@/lib/auth/supabaseAuth";
import { toast } from "sonner";
import "@/styles/auth.css";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const spotlight = document.getElementById("spotlight");
    const handleMouseMove = (e: MouseEvent) => {
      if (spotlight) {
        spotlight.style.setProperty("--mouse-x", `${e.clientX}px`);
        spotlight.style.setProperty("--mouse-y", `${e.clientY}px`);
      }
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const toastId = toast.loading("Creating your Studio account...");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Registration failed");
      }

      toast.success("Account created & verified!", { id: toastId });

      try {
        await signInUser(email, password);
        toast.success("Welcome to DB-Generator Studio!");
        window.location.href = "/dashboard";
      } catch {
        window.location.href = "/login";
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Registration failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 flex flex-col justify-between relative overflow-x-hidden selection:bg-purple-600 selection:text-white">
      {/* Ambient background glow layers */}
      <div className="fixed inset-0 pointer-events-none nebula-gradient-1 z-0"></div>
      <div className="fixed inset-0 pointer-events-none nebula-gradient-2 z-0"></div>
      <div className="fixed inset-0 pointer-events-none nebula-gradient-center z-0"></div>
      <div className="fixed inset-0 pointer-events-none bg-grid-pattern z-0 opacity-80"></div>
      <div className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-300" id="spotlight"></div>

      {/* Main Header */}
      <header className="relative z-10 w-full border-b border-white/[0.06] bg-[#07060d]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <Link className="flex items-center space-x-3 group" href="/" title="DB-Generator Studio">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-400 p-[1px] border border-purple-500/30 group-hover:border-purple-400 transition shadow-sm">
                <div className="w-full h-full bg-[#07060d]/90 rounded-[7px] flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-300 group-hover:text-purple-200 transition" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                    <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                    <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                  </svg>
                </div>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-purple-300 transition">
                  DB-Generator
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-xs font-mono font-medium bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  v1.4-nebula
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm">
            <Link
              className="inline-flex items-center text-slate-300 hover:text-white font-medium text-xs sm:text-sm transition px-3 py-1.5 rounded-lg border border-white/10 bg-slate-800/40 hover:bg-slate-800/80 shadow-sm"
              href="/"
            >
              <span className="mr-1.5 text-slate-400">←</span>
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-10 lg:py-16 px-6">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT: Registration Card */}
          <section className="lg:col-span-6 xl:col-span-5 flex justify-center">
            <div className="w-full max-w-md glass-panel shadow-2xl rounded-2xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/80 to-transparent"></div>

              <div className="text-center mb-6">
                <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 mx-auto mb-3 shadow-inner shadow-purple-500/20">
                  <span className="text-lg">✨</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white font-sans">Create an account</h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Start generating &amp; deploying normalized schemas in seconds</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="reg-email">
                    Work Email Address
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                    </div>
                    <input
                      className="glass-input block w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition"
                      id="reg-email"
                      name="email"
                      placeholder="developer@company.com"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="reg-password">
                    Choose Password (min. 6 characters)
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                    </div>
                    <input
                      className="glass-input block w-full pl-9 pr-10 py-2.5 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono transition"
                      id="reg-password"
                      name="password"
                      placeholder="••••••••••••"
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      aria-label="Toggle password visibility"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition focus:outline-none cursor-pointer"
                      onClick={() => setShowPassword((prev) => !prev)}
                      type="button"
                    >
                      {showPassword ? (
                        <svg className="h-4 w-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                        </svg>
                      ) : (
                        <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                          <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  disabled={loading}
                  className="w-full mt-2 relative group overflow-hidden rounded-lg p-[1px] font-semibold text-sm transition shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer disabled:opacity-50"
                  type="submit"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 transition-all duration-300 group-hover:opacity-90"></div>
                  <div className="relative px-4 py-2.5 rounded-[7px] bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center space-x-2 text-white font-medium">
                    <span className="tracking-wide">{loading ? "Creating Account..." : "Create Studio Account"}</span>
                    <span className="text-purple-200">→</span>
                  </div>
                </button>
              </form>

              <div className="mt-4 pt-3 border-t border-white/[0.06] text-center text-xs text-slate-400">
                Already have an account?{" "}
                <Link className="text-purple-400 hover:text-purple-300 font-medium underline underline-offset-2" href="/login">
                  Sign In
                </Link>
              </div>
            </div>
          </section>

          {/* RIGHT: Feature Highlight Showcase */}
          <section className="hidden lg:block lg:col-span-6 xl:col-span-7 pl-4 xl:pl-8 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Free Developer Tier</span>
              </div>
              <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight font-sans">
                Build PostgreSQL schemas <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
                  with AI assistance &amp; visual control.
                </span>
              </h2>
              <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
                Connect your database idea to real PostgreSQL tables, execute directly on Supabase, and copy connection strings for your favorite ORM.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-w-md pt-2">
              <div className="p-3.5 rounded-xl border border-white/10 bg-[#110f22]/70 backdrop-blur-md">
                <div className="text-emerald-400 font-bold text-sm mb-1">⚡ Instant Deploy</div>
                <div className="text-xs text-slate-400">1-click Supabase table generation with foreign keys</div>
              </div>
              <div className="p-3.5 rounded-xl border border-white/10 bg-[#110f22]/70 backdrop-blur-md">
                <div className="text-cyan-400 font-bold text-sm mb-1">🎨 Visual Canvas</div>
                <div className="text-xs text-slate-400">Drag-and-drop React Flow table relationships</div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/[0.06] bg-[#07060d]/70 backdrop-blur-md px-6 sm:px-8 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span>© 2026 DB-Generator, Inc. All rights reserved.</span>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-slate-400">Obsidian Nebula Release</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
