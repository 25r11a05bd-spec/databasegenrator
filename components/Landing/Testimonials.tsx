"use client";

import React from "react";

export default function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10" id="social-proof">
      <div className="reveal-item text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">Social Proof</span>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white mt-2 tracking-tight">
          Loved by developers worldwide
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Testimonial 1 */}
        <div
          className="reveal-item glass-frosted p-6 sm:p-8 rounded-3xl border border-purple-500/40 shadow-glow-violet relative flex flex-col justify-between hover:-translate-y-2 hover:border-purple-400 transition-all duration-300 group"
          style={{ transitionDelay: "50ms" }}
        >
          <div>
            <div className="flex items-center space-x-1 text-amber-400 mb-4 text-sm group-hover:scale-105 transition-transform origin-left">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <blockquote className="text-slate-200 text-sm sm:text-base italic leading-relaxed mb-6 font-normal">
              &quot;DB-Generator cut our database setup time from hours to minutes. The AI understands exactly what we need.&quot;
            </blockquote>
          </div>
          <div className="flex items-center space-x-4 pt-4 border-t border-slate-800/80">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-glow-violet group-hover:scale-110 transition-transform">
              SC
            </div>
            <div>
              <div className="text-sm font-bold text-white font-display">Sarah Chen</div>
              <div className="text-xs text-purple-300 font-mono">Startup CTO</div>
            </div>
          </div>
        </div>

        {/* Testimonial 2 */}
        <div
          className="reveal-item glass-frosted p-6 sm:p-8 rounded-3xl border border-purple-500/40 shadow-glow-violet relative flex flex-col justify-between hover:-translate-y-2 hover:border-cyan-400 transition-all duration-300 group"
          style={{ transitionDelay: "150ms" }}
        >
          <div>
            <div className="flex items-center space-x-1 text-amber-400 mb-4 text-sm group-hover:scale-105 transition-transform origin-left">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <blockquote className="text-slate-200 text-sm sm:text-base italic leading-relaxed mb-6 font-normal">
              &quot;Finally, a tool that generates databases as well as any DBA. Brilliant for prototyping.&quot;
            </blockquote>
          </div>
          <div className="flex items-center space-x-4 pt-4 border-t border-slate-800/80">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-600 to-teal-600 flex items-center justify-center font-bold text-white shadow-glow-cyan group-hover:scale-110 transition-transform">
              MR
            </div>
            <div>
              <div className="text-sm font-bold text-white font-display">Marcus Rodriguez</div>
              <div className="text-xs text-purple-300 font-mono">Full-stack Developer</div>
            </div>
          </div>
        </div>

        {/* Testimonial 3 */}
        <div
          className="reveal-item glass-frosted p-6 sm:p-8 rounded-3xl border border-purple-500/40 shadow-glow-violet relative flex flex-col justify-between hover:-translate-y-2 hover:border-purple-400 transition-all duration-300 group"
          style={{ transitionDelay: "250ms" }}
        >
          <div>
            <div className="flex items-center space-x-1 text-amber-400 mb-4 text-sm group-hover:scale-105 transition-transform origin-left">
              <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
            </div>
            <blockquote className="text-slate-200 text-sm sm:text-base italic leading-relaxed mb-6 font-normal">
              &quot;No more fighting with SQL syntax. This is how database design should work in 2025.&quot;
            </blockquote>
          </div>
          <div className="flex items-center space-x-4 pt-4 border-t border-slate-800/80">
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center font-bold text-white shadow-glow-cyan group-hover:scale-110 transition-transform">
              PP
            </div>
            <div>
              <div className="text-sm font-bold text-white font-display">Priya Patel</div>
              <div className="text-xs text-cyan-300 font-mono">Tech Lead</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
