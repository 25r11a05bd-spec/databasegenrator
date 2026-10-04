"use client";

import React from 'react';

interface BuilderToolbarProps {
  onAddTable: () => void;
  onAddRelationship: () => void;
  onAutoLayout?: () => void;
  onClearCanvas: () => void;
  onApprove: () => void;
  onDeploy: () => void;
  onExportSQL: () => void;
  tableCount: number;
  databaseName: string;
  onDatabaseNameChange: (name: string) => void;
  isDeploying?: boolean;
}

export default function BuilderToolbar({
  onAddTable,
  onAddRelationship,
  onAutoLayout,
  onClearCanvas,
  onApprove,
  onDeploy,
  onExportSQL,
  tableCount,
  databaseName,
  onDatabaseNameChange,
  isDeploying = false,
}: BuilderToolbarProps) {
  return (
    <section
      className="glass-panel rounded-xl px-3.5 py-2 border-purple-500/25 flex flex-wrap items-center justify-between gap-3 shadow-lg"
      data-purpose="action-toolbar"
    >
      {/* Left: Database Title Input & Stats */}
      <div className="flex items-center space-x-2.5">
        <div className="w-7 h-7 rounded-lg bg-purple-900/40 border border-purple-500/30 flex items-center justify-center text-purple-300 text-sm shadow-inner hover:scale-105 transition-transform duration-200">
          🎨
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={databaseName}
              onChange={(e) => onDatabaseNameChange(e.target.value)}
              placeholder="Database Name"
              className="font-bold text-xs sm:text-[13px] text-white tracking-wide bg-transparent border-b border-dashed border-gray-600 hover:border-purple-400 focus:border-purple-400 focus:outline-none px-1 py-0.5 transition-colors"
            />
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9.5px] font-semibold bg-purple-900/60 border border-purple-500/40 text-purple-200 shadow-sm">
              📁 <span className="ml-1">{tableCount} {tableCount === 1 ? 'Table' : 'Tables'}</span>
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Click-drag tables to move • Drag node handles to connect foreign keys
          </p>
        </div>
      </div>

      {/* Right: Action Buttons Group */}
      <div className="flex flex-wrap items-center gap-1.5">
        {/* Add Table */}
        <button
          onClick={onAddTable}
          className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-[11px] font-semibold flex items-center space-x-1 shadow-md shadow-purple-900/40 hover:shadow-purple-600/50 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 cursor-pointer"
          title="Add a new blank table"
        >
          <span className="text-xs font-bold">+</span>
          <span>Add Table</span>
        </button>

        {/* Connect Tables */}
        <button
          onClick={onAddRelationship}
          disabled={tableCount < 2}
          className="px-2.5 py-1 bg-[#0d0c18]/90 hover:bg-purple-950/60 border border-purple-500/30 hover:border-purple-400/50 text-slate-200 hover:text-white rounded-md text-[11px] font-medium flex items-center space-x-1 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-40"
          title="Define Foreign Key relationship"
        >
          <span>🔗</span>
          <span>Connect Tables</span>
        </button>

        {/* Tidy Canvas */}
        {onAutoLayout && (
          <button
            onClick={onAutoLayout}
            disabled={tableCount === 0}
            className="px-2 py-1 bg-[#0d0c18]/90 hover:bg-purple-950/60 border border-purple-500/30 hover:border-purple-400/50 text-slate-200 hover:text-white rounded-md text-[11px] font-medium flex items-center space-x-1 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-40"
            title="Auto-organize and space out tables neatly"
          >
            <span>✨</span>
            <span>Tidy</span>
          </button>
        )}

        {/* View SQL */}
        <button
          onClick={onExportSQL}
          disabled={tableCount === 0}
          className="px-2 py-1 bg-[#0d0c18]/90 hover:bg-purple-950/60 border border-purple-500/30 hover:border-purple-400/50 text-slate-200 hover:text-white rounded-md text-[11px] font-medium flex items-center space-x-1 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-40"
          title="View and export PostgreSQL DDL"
        >
          <span>📄</span>
          <span>SQL</span>
        </button>

        {/* Clear Canvas */}
        <button
          onClick={onClearCanvas}
          disabled={tableCount === 0}
          className="px-2 py-1 bg-[#0d0c18]/90 hover:bg-rose-950/50 border border-rose-500/30 hover:border-rose-400/50 text-rose-300 hover:text-rose-200 rounded-md text-[11px] font-medium flex items-center space-x-1 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-40"
          title="Clear all tables"
        >
          <span>🧹</span>
          <span>Clear</span>
        </button>

        {/* Approve Schema */}
        <button
          onClick={onApprove}
          disabled={tableCount === 0}
          className="px-2.5 py-1 bg-[#0d0c18]/90 hover:bg-emerald-950/60 border border-emerald-500/50 hover:border-emerald-400/70 text-emerald-300 hover:text-emerald-200 rounded-md text-[11px] font-semibold flex items-center space-x-1 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-40"
          title="Review and approve schema tables"
        >
          <span>✅</span>
          <span>Approve Schema</span>
        </button>

        {/* Deploy to Supabase */}
        <button
          onClick={onDeploy}
          disabled={isDeploying || tableCount === 0}
          className="deploy-btn-glow px-3 py-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white rounded-md text-[11px] font-bold flex items-center space-x-1 shadow-lg shadow-emerald-900/40 hover:-translate-y-0.5 transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-50"
          title="Deploy live to Supabase PostgreSQL database"
        >
          <span className="animate-bounce">🚀</span>
          <span>{isDeploying ? 'Deploying...' : 'Deploy to Supabase'}</span>
        </button>
      </div>
    </section>
  );
}
