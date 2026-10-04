"use client";

import React from "react";
import Link from "next/link";

export default function DashboardHome() {
  return (
    <div className="w-full max-w-[1240px] mx-auto flex flex-col items-center justify-center px-4 sm:px-6 py-12 md:py-20 flex-1">
      {/* HERO SECTION */}
      <section className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16 md:mb-20">
        {/* Large Bold Centered Headline */}
        <h1 className="opacity-0 animate-fade-up text-4xl sm:text-5xl md:text-[56px] font-extrabold tracking-tight leading-[1.12] mb-5 text-white">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-purple-400 via-violet-400 to-cyan-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-shimmer drop-shadow-[0_0_35px_rgba(168,85,247,0.35)]">
            DB-Generator
          </span>
        </h1>

        {/* Centered Subtitle / Lead Text */}
        <p className="opacity-0 animate-fade-up anim-delay-100 text-base sm:text-lg md:text-[18px] text-gray-300/85 leading-relaxed max-w-2xl mb-9">
          Create and visualize PostgreSQL schemas with AI-assisted prompts. Design your database, preview it visually, and deploy with one click.
        </p>

        {/* Centered Prominent CTA Buttons */}
        <div className="opacity-0 animate-fade-up anim-delay-200 flex flex-wrap items-center justify-center gap-4">
          {/* Primary CTA Button */}
          <Link
            className="group relative inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-[15px] text-white bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 hover:from-violet-500 hover:via-purple-500 hover:to-indigo-500 transition-all duration-300 hover:scale-[1.03] active:scale-95 animate-pulse-glow shadow-lg shadow-purple-600/30"
            href="/dashboard/schema"
          >
            <span className="text-amber-300 text-lg group-hover:rotate-12 transition-transform duration-200">⚡</span>
            <span>Launch Schema Builder</span>
          </Link>

          {/* Secondary CTA Button */}
          <Link
            className="group inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-medium text-[15px] text-gray-200 bg-[#131122]/70 hover:bg-[#19172d]/90 border border-[#2b2746] hover:border-purple-400/50 transition-all duration-300 hover:scale-[1.02] active:scale-95 hover:shadow-[0_0_20px_rgba(139,92,246,0.2)]"
            href="/dashboard/databases"
          >
            <span className="text-base group-hover:scale-110 transition-transform duration-200">🗄️</span>
            <span>View Past Databases</span>
          </Link>
        </div>
      </section>

      {/* CORE 4-FEATURE CARDS (Horizontal Clean Grid) */}
      <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Prompt -> Schema */}
        <Link
          href="/dashboard/schema"
          className="opacity-0 animate-fade-up anim-delay-300 group relative p-6 rounded-2xl bg-[#0d0c18]/70 hover:bg-[#131122]/90 border border-[#2b2746]/40 hover:border-purple-500/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_32px_-6px_rgba(139,92,246,0.22),inset_0_1px_1px_rgba(255,255,255,0.06)] backdrop-blur-xl flex flex-col justify-between block"
        >
          <div className="flex flex-col items-start">
            {/* Icon Container */}
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-purple-500/20 group-hover:border-purple-400/40 transition-all duration-300 shadow-[0_0_14px_rgba(139,92,246,0.15)]">
              📄
            </div>
            {/* Title */}
            <h3 className="font-semibold text-[17px] text-white tracking-tight mb-2 group-hover:text-purple-300 transition-colors">
              Prompt → Schema
            </h3>
            {/* Description */}
            <p className="text-[13.5px] leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors">
              Describe tables in natural language and let AI generate the schema structure for you.
            </p>
          </div>
          {/* Subtle Glow Accent Line */}
          <div className="w-8 h-[2px] bg-purple-500/30 rounded-full mt-6 group-hover:w-full group-hover:bg-purple-400/50 transition-all duration-300"></div>
        </Link>

        {/* Card 2: Define Relationships */}
        <Link
          href="/dashboard/schema"
          className="opacity-0 animate-fade-up anim-delay-400 group relative p-6 rounded-2xl bg-[#0d0c18]/70 hover:bg-[#131122]/90 border border-[#2b2746]/40 hover:border-cyan-500/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_32px_-6px_rgba(6,182,212,0.22),inset_0_1px_1px_rgba(255,255,255,0.06)] backdrop-blur-xl flex flex-col justify-between block"
        >
          <div className="flex flex-col items-start">
            {/* Icon Container */}
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-cyan-500/20 group-hover:border-cyan-400/40 transition-all duration-300 shadow-[0_0_14px_rgba(6,182,212,0.15)]">
              🔗
            </div>
            {/* Title */}
            <h3 className="font-semibold text-[17px] text-white tracking-tight mb-2 group-hover:text-cyan-300 transition-colors">
              Define Relationships
            </h3>
            {/* Description */}
            <p className="text-[13.5px] leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors">
              Add foreign keys and references between tables using an interactive editor.
            </p>
          </div>
          {/* Subtle Glow Accent Line */}
          <div className="w-8 h-[2px] bg-cyan-500/30 rounded-full mt-6 group-hover:w-full group-hover:bg-cyan-400/50 transition-all duration-300"></div>
        </Link>

        {/* Card 3: Export & Deploy */}
        <Link
          href="/dashboard/schema"
          className="opacity-0 animate-fade-up anim-delay-500 group relative p-6 rounded-2xl bg-[#0d0c18]/70 hover:bg-[#131122]/90 border border-[#2b2746]/40 hover:border-emerald-500/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_32px_-6px_rgba(16,185,129,0.22),inset_0_1px_1px_rgba(255,255,255,0.06)] backdrop-blur-xl flex flex-col justify-between block"
        >
          <div className="flex flex-col items-start">
            {/* Icon Container */}
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-emerald-500/20 group-hover:border-emerald-400/40 transition-all duration-300 shadow-[0_0_14px_rgba(16,185,129,0.15)]">
              📦
            </div>
            {/* Title */}
            <h3 className="font-semibold text-[17px] text-white tracking-tight mb-2 group-hover:text-emerald-300 transition-colors">
              Export &amp; Deploy
            </h3>
            {/* Description */}
            <p className="text-[13.5px] leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors">
              Export SQL files or deploy directly to your Supabase PostgreSQL database.
            </p>
          </div>
          {/* Subtle Glow Accent Line */}
          <div className="w-8 h-[2px] bg-emerald-500/30 rounded-full mt-6 group-hover:w-full group-hover:bg-emerald-400/50 transition-all duration-300"></div>
        </Link>

        {/* Card 4: Saved Databases */}
        <Link
          href="/dashboard/databases"
          className="opacity-0 animate-fade-up anim-delay-600 group relative p-6 rounded-2xl bg-[#0d0c18]/70 hover:bg-[#131122]/90 border border-[#2b2746]/40 hover:border-violet-500/60 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_12px_32px_-6px_rgba(139,92,246,0.22),inset_0_1px_1px_rgba(255,255,255,0.06)] backdrop-blur-xl flex flex-col justify-between block"
        >
          <div className="flex flex-col items-start">
            {/* Icon Container */}
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/25 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 group-hover:bg-indigo-500/20 group-hover:border-indigo-400/40 transition-all duration-300 shadow-[0_0_14px_rgba(99,102,241,0.15)]">
              🔌
            </div>
            {/* Title */}
            <h3 className="font-semibold text-[17px] text-white tracking-tight mb-2 group-hover:text-indigo-300 transition-colors">
              Saved Databases
            </h3>
            {/* Description */}
            <p className="text-[13.5px] leading-relaxed text-gray-400 group-hover:text-gray-300 transition-colors">
              Access all past databases, creation dates, and connection strings anytime.
            </p>
          </div>
          {/* Subtle Glow Accent Line */}
          <div className="w-8 h-[2px] bg-indigo-500/30 rounded-full mt-6 group-hover:w-full group-hover:bg-indigo-400/50 transition-all duration-300"></div>
        </Link>
      </section>
    </div>
  );
}
