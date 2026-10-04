"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-purple-950/60 bg-[#070611] text-slate-400 text-xs py-14 relative z-10" id="docs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Row: Brand & Status */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 rounded-md bg-purple-600 flex items-center justify-center text-white font-bold text-xs">
              ⚡
            </div>
            <span className="font-bold text-slate-200 text-sm">DB-Generator</span>
            <span className="text-slate-600">/</span>
            <span className="text-slate-400">PostgreSQL Spatial Schema Studio</span>
          </div>
          <div className="flex items-center space-x-2 bg-[#0c0a18] px-3 py-1.5 rounded-full border border-purple-950 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-slate-300">All systems operational (Postgres v16.4)</span>
          </div>
        </div>

        {/* Middle Grid: Links & Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8 border-b border-slate-900">
          {/* Links: Product */}
          <div>
            <div className="font-bold text-white text-xs uppercase tracking-wider font-mono mb-4">Product</div>
            <ul className="space-y-2.5">
              <li><a className="footer-link hover:text-purple-300" href="#features">Features</a></li>
              <li><Link className="footer-link hover:text-purple-300" href="/dashboard/schema">Schema Studio</Link></li>
              <li><Link className="footer-link hover:text-purple-300" href="/dashboard/databases">My Databases</Link></li>
            </ul>
          </div>

          {/* Links: Company */}
          <div>
            <div className="font-bold text-white text-xs uppercase tracking-wider font-mono mb-4">Company</div>
            <ul className="space-y-2.5">
              <li><a className="footer-link hover:text-purple-300" href="#about">About</a></li>
              <li><a className="footer-link hover:text-purple-300" href="#blog">Blog</a></li>
              <li><a className="footer-link hover:text-purple-300" href="https://github.com" rel="noreferrer" target="_blank">GitHub</a></li>
              <li><a className="footer-link hover:text-purple-300" href="https://twitter.com" rel="noreferrer" target="_blank">Twitter</a></li>
            </ul>
          </div>

          {/* Links: Legal */}
          <div>
            <div className="font-bold text-white text-xs uppercase tracking-wider font-mono mb-4">Legal</div>
            <ul className="space-y-2.5">
              <li><a className="footer-link hover:text-purple-300" href="#privacy">Privacy Policy</a></li>
              <li><a className="footer-link hover:text-purple-300" href="#terms">Terms of Service</a></li>
              <li><a className="footer-link hover:text-purple-300" href="#contact">Contact</a></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <div className="font-bold text-white text-xs uppercase tracking-wider font-mono mb-2">Stay Updated</div>
            <p className="text-slate-400 mb-3 text-[11px]">Get new features and database tips in your inbox</p>
            <form className="flex flex-col gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                className="bg-[#0c0a18] border border-slate-800 rounded-lg px-3 py-2 text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono transition-all duration-200"
                placeholder="you@example.com"
                type="email"
              />
              <button
                className="px-3 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-mono font-semibold text-xs transition active:scale-95 cursor-pointer"
                type="submit"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Row: Copyright & Bottom CTA button */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-4">
          <p>© 2026 DB-Generator Inc. All rights reserved. Designed for PostgreSQL and Supabase workflows.</p>
          <Link
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-glow-violet border border-purple-400/40 transition-all duration-300 active:scale-95 hover:scale-105"
            href="/dashboard/schema"
          >
            Get Started Free →
          </Link>
        </div>
      </div>
    </footer>
  );
}
