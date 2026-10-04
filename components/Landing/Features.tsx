"use client";

import React from "react";
import Link from "next/link";

export default function Features() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10" id="features">
      <div className="reveal-item text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
          Engineered For Modern Data Architects
        </span>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white mt-2 tracking-tight">
          Production-grade schema capabilities
        </h2>
        <p className="text-slate-400 mt-3 text-base sm:text-lg">
          Skip handcrafted DDL scripts and misaligned schemas. Model relations with tactical precision.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Feature 1: AI Understands Your Database */}
        <div
          className="reveal-item feature-card glass-frosted p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-glow-violet"
          style={{ transitionDelay: "50ms" }}
        >
          <div>
            <div className="feature-icon w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center mb-5 text-2xl shadow-glow-violet">
              🤖
            </div>
            <h3 className="text-lg font-display font-bold text-white mb-2">AI Understands Your Database</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Describe your database in plain English. Our AI parses your requirements, asks clarifying questions, and generates a normalized schema—no SQL required.
            </p>
          </div>
          <div className="bg-[#070611]/90 p-2.5 rounded-lg border border-purple-500/30 text-[11px] font-mono text-purple-300">
            <span className="text-slate-500">Input:</span> &quot;Blog with posts, comments, and user profiles&quot;{" "}
            <span className="text-emerald-400">→ Auto-generated schema with relationships</span>
          </div>
        </div>

        {/* Feature 2: Drag-and-Drop Canvas */}
        <div
          className="reveal-item feature-card glass-frosted p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-glow-cyan"
          style={{ transitionDelay: "150ms" }}
        >
          <div>
            <div className="feature-icon w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center mb-5 text-2xl shadow-glow-cyan">
              🎨
            </div>
            <h3 className="text-lg font-display font-bold text-white mb-2">Drag-and-Drop Canvas</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Build schemas visually. Drag tables, define columns, draw relationships. Real-time visualization shows exactly what you&apos;re creating.
            </p>
          </div>
          <div className="bg-[#070611]/90 p-2.5 rounded-lg border border-cyan-500/30 text-[11px] font-mono text-cyan-300 space-y-1">
            <div>• Intuitive React Flow canvas</div>
            <div>• Right-click to add columns &amp; auto-detect M:N relationships</div>
            <div>• Instant schema preview</div>
          </div>
        </div>

        {/* Feature 3: Deploy to Supabase in Seconds */}
        <div
          className="reveal-item feature-card glass-frosted p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-glow-violet"
          style={{ transitionDelay: "250ms" }}
        >
          <div>
            <div className="feature-icon w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center mb-5 text-2xl shadow-glow-violet">
              🚀
            </div>
            <h3 className="text-lg font-display font-bold text-white mb-2">Deploy to Supabase in Seconds</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Generate SQL, execute in PostgreSQL, get connection strings—all without leaving the browser. Your database is live before you finish your coffee.
            </p>
          </div>
          <div className="bg-[#070611]/90 p-2.5 rounded-lg border border-purple-500/30 text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path clipRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" fillRule="evenodd"></path>
            </svg>
            <span>Supabase PostgreSQL, pooler support, .env export</span>
          </div>
        </div>

        {/* Feature 4: Use Anywhere */}
        <div
          className="reveal-item feature-card glass-frosted p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-glow-cyan"
          style={{ transitionDelay: "350ms" }}
        >
          <div>
            <div className="feature-icon w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center mb-5 text-2xl shadow-glow-cyan">
              📦
            </div>
            <h3 className="text-lg font-display font-bold text-white mb-2">Use Anywhere</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Export your schema as PostgreSQL connection string, Prisma schema, TypeORM entities, SQL migration files, or .env configuration.
            </p>
          </div>
          <div className="bg-[#070611]/90 p-2.5 rounded-lg border border-cyan-500/30 text-[11px] font-mono text-cyan-300 truncate">
            <code>DATABASE_URL=postgresql://...</code>
          </div>
        </div>

        {/* Feature 5: Never Lose Your Schemas */}
        <div
          className="reveal-item feature-card glass-frosted p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-glow-violet"
          style={{ transitionDelay: "450ms" }}
        >
          <div>
            <div className="feature-icon w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/40 flex items-center justify-center mb-5 text-2xl shadow-glow-violet">
              📚
            </div>
            <h3 className="text-lg font-display font-bold text-white mb-2">Never Lose Your Schemas</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Every database you create is saved. View history, copy connection strings anytime, track versions, and manage multiple schemas.
            </p>
          </div>
          <div className="bg-[#070611]/90 p-2.5 rounded-lg border border-purple-500/30 text-[11px] font-mono text-purple-300 flex items-center justify-between">
            <span>Version History &amp; Diffing</span>
            <span className="text-emerald-400 font-bold">Auto-Saved</span>
          </div>
        </div>

        {/* Feature 6: Refine with Prompts */}
        <div
          className="reveal-item feature-card glass-frosted p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-glow-cyan"
          style={{ transitionDelay: "550ms" }}
        >
          <div>
            <div className="feature-icon w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center mb-5 text-2xl shadow-glow-cyan">
              🔄
            </div>
            <h3 className="text-lg font-display font-bold text-white mb-2">Refine with Prompts</h3>
            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              Generated a schema? Adjust it with new prompts. &apos;Add an admin table&apos;, &apos;Change posts.content to JSON&apos;, &apos;Add indexes&apos;—schema updates in real-time.
            </p>
          </div>
          <div className="bg-[#070611]/90 p-2.5 rounded-lg border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
            <span>Prompt: &quot;Add indexes to posts(created_at)&quot;</span>
          </div>
        </div>
      </div>

      {/* Mid-section CTA */}
      <div className="mt-12 text-center reveal-item">
        <div className="inline-flex flex-col items-center">
          <Link
            className="px-8 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 shadow-glow-violet border border-purple-400/40 transition-all duration-300 active:scale-95 text-base btn-pulse-glow"
            href="/dashboard/schema"
          >
            Try the Builder →
          </Link>
          <span className="text-xs text-slate-400 font-mono mt-2">Experience the difference. It&apos;s free.</span>
        </div>
      </div>
    </section>
  );
}
