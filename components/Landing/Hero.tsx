"use client";

import React from "react";
import Link from "next/link";

export default function Hero() {
  return (
    <>
      {/* 2. HERO INTRO */}
      <section className="relative pt-16 pb-12 sm:pt-24 sm:pb-16 text-center px-4 sm:px-6 z-10 overflow-visible">
        {/* Floating Subtle Particles in Background */}
        <div className="particle w-2.5 h-2.5 left-[15%] top-[40%]" style={{ animationDelay: "0s" }}></div>
        <div className="particle w-1.5 h-1.5 left-[80%] top-[30%]" style={{ animationDelay: "2.2s" }}></div>
        <div className="particle w-2 h-2 left-[25%] top-[70%]" style={{ animationDelay: "4.1s" }}></div>
        <div className="particle w-1.5 h-1.5 left-[72%] top-[65%]" style={{ animationDelay: "1.5s" }}></div>

        <div className="max-w-4xl mx-auto">
          {/* Tagline / Badge */}
          <div className="reveal-item inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-purple-950/70 border border-purple-500/40 text-purple-300 text-xs sm:text-sm font-medium mb-6 shadow-glow-violet backdrop-blur-xl hover:border-purple-300 transition-colors duration-300">
            <span className="inline-block animate-pulse">✨</span>
            <span>AI-Powered PostgreSQL Schema Architecture</span>
          </div>

          {/* Main Headline with purple & cyan gradient emphasis */}
          <h1 className="reveal-item text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight text-white mb-6 leading-[1.08]">
            Generate PostgreSQL Schemas in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-purple-400 to-cyan-300 animate-gradient-text inline-block">
              Seconds
            </span>
          </h1>

          {/* Subheadline */}
          <h2 className="reveal-item text-xl sm:text-2xl font-display font-semibold text-slate-200 mb-4 tracking-tight">
            Stop writing SQL. Describe your database. Deploy instantly.
          </h2>

          {/* Hero Description */}
          <p className="reveal-item max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed mb-8">
            DB-Generator transforms your database ideas into production-ready PostgreSQL schemas. Use natural language, drag-and-drop, or manual configuration—deploy to Supabase with one click.
          </p>

          {/* CTA Buttons */}
          <div className="reveal-item flex flex-col items-center justify-center gap-3 mb-10">
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                className="px-7 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 border border-purple-400/50 flex items-center gap-2 transition-all duration-300 active:scale-95 text-base btn-pulse-glow"
                href="/dashboard/schema"
              >
                <span>Start Building Free</span>
                <span className="text-purple-200">→</span>
              </Link>
              <a
                className="px-6 py-3.5 rounded-xl font-semibold text-slate-200 glass-frosted hover:bg-purple-900/40 transition-all duration-300 flex items-center gap-2 text-base btn-secondary-glow"
                href="#canvas-mockup"
              >
                <svg className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"></path>
                </svg>
                <span>View Demo</span>
              </a>
            </div>
            <p className="text-xs text-slate-400 font-mono">No credit card required. Deploy your first schema in 2 minutes.</p>
          </div>
        </div>
      </section>

      {/* Hero Visual / Canvas Mockup: React Flow Spatial Canvas */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 relative z-20" id="canvas-mockup">
        <div className="reveal-scale relative rounded-3xl p-1 bg-gradient-to-b from-purple-500/40 via-purple-900/30 to-[#0c0a18]/90 shadow-2xl shadow-purple-950/80 animate-canvas-float">
          <div className="bg-[#0b0918] rounded-[22px] overflow-hidden border border-purple-500/30 relative">
            {/* Canvas Studio Top Window HUD */}
            <div className="px-4 py-3 bg-[#0c0a18]/90 border-b border-purple-900/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <div className="flex space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80 border border-rose-600 hover:scale-110 transition-transform cursor-pointer"></span>
                  <span className="w-3 h-3 rounded-full bg-amber-500/80 border border-amber-600 hover:scale-110 transition-transform cursor-pointer"></span>
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600 hover:scale-110 transition-transform cursor-pointer"></span>
                </div>
                <div className="h-4 w-px bg-slate-800"></div>
                <span className="font-mono text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="text-purple-400">workspace:</span>
                  <span className="text-white font-medium">blog-engine</span>
                  <span className="text-slate-600">/</span>
                  <span className="text-cyan-400">canvas.spatial</span>
                </span>
              </div>

              {/* Prompt Bar with the exact prompt */}
              <div className="flex-1 max-w-xl mx-2 hidden lg:flex items-center glass-frosted px-3 py-1.5 rounded-xl border border-purple-500/30 focus-within:border-purple-400/80 transition-colors">
                <span className="text-xs font-mono text-purple-300 mr-2 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"></path>
                  </svg>
                  Prompt:
                </span>
                <input
                  className="bg-transparent text-xs font-mono text-slate-200 placeholder-slate-500 w-full focus:outline-none"
                  readOnly
                  type="text"
                  value="Blog with posts, comments, and user profiles"
                />
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30 ml-2 whitespace-nowrap animate-pulse">
                  Auto 3NF
                </span>
              </div>

              {/* Top-Right Controls / Deployed to Supabase Badge */}
              <div className="flex items-center space-x-2 text-xs font-mono">
                <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 shadow-glow-cyan hover:scale-105 transition-transform duration-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-semibold">Deployed to Supabase</span>
                </div>
                <div className="flex items-center space-x-1 glass-frosted px-2 py-1 rounded-lg border border-purple-500/20 text-slate-300">
                  <button className="hover:text-white px-1 active:scale-90 transition-transform">−</button>
                  <span className="text-[11px] text-purple-300 font-semibold">100%</span>
                  <button className="hover:text-white px-1 active:scale-90 transition-transform">+</button>
                </div>
              </div>
            </div>

            {/* Spatial Canvas Viewport with users, posts, comments, profiles */}
            <div className="relative min-h-[520px] p-6 lg:p-8 overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#1d1738_1px,transparent_1px),linear-gradient(to_bottom,#1d1738_1px,transparent_1px)] bg-[size:36px_36px] opacity-40 pointer-events-none"></div>

              {/* SVG Relational Glowing Connector Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 hidden md:block" xmlns="http://www.w3.org/2000/svg">
                {/* Line 1: users to profiles (1:1) */}
                <path className="glow-wire-violet" d="M 280 150 C 340 150, 360 110, 440 110" fill="none" strokeWidth="2.5"></path>
                {/* Line 2: users to posts (1:N) */}
                <path className="glow-wire-cyan" d="M 280 230 C 370 230, 390 280, 440 280" fill="none" strokeWidth="2.5"></path>
                {/* Line 3: posts to comments (1:N) */}
                <path className="glow-wire-violet" d="M 680 300 C 740 300, 770 280, 820 280" fill="none" strokeWidth="2.5"></path>
                {/* Line 4: users to comments (1:N) */}
                <path className="glow-wire-cyan" d="M 280 270 C 400 370, 700 420, 820 350" fill="none" strokeWidth="2.5"></path>

                {/* Cardinality Badges */}
                <g transform="translate(360, 126)">
                  <rect fill="#131124" height="18" rx="4" stroke="#8b5cf6" strokeWidth="1.2" width="42" x="-21" y="-9"></rect>
                  <text alignmentBaseline="central" fill="#d0bcff" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600" textAnchor="middle">1 : 1</text>
                </g>
                <g transform="translate(360, 255)">
                  <rect fill="#131124" height="18" rx="4" stroke="#06b6d4" strokeWidth="1.2" width="42" x="-21" y="-9"></rect>
                  <text alignmentBaseline="central" fill="#67e8f9" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600" textAnchor="middle">1 : N</text>
                </g>
                <g transform="translate(750, 288)">
                  <rect fill="#131124" height="18" rx="4" stroke="#8b5cf6" strokeWidth="1.2" width="42" x="-21" y="-9"></rect>
                  <text alignmentBaseline="central" fill="#d0bcff" fontFamily="JetBrains Mono" fontSize="10" fontWeight="600" textAnchor="middle">1 : N</text>
                </g>
              </svg>

              {/* Draggable Table Cards Matrix */}
              <div className="relative z-20 w-full grid grid-cols-1 md:grid-cols-3 gap-6 items-start max-w-6xl">
                {/* Node 1: users */}
                <div className="glass-node rounded-2xl shadow-floating hover:border-purple-400 transition-all duration-300 group transform hover:-translate-y-1 hover:shadow-glow-violet cursor-grab active:cursor-grabbing">
                  <div className="p-3 bg-gradient-to-r from-purple-900/50 via-purple-900/30 to-transparent border-b border-purple-500/20 rounded-t-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-purple-400 shadow-glow-violet group-hover:scale-125 transition-transform"></span>
                      <span className="font-mono text-xs font-bold text-white tracking-wide">users</span>
                    </div>
                    <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">entity</span>
                  </div>
                  <div className="p-3.5 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between text-amber-300 pb-1 border-b border-slate-800/40">
                      <span className="flex items-center gap-1.5"><span className="px-1 text-[9px] font-bold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">PK</span> id</span>
                      <span className="text-slate-400 text-[11px]">uuid (v4)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 pb-1 border-b border-slate-800/40">
                      <span className="flex items-center gap-1.5">email <span className="text-[9px] text-cyan-300 bg-cyan-950 px-1 rounded">UQ</span></span>
                      <span className="text-slate-400 text-[11px]">varchar(255)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 pb-1 border-b border-slate-800/40">
                      <span>username</span>
                      <span className="text-slate-400 text-[11px]">varchar(50)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>created_at</span>
                      <span className="text-slate-500 text-[11px]">timestamptz</span>
                    </div>
                  </div>
                </div>

                {/* Column 2: profiles & posts */}
                <div className="space-y-6">
                  {/* Node 2: profiles */}
                  <div className="glass-node rounded-2xl shadow-floating hover:border-purple-400 transition-all duration-300 group transform hover:-translate-y-1 hover:shadow-glow-violet cursor-grab active:cursor-grabbing">
                    <div className="p-3 bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-transparent border-b border-purple-500/20 rounded-t-2xl flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-purple-400 shadow-glow-violet group-hover:scale-125 transition-transform"></span>
                        <span className="font-mono text-xs font-bold text-white tracking-wide">profiles</span>
                      </div>
                      <span className="text-[10px] font-mono text-purple-300 bg-purple-950/80 px-2 py-0.5 rounded border border-purple-500/30">1:1 ext</span>
                    </div>
                    <div className="p-3.5 space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between text-amber-300 pb-1 border-b border-slate-800/40">
                        <span className="flex items-center gap-1.5"><span className="px-1 text-[9px] font-bold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">PK</span> id</span>
                        <span className="text-slate-400 text-[11px]">uuid (v4)</span>
                      </div>
                      <div className="flex items-center justify-between text-purple-300 pb-1 border-b border-purple-500/20 bg-purple-950/30 -mx-2 px-2 rounded">
                        <span className="flex items-center gap-1.5"><span className="px-1 text-[9px] font-bold bg-purple-500/30 text-purple-300 rounded">FK</span> user_id</span>
                        <span className="text-[11px] text-purple-400">→ users.id</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300 pb-1 border-b border-slate-800/40">
                        <span>bio</span>
                        <span className="text-slate-400 text-[11px]">text NULL</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>avatar_url</span>
                        <span className="text-slate-500 text-[11px]">text NULL</span>
                      </div>
                    </div>
                  </div>

                  {/* Node 3: posts */}
                  <div className="glass-node rounded-2xl shadow-floating hover:border-cyan-400 transition-all duration-300 group transform hover:-translate-y-1 hover:shadow-glow-cyan cursor-grab active:cursor-grabbing">
                    <div className="p-3 bg-gradient-to-r from-cyan-950/50 via-cyan-900/30 to-transparent border-b border-cyan-500/20 rounded-t-2xl flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-glow-cyan group-hover:scale-125 transition-transform"></span>
                        <span className="font-mono text-xs font-bold text-white tracking-wide">posts</span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">FK Linked</span>
                    </div>
                    <div className="p-3.5 space-y-2 text-xs font-mono">
                      <div className="flex items-center justify-between text-amber-300 pb-1 border-b border-slate-800/40">
                        <span className="flex items-center gap-1.5"><span className="px-1 text-[9px] font-bold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">PK</span> id</span>
                        <span className="text-slate-400 text-[11px]">uuid (v4)</span>
                      </div>
                      <div className="flex items-center justify-between text-cyan-300 pb-1 border-b border-cyan-500/20 bg-cyan-950/30 -mx-2 px-2 rounded">
                        <span className="flex items-center gap-1.5"><span className="px-1 text-[9px] font-bold bg-cyan-500/30 text-cyan-300 rounded">FK</span> author_id</span>
                        <span className="text-[11px] text-cyan-400">→ users.id</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300 pb-1 border-b border-slate-800/40">
                        <span>title</span>
                        <span className="text-slate-400 text-[11px]">varchar(200)</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-300 pb-1 border-b border-slate-800/40">
                        <span>content</span>
                        <span className="text-slate-400 text-[11px]">jsonb</span>
                      </div>
                      <div className="flex items-center justify-between text-slate-400">
                        <span>published_at</span>
                        <span className="text-slate-500 text-[11px]">timestamptz</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: comments */}
                <div className="glass-node rounded-2xl shadow-floating hover:border-cyan-400 transition-all duration-300 group transform hover:-translate-y-1 hover:shadow-glow-cyan cursor-grab active:cursor-grabbing">
                  <div className="p-3 bg-gradient-to-r from-indigo-950/50 via-purple-900/30 to-transparent border-b border-purple-500/20 rounded-t-2xl flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-glow-cyan group-hover:scale-125 transition-transform"></span>
                      <span className="font-mono text-xs font-bold text-white tracking-wide">comments</span>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">FK Linked</span>
                  </div>
                  <div className="p-3.5 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between text-amber-300 pb-1 border-b border-slate-800/40">
                      <span className="flex items-center gap-1.5"><span className="px-1 text-[9px] font-bold bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">PK</span> id</span>
                      <span className="text-slate-400 text-[11px]">uuid (v4)</span>
                    </div>
                    <div className="flex items-center justify-between text-purple-300 pb-1 border-b border-purple-500/20 bg-purple-950/30 -mx-2 px-2 rounded">
                      <span className="flex items-center gap-1.5"><span className="px-1 text-[9px] font-bold bg-purple-500/30 text-purple-300 rounded">FK</span> post_id</span>
                      <span className="text-[11px] text-purple-400">→ posts.id</span>
                    </div>
                    <div className="flex items-center justify-between text-cyan-300 pb-1 border-b border-cyan-500/20 bg-cyan-950/30 -mx-2 px-2 rounded">
                      <span className="flex items-center gap-1.5"><span className="px-1 text-[9px] font-bold bg-cyan-500/30 text-cyan-300 rounded">FK</span> user_id</span>
                      <span className="text-[11px] text-cyan-400">→ users.id</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300 pb-1 border-b border-slate-800/40">
                      <span>body</span>
                      <span className="text-slate-400 text-[11px]">text</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>created_at</span>
                      <span className="text-slate-500 text-[11px]">timestamptz</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Canvas Floating Bar */}
              <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center justify-between text-xs font-mono text-slate-400 glass-frosted px-4 py-2 rounded-xl border border-purple-500/20 z-30">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center gap-1.5 text-purple-300">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                    <span>Spatial Canvas Engine v2.4</span>
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="hidden sm:inline">Postgres 16 3NF Verified</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-slate-300">4 tables</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-cyan-400">4 foreign key constraints</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-emerald-400 font-medium">0 validation errors</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
