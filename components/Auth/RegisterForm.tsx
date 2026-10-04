"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import "@/styles/auth.css";

const LOADING_STEPS = [
  "Generating database credentials...",
  "Dispatching verification email via Resend...",
  "Securing your schema workspace...",
];

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);
  const [verificationSent, setVerificationSent] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [devVerificationLink, setDevVerificationLink] = useState<string | null>(null);

  // Spotlight mouse effect
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

  // Cycle loading steps smoothly
  useEffect(() => {
    if (!loading) {
      setLoadingStepIdx(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStepIdx((prev) => (prev + 1) % LOADING_STEPS.length);
    }, 1400);
    return () => clearInterval(interval);
  }, [loading]);

  // Resend cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const contentType = res.headers.get("content-type") || "";
      let result: any = null;
      if (contentType.includes("application/json")) {
        result = await res.json();
      } else {
        await res.text();
        throw new Error(
          res.status === 502 || res.status === 503
            ? "Authentication service is warming up. Please try again in a few moments."
            : `Server returned an unexpected response (${res.status}). Please try again.`
        );
      }

      if (!res.ok) {
        throw new Error(result?.error || "Registration failed");
      }

      if (result?.verificationLink) {
        setDevVerificationLink(result.verificationLink);
      }

      setVerificationSent(true);
      toast.success(
        result?.message || "Verification email dispatched via Resend! Check your inbox."
      );
    } catch (err: any) {
      toast.error(err?.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    const toastId = toast.loading("Sending fresh verification email via Resend...");

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const contentType = res.headers.get("content-type") || "";
      let result: any = null;
      if (contentType.includes("application/json")) {
        result = await res.json();
      } else {
        await res.text();
        throw new Error(
          res.status === 502 || res.status === 503
            ? "Authentication service is warming up. Please try again in a few moments."
            : `Server returned an unexpected response (${res.status}). Please try again.`
        );
      }

      if (!res.ok) {
        throw new Error(result?.error || "Failed to resend email");
      }

      if (result?.verificationLink) {
        setDevVerificationLink(result.verificationLink);
      }

      setCooldown(30);
      toast.success(result?.message || "Fresh verification email sent!", { id: toastId });
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to resend verification email", { id: toastId });
    } finally {
      setResending(false);
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
            <div className="w-full max-w-md glass-panel shadow-2xl rounded-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-500">
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-purple-500/80 to-transparent"></div>

              {/* Shimmer laser sweep during loading */}
              {loading && (
                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-purple-400 via-cyan-400 to-indigo-400 animate-shimmer-sweep"></div>
              )}

              {/* STATE 1: LOADING ANIMATION */}
              {loading ? (
                <div className="py-10 flex flex-col items-center justify-center text-center space-y-6">
                  {/* Cosmic Orbital Loader */}
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    {/* Outer Ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-purple-500 border-r-indigo-500 border-b-cyan-400/40 animate-spin-clockwise"></div>

                    {/* Inner Counter-Rotating Ring */}
                    <div className="absolute inset-3 rounded-full border-2 border-transparent border-t-pink-500 border-l-purple-400 animate-spin-counter"></div>

                    {/* Glowing Core */}
                    <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg animate-pulse-core">
                      <svg className="w-6 h-6 text-purple-200" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"></path>
                      </svg>
                    </div>

                    {/* Satellite Orbit Particle */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] animate-nebula-orbit"></div>
                    </div>
                  </div>

                  {/* Status Text & Step Progress */}
                  <div className="space-y-2 max-w-xs">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                      <span>Resend Mail Engine Active</span>
                    </div>

                    <h3 className="text-lg font-semibold text-white tracking-tight">
                      Creating Your Account
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-400 transition-all duration-300 min-h-[40px] flex items-center justify-center">
                      {LOADING_STEPS[loadingStepIdx]}
                    </p>
                  </div>

                  {/* Subtle Loading Bar */}
                  <div className="w-48 h-1 rounded-full bg-slate-800 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-purple-500 via-cyan-400 to-indigo-500 rounded-full animate-gradient-flow w-full"></div>
                  </div>
                </div>
              ) : verificationSent ? (
                /* STATE 2: VERIFICATION SENT VIEW */
                <div className="py-6 flex flex-col items-center text-center space-y-5 animate-in fade-in zoom-in-95 duration-400">
                  {/* Animated Mail Icon with Ripple Rings */}
                  <div className="relative flex items-center justify-center w-20 h-20">
                    <div className="absolute inset-0 rounded-full bg-purple-600/20 animate-ripple-wave"></div>
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-purple-400 p-[1px] shadow-xl shadow-purple-500/30">
                      <div className="w-full h-full bg-[#0c0e1b] rounded-[15px] flex items-center justify-center text-purple-300">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                          <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round"></path>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
                      <span>✓</span>
                      <span>Verification Link Dispatched</span>
                    </div>
                    <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
                      Check your email
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-400 max-w-sm">
                      We dispatched a verification email via <strong>Resend</strong> to:
                    </p>
                  </div>

                  {/* Target Email Display */}
                  <div className="w-full p-3 rounded-lg bg-[#141829] border border-purple-500/20 text-xs font-mono text-purple-300 text-center break-all shadow-inner">
                    {email}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                    Please click the verification link inside the email to activate your account. You can then log in to access the studio.
                  </p>

                  {devVerificationLink && (
                    <div className="w-full p-3 rounded-lg bg-purple-950/40 border border-purple-500/40 text-left space-y-2">
                      <div className="flex items-center space-x-1.5 text-xs font-semibold text-purple-300">
                        <span>🚀</span>
                        <span>Direct Activation Link (Sandbox / Dev Mode)</span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        If Resend testing mode restricts delivery to your inbox, activate immediately with this link:
                      </p>
                      <a
                        href={devVerificationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block w-full py-1.5 px-3 rounded bg-purple-600/80 hover:bg-purple-600 text-white text-xs font-medium text-center transition"
                      >
                        Verify Email &amp; Activate Account →
                      </a>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="w-full space-y-3 pt-2">
                    <Link
                      className="block w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm transition shadow-lg shadow-purple-600/30 text-center"
                      href="/login"
                    >
                      Proceed to Sign In →
                    </Link>

                    <button
                      disabled={resending || cooldown > 0}
                      onClick={handleResend}
                      type="button"
                      className="w-full py-2 px-3 rounded-lg border border-white/10 hover:border-purple-500/40 bg-slate-800/40 hover:bg-slate-800/80 text-xs font-medium text-slate-300 hover:text-white transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {resending
                        ? "Resending..."
                        : cooldown > 0
                        ? `Resend available in ${cooldown}s`
                        : "Resend verification email"}
                    </button>

                    <button
                      onClick={() => setVerificationSent(false)}
                      type="button"
                      className="text-xs text-slate-400 hover:text-slate-200 transition underline underline-offset-2 cursor-pointer pt-1"
                    >
                      Entered the wrong email? Start over
                    </button>
                  </div>
                </div>
              ) : (
                /* STATE 3: REGISTRATION INPUT FORM */
                <div>
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
                        <span className="tracking-wide">Create Studio Account</span>
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
              )}
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
