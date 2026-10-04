"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-4 z-50 px-4 sm:px-6 max-w-7xl mx-auto transition-all duration-300" id="main-nav-header">
      <div
        className={`rounded-2xl px-4 py-2.5 sm:px-6 shadow-glow-violet shadow-black/40 flex items-center justify-between transition-all duration-300 ${
          isScrolled
            ? "bg-[#070611]/90 shadow-2xl backdrop-blur-2xl border border-purple-500/40"
            : "glass-frosted"
        }`}
        id="main-nav-inner"
      >
        {/* Left: Logo & Icon */}
        <Link className="flex items-center space-x-3 group" href="/">
          <div className="w-8 h-8 rounded-lg shadow-glow-violet bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white text-base group-hover:scale-105 transition-transform duration-300 border border-purple-400/40">
            ⚡
          </div>
          <div className="flex items-baseline space-x-1.5">
            <span className="font-display font-extrabold text-base sm:text-lg text-white tracking-tight group-hover:text-purple-300 transition-colors">
              DB-Generator
            </span>
            <span className="text-[10px] font-mono font-semibold text-purple-400 bg-purple-950/60 px-1.5 py-0.5 rounded border border-purple-500/30 group-hover:border-purple-400/60 transition-colors">
              STUDIO
            </span>
          </div>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-300">
          <a className="hover:text-purple-300 transition-colors flex items-center gap-1.5 relative group" href="#features">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 group-hover:scale-125 transition-transform"></span> Features
          </a>
          <a className="hover:text-purple-300 transition-colors" href="#how-it-works">How It Works</a>
          <a className="hover:text-purple-300 transition-colors" href="#comparison">Comparison</a>
          <a className="hover:text-purple-300 transition-colors" href="#social-proof">Social Proof</a>
          <a className="hover:text-purple-300 transition-colors" href="#docs">Docs</a>
        </nav>

        {/* Right: Action CTAs */}
        <div className="flex items-center space-x-3">
          <Link
            className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-2 py-1.5 transition"
            href="/login"
          >
            Sign In
          </Link>
          <Link
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-glow-violet border border-purple-400/40 transition-all duration-300 transform active:scale-95 hover:scale-[1.03]"
            href="/dashboard/schema"
          >
            <span>Start Building Free</span>
            <span className="text-purple-200 transition-transform duration-300 inline-block group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
