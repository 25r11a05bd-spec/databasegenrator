"use client";

import React from "react";

export default function HowItWorks() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10" id="how-it-works">
      <div className="reveal-scale glass-frosted rounded-3xl p-8 sm:p-12 border border-purple-500/30 relative overflow-hidden">
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl pointer-events-none"></div>
        <div className="max-w-2xl mb-12">
          <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">How It Works</span>
          <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-white mt-1">
            From idea to schema in 4 clear steps
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div
            className="reveal-left step-card relative z-10 bg-[#0c0a18]/90 border border-purple-500/30 rounded-2xl p-6 shadow-floating flex flex-col justify-between hover:border-purple-400/70 hover:-translate-y-1.5 transition-all duration-300"
            style={{ transitionDelay: "100ms" }}
          >
            <div>
              <div className="step-badge w-14 h-14 rounded-2xl bg-purple-950 border border-purple-400/40 text-purple-300 text-2xl flex items-center justify-center mb-5 shadow-glow-violet">
                💬
              </div>
              <div className="text-xs font-mono text-purple-400 mb-1 font-semibold">STEP 01</div>
              <h4 className="text-lg font-display font-bold text-white mb-2">Tell Us What You Need</h4>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Write a description of your database: &apos;E-commerce platform with products, orders, users, and inventory&apos;. Our AI understands complex relationships, normalizes data, and asks clarifying questions.
              </p>
            </div>
            <div className="text-[10px] font-mono text-slate-400 bg-[#070611] p-2 rounded border border-purple-500/20">
              Natural language understanding
            </div>
          </div>

          {/* Step 2 */}
          <div
            className="reveal-left step-card relative z-10 bg-[#0c0a18]/90 border border-cyan-500/30 rounded-2xl p-6 shadow-floating flex flex-col justify-between hover:border-cyan-400/70 hover:-translate-y-1.5 transition-all duration-300"
            style={{ transitionDelay: "200ms" }}
          >
            <div>
              <div className="step-badge w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-400/40 text-cyan-300 text-2xl flex items-center justify-center mb-5 shadow-glow-cyan">
                👁️
              </div>
              <div className="text-xs font-mono text-cyan-400 mb-1 font-semibold">STEP 02</div>
              <h4 className="text-lg font-display font-bold text-white mb-2">See Your Schema</h4>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                View tables, columns, data types, and relationships in real-time. Edit inline, adjust constraints, refine with new prompts. Everything updates instantly.
              </p>
            </div>
            <div className="text-[10px] font-mono text-slate-400 bg-[#070611] p-2 rounded border border-cyan-500/20">
              Live interactive canvas
            </div>
          </div>

          {/* Step 3 */}
          <div
            className="reveal-left step-card relative z-10 bg-[#0c0a18]/90 border border-purple-500/30 rounded-2xl p-6 shadow-floating flex flex-col justify-between hover:border-purple-400/70 hover:-translate-y-1.5 transition-all duration-300"
            style={{ transitionDelay: "300ms" }}
          >
            <div>
              <div className="step-badge w-14 h-14 rounded-2xl bg-indigo-950 border border-indigo-400/40 text-indigo-300 text-2xl flex items-center justify-center mb-5 shadow-glow-violet">
                🚀
              </div>
              <div className="text-xs font-mono text-indigo-400 mb-1 font-semibold">STEP 03</div>
              <h4 className="text-lg font-display font-bold text-white mb-2">Launch to Production</h4>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                One click creates all tables in your Supabase PostgreSQL database. Get connection strings, configure your ORM, start building. Your database is live.
              </p>
            </div>
            <div className="text-[10px] font-mono text-slate-400 bg-[#070611] p-2 rounded border border-purple-500/20">
              Instant DDL execution
            </div>
          </div>

          {/* Step 4 */}
          <div
            className="reveal-left step-card relative z-10 bg-[#0c0a18]/90 border border-cyan-500/30 rounded-2xl p-6 shadow-floating flex flex-col justify-between hover:border-cyan-400/70 hover:-translate-y-1.5 transition-all duration-300"
            style={{ transitionDelay: "400ms" }}
          >
            <div>
              <div className="step-badge w-14 h-14 rounded-2xl bg-cyan-950 border border-cyan-400/40 text-cyan-300 text-2xl flex items-center justify-center mb-5 shadow-glow-cyan">
                🔗
              </div>
              <div className="text-xs font-mono text-cyan-400 mb-1 font-semibold">STEP 04</div>
              <h4 className="text-lg font-display font-bold text-white mb-2">Use in Your Project</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                Copy connection strings -&gt; Paste in your .env -&gt; Start coding. Supports Next.js/React, Express/Node.js, Python/FastAPI, Go/Rust.
              </p>
            </div>
            <div className="text-[10px] font-mono text-emerald-400 bg-[#070611] p-2 rounded border border-cyan-500/20 mt-4">
              Prisma, Drizzle, TypeORM, Raw SQL
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
