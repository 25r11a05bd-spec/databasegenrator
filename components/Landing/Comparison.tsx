"use client";

import React from "react";

export default function Comparison() {
  const rows = [
    { task: "Design schema", traditional: "30 mins", dbGen: "2 mins", dbColor: "text-emerald-300" },
    { task: "Write CREATE TABLE", traditional: "Complex", dbGen: "Auto-generated", dbColor: "text-cyan-300" },
    { task: "Handle relationships", traditional: "Manual JOINs", dbGen: "Automatic", dbColor: "text-emerald-300" },
    { task: "Export to ORM", traditional: "Tedious", dbGen: "One-click", dbColor: "text-purple-300" },
    { task: "Deploy to DB", traditional: "SSH + psql", dbGen: "One-click", dbColor: "text-emerald-300" },
    { task: "Fix mistakes", traditional: "Rewrite SQL", dbGen: "Adjust prompt", dbColor: "text-cyan-300" },
    { task: "Share schema", traditional: "SQL file", dbGen: "Link + version", dbColor: "text-emerald-300" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10" id="comparison">
      <div className="reveal-item text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
          Workflow Comparison
        </span>
        <h2 className="text-3xl sm:text-5xl font-display font-extrabold text-white mt-2 tracking-tight">
          Traditional Method vs DB-Generator
        </h2>
        <p className="text-slate-400 mt-3 text-base sm:text-lg">
          See how visual architecture replaces tedious SQL syntax and terminal commands.
        </p>
      </div>

      <div className="reveal-scale glass-frosted rounded-3xl overflow-hidden border border-purple-500/30 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-purple-900/40 bg-[#0c0a18]/80 font-mono text-xs">
                <th className="p-4 sm:p-5 text-slate-400 font-semibold">TASK</th>
                <th className="p-4 sm:p-5 text-rose-300/90 font-semibold bg-rose-950/20">TRADITIONAL SQL</th>
                <th className="p-4 sm:p-5 text-emerald-300 font-semibold bg-purple-950/40">DB-GENERATOR</th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs sm:text-sm divide-y divide-purple-900/20">
              {rows.map((row) => (
                <tr key={row.task} className="hover:bg-[#0c0a18]/60 transition-colors duration-200">
                  <td className="p-4 sm:p-5 font-sans font-semibold text-white">{row.task}</td>
                  <td className="p-4 sm:p-5 text-slate-400 bg-rose-950/10">{row.traditional}</td>
                  <td className={`p-4 sm:p-5 font-semibold bg-purple-950/30 ${row.dbColor}`}>{row.dbGen}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
