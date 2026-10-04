"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInUser } from "@/lib/auth/supabaseAuth";
import { toast } from "sonner";
import "@/styles/auth.css";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [resetLink, setResetLink] = useState<string | null>(null);
  const router = useRouter();

  // Check URL params for messages on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("password_reset") === "true") {
        toast.success("Password updated successfully! Please sign in with your new password.");
      }
      if (params.get("verified") === "true") {
        toast.success("Email verified successfully! You can now log in.");
      }
    }
  }, []);

  // Mouse cursor spotlight interaction
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
    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Authenticating with Supabase...");

    try {
      await signInUser(email, password);
      toast.success("Welcome back to Studio!", { id: toastId });
      window.location.href = "/dashboard";
    } catch (err: any) {
      const errMsg = err?.message || "";

      // If Supabase complains about unconfirmed email, auto-confirm it and retry
      if (errMsg.toLowerCase().includes("email not confirmed")) {
        toast.info("Verifying your email automatically...", { id: toastId });
        try {
          const confirmRes = await fetch("/api/auth/confirm", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email }),
          });

          if (confirmRes.ok) {
            await signInUser(email, password);
            toast.success("Email verified & logged in!", { id: toastId });
            window.location.href = "/dashboard";
            return;
          }
        } catch {
          // If auto-confirm fails, show original error
        }
      }

      toast.error(errMsg || "Invalid email or password", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handlePasskey = () => {
    toast.info("WebAuthn / Passkey: Please use email & password for this session.");
  };

  const handleEnterpriseSSO = () => {
    toast.info("Enterprise SSO: SAML 2.0 / Okta integration is available for enterprise tiers.");
  };

  const handleForgotPassword = () => {
    setForgotEmail(email.trim());
    setForgotSent(false);
    setResetLink(null);
    setShowForgotModal(true);
  };

  const handleSendResetLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your account email address");
      return;
    }

    setForgotLoading(true);
    const toastId = toast.loading("Dispatching password reset link...");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });

      const contentType = res.headers.get("content-type") || "";
      let result: any = null;
      if (contentType.includes("application/json")) {
        result = await res.json();
      } else {
        await res.text();
        throw new Error(
          res.status === 502 || res.status === 503
            ? "Authentication service is warming up. Please try again shortly."
            : `Server returned unexpected response (${res.status}).`
        );
      }

      if (!res.ok) {
        throw new Error(result?.error || "Failed to send reset email");
      }

      setForgotSent(true);
      if (result?.resetLink) {
        setResetLink(result.resetLink);
      }
      toast.success(result?.message || "Password reset link dispatched!", { id: toastId });
    } catch (err: any) {
      toast.error(err?.message || "Failed to send password reset email", { id: toastId });
    } finally {
      setForgotLoading(false);
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
          {/* Brand Logo & Version Tag */}
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

          {/* Navigation & System Status Indicators */}
          <div className="flex items-center space-x-4 sm:space-x-6 text-xs sm:text-sm">
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 font-mono text-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>PostgreSQL Studio: 99.99%</span>
            </div>
            <Link className="text-slate-400 hover:text-slate-200 transition font-medium hidden sm:inline-block" href="/#features">
              Features
            </Link>
            <Link className="text-slate-400 hover:text-slate-200 transition font-medium hidden sm:inline-block" href="/#docs">
              Docs
            </Link>
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

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-10 lg:py-16 px-6">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT: Focused Authentication Card */}
          <section className="lg:col-span-6 xl:col-span-5 flex justify-center">
            <div className="w-full max-w-md glass-panel shadow-2xl rounded-2xl p-6 sm:p-8 relative overflow-hidden">
              {/* Neon beam at card top */}
              <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-purple-500/80 to-transparent"></div>

              {/* Card Header */}
              <div className="text-center mb-6">
                <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 mx-auto mb-3 shadow-inner shadow-purple-500/20">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-white font-sans">Welcome back</h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-1">Sign in to deploy &amp; orchestrate AI-assisted PostgreSQL schemas</p>
              </div>

              {/* Credentials Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Work Email Address */}
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="email">
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
                      id="email"
                      name="email"
                      placeholder="architect@company.com"
                      required
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-medium text-slate-300" htmlFor="password">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-xs font-medium text-purple-400 hover:text-purple-300 transition cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                    </div>
                    <input
                      className="glass-input block w-full pl-9 pr-10 py-2.5 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono transition"
                      id="password"
                      name="password"
                      placeholder="••••••••••••"
                      required
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {/* Eye Password Visibility Toggle */}
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

                {/* Remember me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center cursor-pointer select-none">
                    <input
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded bg-[#0b0a16] border-white/20 text-purple-600 focus:ring-purple-500 cursor-pointer"
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                    />
                    <span className="ml-2 block text-xs text-slate-300">
                      Keep me signed in for 30 days
                    </span>
                  </label>
                </div>

                {/* Primary Gradient Submit Button */}
                <button
                  disabled={loading}
                  className="w-full mt-2 relative group overflow-hidden rounded-lg p-[1px] font-semibold text-sm transition shadow-lg shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-purple-400 cursor-pointer disabled:opacity-50"
                  type="submit"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-500 transition-all duration-300 group-hover:opacity-90"></div>
                  <div className="relative px-4 py-2.5 rounded-[7px] bg-gradient-to-r from-purple-600 to-indigo-600 flex items-center justify-center space-x-2 text-white font-medium">
                    <span className="tracking-wide">{loading ? "Authenticating..." : "Sign In to Studio"}</span>
                    <svg className="w-4 h-4 text-white transform group-hover:translate-x-1 transition duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M14 5l7 7m0 0l-7 7m7-7H3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                  </div>
                </button>
              </form>

              {/* Alternative Modern Auth: WebAuthn / Passkey */}
              <div className="mt-4 pt-3 border-t border-white/[0.06] text-center">
                <button
                  onClick={handlePasskey}
                  className="inline-flex items-center space-x-2 text-xs text-slate-400 hover:text-purple-300 transition group focus:outline-none cursor-pointer"
                  type="button"
                >
                  <svg className="w-4 h-4 text-purple-400 group-hover:scale-110 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 004 11a7.96 7.96 0 001.328 4.38" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                  </svg>
                  <span>Use Passkey / Touch ID instead</span>
                </button>
              </div>

              {/* Card Bottom Links: Signup & Enterprise SSO */}
              <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                <div>
                  Don&apos;t have an account?{" "}
                  <Link className="text-purple-400 hover:text-purple-300 font-medium underline underline-offset-2" href="/register">
                    Create one
                  </Link>
                </div>
                <button
                  type="button"
                  onClick={handleEnterpriseSSO}
                  className="text-slate-400 hover:text-slate-200 transition cursor-pointer"
                >
                  Enterprise SSO
                </button>
              </div>
            </div>
          </section>

          {/* RIGHT: Interactive Developer Showcase & Live Schema Preview */}
          <section className="hidden lg:block lg:col-span-6 xl:col-span-7 pl-4 xl:pl-8 space-y-6">
            {/* Hero Value Statement */}
            <div className="space-y-3">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
                <span>AI-Powered Relational Engine</span>
              </div>
              <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight font-sans">
                Design, migrate, and simulate <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-400">
                  PostgreSQL in production speed.
                </span>
              </h2>
              <p className="text-sm text-slate-400 max-w-lg leading-relaxed">
                Generate battle-tested DDL schemas, foreign key cascade policies, and RLS security rules directly with structured natural language.
              </p>
            </div>

            {/* Code Preview Terminal with subtle float hover */}
            <div className="rounded-xl border border-white/10 bg-[#080712]/95 backdrop-blur-xl shadow-2xl overflow-hidden font-mono text-xs transition duration-300 hover:border-purple-500/30 animate-float-subtle">
              {/* IDE Window Titlebar */}
              <div className="bg-[#080712] px-4 py-2.5 border-b border-white/[0.07] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></span>
                  <span className="ml-2 text-slate-400 font-sans text-xs">schema.sql — PostgreSQL 16.4</span>
                </div>
                <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                  <span className="text-cyan-400 flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 mr-1.5 animate-ping"></span>
                    Connected: us-east-1
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-white/5 text-slate-300 text-[10px]">3NF Verified</span>
                </div>
              </div>

              {/* Code block preview */}
              <div className="p-4 leading-relaxed overflow-x-auto text-slate-300 space-y-1">
                <div>
                  <span className="text-purple-400 font-semibold">CREATE TABLE</span>{" "}
                  <span className="text-cyan-300 font-medium">public.organizations</span> (
                </div>
                <div className="pl-4 text-slate-400">
                  id <span className="text-indigo-400">uuid</span>{" "}
                  <span className="text-purple-400">PRIMARY KEY DEFAULT</span> gen_random_uuid(),
                </div>
                <div className="pl-4 text-slate-400">
                  slug <span className="text-indigo-400">text</span>{" "}
                  <span className="text-purple-400">UNIQUE NOT NULL</span>,
                </div>
                <div className="pl-4 text-slate-400">
                  plan_tier <span className="text-indigo-400">text</span>{" "}
                  <span className="text-purple-400">DEFAULT</span>{" "}
                  <span className="text-emerald-300">&apos;enterprise&apos;</span>
                </div>
                <div>);</div>
                <div className="pt-1.5">
                  <span className="text-slate-500">-- AI Generated Row Level Security &amp; Indexes</span>
                </div>
                <div>
                  <span className="text-purple-400 font-semibold">ALTER TABLE</span> organizations{" "}
                  <span className="text-purple-400 font-semibold">ENABLE ROW LEVEL SECURITY</span>;
                </div>
                <div>
                  <span className="text-purple-400 font-semibold">CREATE POLICY</span>{" "}
                  <span className="text-emerald-300">&quot;org_member_tenant_isolation&quot;</span>{" "}
                  <span className="text-purple-400 font-semibold">ON</span> organizations
                </div>
                <div className="pl-4">
                  <span className="text-purple-400 font-semibold">FOR ALL USING</span> (auth.uid() IN (
                </div>
                <div className="pl-8 text-slate-400">
                  <span className="text-purple-400 font-semibold">SELECT</span> user_id FROM memberships WHERE org_id = id
                </div>
                <div className="pl-4">));</div>
              </div>

              {/* Terminal status footer */}
              <div className="bg-[#080712]/90 border-t border-white/[0.05] px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 font-sans">
                <span className="flex items-center text-emerald-400">
                  <svg className="w-3.5 h-3.5 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                    <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
                  </svg>
                  Schema verified &amp; ready to migrate
                </span>
                <span className="text-slate-500 font-mono text-[10px]">Zero migration downtime</span>
              </div>
            </div>

            {/* CTO Testimonial Quote */}
            <div className="rounded-xl border border-white/10 bg-[#110f22]/70 backdrop-blur-md p-4 flex items-center space-x-3.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-500 to-cyan-500 p-0.5 shrink-0">
                <div className="w-full h-full rounded-full bg-[#07060d] flex items-center justify-center text-xs font-bold text-white">
                  SC
                </div>
              </div>
              <div className="text-xs">
                <p className="text-slate-300 italic">
                  &ldquo;DB-Generator cut our database schema modeling and migration pipeline from entire sprints down to just a few minutes.&rdquo;
                </p>
                <div className="text-slate-400 font-medium mt-1">
                  <span className="text-white font-medium">Sarah Chen</span> — CTO at PolyScale Labs
                </div>
              </div>
            </div>

            {/* Security Badges Row */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-400">
              <span className="flex items-center space-x-1.5 py-2 px-3 rounded-lg bg-white/[0.02] border border-white/5">
                <svg className="w-3.5 h-3.5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                <span>SOC-2 Type II Certified</span>
              </span>
              <span className="flex items-center space-x-1.5 py-2 px-3 rounded-lg bg-white/[0.02] border border-white/5">
                <svg className="w-3.5 h-3.5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                <span>End-to-End Encrypted</span>
              </span>
              <span className="flex items-center space-x-1.5 py-2 px-3 rounded-lg bg-white/[0.02] border border-white/5">
                <svg className="w-3.5 h-3.5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                </svg>
                <span>Zero-Telemetry Local Key Storage</span>
              </span>
            </div>
          </section>
        </div>
      </main>

      {/* Main Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-[#07060d]/70 backdrop-blur-md px-6 sm:px-8 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <span>© 2026 DB-Generator, Inc. All rights reserved.</span>
            <span className="text-slate-700 hidden sm:inline">•</span>
            <span className="hidden sm:inline text-slate-400">Obsidian Nebula Release</span>
          </div>

          <div className="flex items-center space-x-5">
            <Link className="hover:text-slate-300 transition" href="/#docs">Terms</Link>
            <Link className="hover:text-slate-300 transition" href="/#docs">Privacy Policy</Link>
            <Link className="hover:text-slate-300 transition" href="/#docs">Security Whitepaper</Link>
            <span className="inline-flex items-center space-x-1 text-slate-400">
              <svg className="w-3.5 h-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                <path clipRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" fillRule="evenodd"></path>
              </svg>
              <span>Cloudflare Protected</span>
            </span>
          </div>
        </div>
      </footer>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0f1322] border border-white/10 shadow-2xl overflow-hidden p-6 sm:p-7 text-left space-y-5">
            {/* Header accent gradient */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500"></div>

            <div className="flex items-start justify-between">
              <div>
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-mono font-medium mb-2">
                  <span>🔑</span>
                  <span>Account Recovery</span>
                </div>
                <h3 className="text-xl font-bold text-white tracking-tight">Reset Password</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enter your email address to receive a secure password recovery link.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="text-slate-400 hover:text-white transition p-1 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {forgotSent ? (
              <div className="space-y-4 py-2">
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 space-y-1">
                  <div className="font-semibold flex items-center space-x-1.5">
                    <span>✓</span>
                    <span>Reset email dispatched!</span>
                  </div>
                  <p className="text-slate-300">
                    We sent a recovery link to <span className="font-mono text-white font-medium">{forgotEmail}</span>. Click the link in your inbox to set a new password.
                  </p>
                </div>

                {resetLink && (
                  <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40 space-y-2">
                    <div className="text-xs font-semibold text-purple-300 flex items-center space-x-1">
                      <span>🚀</span>
                      <span>Direct Recovery Link (Sandbox / Dev Mode)</span>
                    </div>
                    <p className="text-[11px] text-slate-400">
                      Testing locally or in Resend sandbox? You can open the password reset page directly:
                    </p>
                    <a
                      href={resetLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-2 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold text-center transition shadow-md shadow-purple-600/30"
                    >
                      Open Password Reset Page →
                    </a>
                  </div>
                )}

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForgotSent(false);
                      setResetLink(null);
                    }}
                    className="flex-1 py-2 px-3 rounded-lg border border-white/10 hover:border-white/20 bg-slate-800/40 hover:bg-slate-800 text-xs text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    Resend link
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2 px-3 rounded-lg bg-white/10 hover:bg-white/15 text-xs text-white font-medium transition cursor-pointer"
                  >
                    Back to Sign In
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSendResetLink} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="forgot-email">
                    Account Email
                  </label>
                  <div className="relative rounded-lg shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                      </svg>
                    </div>
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="alex.chen@enterprise.io"
                      className="glass-input block w-full pl-9 pr-3 py-2.5 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono transition"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="flex-1 py-2.5 px-3 rounded-lg border border-white/10 hover:border-white/20 bg-slate-800/40 hover:bg-slate-800 text-xs font-medium text-slate-300 hover:text-white transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="flex-1 py-2.5 px-3 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-purple-600/30 transition disabled:opacity-50 cursor-pointer text-center"
                  >
                    {forgotLoading ? "Sending link..." : "Send Reset Link →"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
