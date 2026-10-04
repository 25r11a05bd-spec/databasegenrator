"use client";

import React from "react";

export default function ValueProps() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10" id="value-props">
      <div className="reveal-item text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
          Value Proposition
        </span>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white mt-2 tracking-tight">
          Built for how software is made today
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* For Developers */}
        <div
          className="reveal-item glass-frosted p-8 rounded-3xl border border-purple-500/30 shadow-floating flex flex-col justify-between hover:border-purple-400 hover:-translate-y-2 hover:shadow-glow-violet transition-all duration-300"
          style={{ transitionDelay: "50ms" }}
        >
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-purple-300 bg-purple-950/70 border border-purple-500/40 px-3 py-1 rounded-lg mb-4">
              <span>DEVELOPERS</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-4">For Developers</h3>
            <ul className="space-y-3 font-sans text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Skip SQL learning curve</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Generate normalized schemas instantly</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Deploy in seconds</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Never write CREATE TABLE again</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Version control</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Export to any format</span>
              </li>
            </ul>
          </div>
        </div>

        {/* For Teams */}
        <div
          className="reveal-item glass-frosted p-8 rounded-3xl border border-cyan-500/30 shadow-floating flex flex-col justify-between hover:border-cyan-400 hover:-translate-y-2 hover:shadow-glow-cyan transition-all duration-300"
          style={{ transitionDelay: "150ms" }}
        >
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-500/40 px-3 py-1 rounded-lg mb-4">
              <span>ENGINEERING TEAMS</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-4">For Teams</h3>
            <ul className="space-y-3 font-sans text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">✓</span>
                <span>Collaborate on schema design</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">✓</span>
                <span>Share database templates</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">✓</span>
                <span>Consistent database patterns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">✓</span>
                <span>Reduce onboarding time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-cyan-400 font-bold">✓</span>
                <span>Audit trail of changes</span>
              </li>
            </ul>
          </div>
        </div>

        {/* For Projects */}
        <div
          className="reveal-item glass-frosted p-8 rounded-3xl border border-purple-500/30 shadow-floating flex flex-col justify-between hover:border-purple-400 hover:-translate-y-2 hover:shadow-glow-violet transition-all duration-300"
          style={{ transitionDelay: "250ms" }}
        >
          <div>
            <div className="inline-flex items-center space-x-2 text-xs font-mono text-purple-300 bg-purple-950/70 border border-purple-500/40 px-3 py-1 rounded-lg mb-4">
              <span>STARTUPS &amp; PRODUCTS</span>
            </div>
            <h3 className="text-2xl font-display font-bold text-white mb-4">For Projects</h3>
            <ul className="space-y-3 font-sans text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">✓</span>
                <span>Faster MVP development</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">✓</span>
                <span>Professional database design</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">✓</span>
                <span>Zero SQL errors</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">✓</span>
                <span>Scalable schemas</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-400 font-bold">✓</span>
                <span>Production-ready databases</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
