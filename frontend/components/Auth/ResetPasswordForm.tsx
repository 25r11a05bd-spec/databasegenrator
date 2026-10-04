"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateUserPassword, supabase } from "@/lib/auth/supabaseAuth";
import { toast } from "sonner";
import "@/styles/auth.css";

export default function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter();

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

  // Check URL params for email or recovery token
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const emailParam = searchParams.get("email");
      if (emailParam) {
        setEmail(emailParam);
      }

      // Check current session from Supabase
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user?.email) {
          setEmail(session.user.email);
        }
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match. Please re-check.");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating your password...");

    try {
      let updatedSuccessfully = false;

      // 1. Try client-side Supabase updateUser (works if user followed recovery link with session hash)
      try {
        await updateUserPassword(password);
        updatedSuccessfully = true;
      } catch (clientErr: any) {
        console.warn("Client-side password update deferred to server:", clientErr?.message);
      }

      // 2. Also ensure server-side update via API route if email is known
      if (!updatedSuccessfully || email) {
        const res = await fetch("/api/auth/update-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password, email: email.trim() }),
        });

        if (res.ok) {
          updatedSuccessfully = true;
        } else if (!updatedSuccessfully) {
          const contentType = res.headers.get("content-type") || "";
          let errData: any = {};
          if (contentType.includes("application/json")) {
            errData = await res.json();
          }
          throw new Error(errData?.error || "Failed to update password");
        }
      }

      toast.success("Password updated successfully! Redirecting to sign in...", { id: toastId });
      setTimeout(() => {
        window.location.href = "/login?password_reset=true";
      }, 1200);
    } catch (err: any) {
      toast.error(err?.message || "Failed to update password. Please request a fresh reset link.", {
        id: toastId,
      });
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
                  Security Recovery
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center space-x-4 text-xs sm:text-sm">
            <Link className="text-slate-400 hover:text-white transition" href="/login">
              Back to Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          <div className="relative rounded-2xl bg-[#0f1322]/90 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden p-7 sm:p-9 space-y-6">
            {/* Top gradient highlight */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500"></div>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 mx-auto shadow-inner shadow-purple-500/20">
                <svg className="w-6 h-6 text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
                Set New Password
              </h1>
              <p className="text-xs text-slate-400">
                {email
                  ? `Choose a secure new password for ${email}`
                  : "Enter a strong new password for your DB-Generator account."}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* New Password */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="new-password">
                  New Password
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                  </div>
                  <input
                    id="new-password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="glass-input block w-full pl-9 pr-10 py-2.5 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition cursor-pointer"
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

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5" htmlFor="confirm-password">
                  Confirm New Password
                </label>
                <div className="relative rounded-lg shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                    </svg>
                  </div>
                  <input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your new password"
                    className="glass-input block w-full pl-9 pr-10 py-2.5 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none font-mono transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition cursor-pointer"
                  >
                    {showConfirmPassword ? (
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

              {/* Password strength indicator */}
              <div className="pt-1">
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <span className={`inline-block w-2 h-2 rounded-full ${password.length >= 6 ? "bg-emerald-400" : "bg-slate-600"}`}></span>
                  <span>Minimum 6 characters</span>
                  {password && confirmPassword && (
                    <span className={`ml-auto font-mono ${password === confirmPassword ? "text-emerald-400" : "text-amber-400"}`}>
                      {password === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                    </span>
                  )}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || password.length < 6 || password !== confirmPassword}
                className="w-full mt-4 py-2.5 px-4 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-medium text-sm transition shadow-lg shadow-purple-600/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer text-center"
              >
                {loading ? "Updating Password..." : "Update Password & Continue →"}
              </button>
            </form>

            <div className="text-center pt-2">
              <Link href="/login" className="text-xs text-slate-400 hover:text-purple-300 transition">
                Remember your password? Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/[0.06] bg-[#07060d]/70 backdrop-blur-md px-6 sm:px-8 py-4 text-xs text-slate-500 text-center">
        <span>© 2026 DB-Generator Studio. End-to-End Cryptographic Security.</span>
      </footer>
    </div>
  );
}
