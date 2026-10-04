"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import NebulaShader from '@/components/Dashboard/NebulaShader';
import '@/styles/nebula-dashboard.css';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [loading, user, router]);

  const navItems = [
    { label: "Home", href: "/dashboard" },
    { label: "Schema Builder", href: "/dashboard/schema" },
    { label: "My Databases", href: "/dashboard/databases" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07060e] flex items-center justify-center relative overflow-hidden">
        <NebulaShader />
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin" />
          <span className="text-sm font-mono text-purple-300">Loading DB-Generator Studio...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#07060e] text-slate-100 flex flex-col justify-between relative overflow-x-hidden selection:bg-purple-500/30 selection:text-white">
      {/* WebGL Shader Full-Bleed Animated Background */}
      <NebulaShader />

      {/* TOP NAVIGATION BAR */}
      <header className="w-full border-b border-[#2b2746]/40 bg-[#07060e]/70 backdrop-blur-xl sticky top-0 z-50 transition-all">
        <div className="max-w-[1360px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <Link className="flex items-center gap-2 group cursor-pointer" href="/dashboard">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-700 flex items-center justify-center shadow-[0_0_16px_rgba(139,92,246,0.5)] group-hover:shadow-[0_0_22px_rgba(168,85,247,0.7)] transition-all duration-300">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
              </svg>
            </div>
            <span className="font-bold text-[18px] tracking-tight text-white flex items-center">
              DB-<span className="bg-gradient-to-r from-purple-400 via-violet-300 to-cyan-300 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-cyan-200 transition-colors">Generator</span>
            </span>
          </Link>

          {/* Center Navigation Pills */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-[#0d0c18]/90 border border-[#2b2746]/50 shadow-inner backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-violet-600/25 text-purple-300 border border-violet-500/40 shadow-[0_0_12px_rgba(139,92,246,0.25)] hover:text-white font-semibold"
                      : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right User Container & Sign Out */}
          <div className="flex items-center gap-3">
            {user?.email && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0d0c18]/70 border border-[#2b2746]/40 text-[12px] font-mono text-gray-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-gray-300 hover:text-white transition-colors truncate max-w-[200px]">
                  {user.email}
                </span>
              </div>
            )}
            <button
              onClick={signOut}
              disabled={loading}
              className="px-3.5 py-1.5 rounded-lg border border-[#2b2746]/60 bg-[#131122]/60 hover:bg-[#19172d] hover:border-purple-400/40 text-slate-200 text-[13px] font-medium transition-all duration-200 hover:shadow-[0_0_12px_rgba(139,92,246,0.15)] flex items-center gap-1.5 cursor-pointer"
            >
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT CONTENT */}
      <main className="flex-1 w-full relative z-10 flex flex-col">
        {children}
      </main>

      {/* CLEAN MINIMAL FOOTER */}
      <footer className="w-full border-t border-[#2b2746]/25 py-6 bg-[#07060e]/60 backdrop-blur-md relative z-10">
        <div className="max-w-[1360px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400/70"></span>
            <span>DB-Generator • PostgreSQL 16.4</span>
          </div>
          <div className="flex items-center gap-6 font-mono">
            <span className="text-gray-400">Zero Schema Drift</span>
            <span className="text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Supabase Connected
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
