"use client";

import React from "react";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
      <div className="reveal-scale relative rounded-3xl bg-gradient-to-b from-purple-900/50 via-[#0c0a18]/95 to-[#070611] p-8 sm:p-14 text-center border border-purple-500/40 cta-glow-box overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white tracking-tight mb-4">
            Ready to Ship Faster?
          </h2>
          <p className="text-slate-300 text-base sm:text-lg mb-8 leading-relaxed">
            Create your first database schema today. Deploy to Supabase in 2 minutes.
          </p>

          {/* Primary Button with subtext */}
          <div className="mb-8">
            <Link
              className="inline-flex px-8 py-4 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-glow-violet border border-purple-400/40 transition-all duration-300 active:scale-95 text-base btn-pulse-glow"
              href="/dashboard/schema"
            >
              Start Building Free →
            </Link>
            <p className="text-xs text-purple-300 font-mono mt-2">Join 500+ Developers</p>
          </div>

          {/* Integrated quick email signup or GitHub / Supabase auth shortcut */}
          <div className="max-w-md mx-auto space-y-3 pt-4 border-t border-purple-900/40">
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                className="flex-1 bg-[#070611]/90 border border-purple-500/40 rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 font-mono transition-all duration-200"
                placeholder="Enter work email..."
                type="email"
              />
              <Link
                href="/dashboard/schema"
                className="px-6 py-3 rounded-xl font-semibold text-white bg-purple-600 hover:bg-purple-500 border border-purple-400/40 transition-all duration-200 active:scale-95 whitespace-nowrap text-sm hover:shadow-glow-violet flex items-center justify-center"
              >
                Get Started Free →
              </Link>
            </form>

            <div className="flex items-center justify-center space-x-4 pt-2 text-xs text-slate-400 font-mono">
              <span className="text-slate-500">Or continue with</span>
              <Link
                className="flex items-center space-x-1 text-slate-300 hover:text-white glass-frosted px-2.5 py-1 rounded-lg border border-slate-700/60 hover:border-slate-500 transition-colors"
                href="/login"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"></path>
                </svg>
                <span>GitHub</span>
              </Link>
              <Link
                className="flex items-center space-x-1 text-slate-300 hover:text-white glass-frosted px-2.5 py-1 rounded-lg border border-slate-700/60 hover:border-emerald-500/60 transition-colors"
                href="/login"
              >
                <span className="font-bold text-emerald-400">⚡</span>
                <span>Supabase Auth</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
