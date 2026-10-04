"use client";

import React, { useState, useEffect } from 'react';
import { useManualBuilder } from '@/lib/hooks/useManualBuilder';
import BuilderCanvas from '@/components/ManualBuilder/BuilderCanvas';
import BuilderToolbar from '@/components/ManualBuilder/BuilderToolbar';
import { useSchemaStore } from '@/lib/store/schemaStore';
import { useAuth } from '@/lib/hooks/useAuth';
import { persistDatabase, deriveNameFromPrompt } from '@/lib/services/databaseHistory';
import { generateSQL } from '@/lib/util/sqlGenerator';
import ConnectionStringModal from '@/components/Schema/ConnectionStringModal';
import { toast } from 'sonner';

const PROMPT_SUGGESTIONS = [
  {
    label: '🏫 School & Students (3NF)',
    prompt: 'School student database with departments, teachers, courses, students, classrooms, subjects, enrollments, attendance, and grades following 3NF',
  },
  {
    label: '🛍️ E-Commerce & Store',
    prompt: 'E-commerce platform with users, categories, products, inventory, orders, order_items, shipping_addresses, and payment_transactions',
  },
  {
    label: '🏥 Hospital Management',
    prompt: 'Hospital management system with patients, doctors, departments, appointments, medical_records, prescriptions, and billing_invoices',
  },
  {
    label: '💼 HR & Payroll',
    prompt: 'HR and payroll system with employees, departments, job_titles, salaries, bonuses, attendance, performance_reviews, and payroll_runs',
  },
];

export default function UnifiedSchemaBuilderPage() {
  const storeTables = useSchemaStore((state) => state.tables);
  const storePrompt = useSchemaStore((state) => state.prompt);
  const setStoreTables = useSchemaStore((state) => state.setTables);
  const setStorePrompt = useSchemaStore((state) => state.setPrompt);
  const setCurrentDatabaseId = useSchemaStore((state) => state.setCurrentDatabaseId);
  const { user } = useAuth();

  // Unified visual builder state
  const builder = useManualBuilder();
  const {
    tables,
    addTable,
    clearCanvas,
    getSchemaTables,
    loadSchemaTables,
    autoLayout,
    setRelationshipModal,
  } = builder;

  // AI Prompt Form State
  const [prompt, setPrompt] = useState(storePrompt || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [databaseName, setDatabaseName] = useState('My Relational Database');
  const [isDeploying, setIsDeploying] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectionData, setConnectionData] = useState<any>(null);

  // If there are tables already loaded in store (e.g. from "Open in Builder" in History), load them onto canvas
  useEffect(() => {
    if (storeTables && storeTables.length > 0) {
      loadSchemaTables(storeTables);
      if (storePrompt) {
        setPrompt(storePrompt);
        setDatabaseName(deriveNameFromPrompt(storePrompt, storeTables));
      }
    }
  }, [storeTables, storePrompt, loadSchemaTables]);

  // AI Generation Handler: generates tables and loads them straight into the interactive visual canvas
  const handleGenerateAI = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) {
      toast.error('Please enter a description for your database schema.');
      return;
    }

    setIsGenerating(true);
    const toastId = toast.loading('Groq AI is designing your normalized relational schema...');

    try {
      const res = await fetch('/api/generate-schema', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Failed to generate schema');
      }

      const data = await res.json();
      const generatedTables = data.tables || [];

      if (!generatedTables.length) {
        throw new Error('AI could not produce tables from this description. Please try with more detail.');
      }

      // 1. Immediately load AI generated tables onto the visual interactive canvas
      loadSchemaTables(generatedTables);

      // 2. Derive professional database name and update store
      const derived = deriveNameFromPrompt(prompt, generatedTables);
      setDatabaseName(derived);
      setStoreTables(generatedTables);
      setStorePrompt(prompt);

      toast.success(
        `Generated ${generatedTables.length} tables! Loaded onto canvas for visual editing.`,
        { id: toastId }
      );

      // Automatically register draft in history
      persistDatabase({
        name: derived,
        prompt,
        tables: generatedTables,
        userId: user?.id,
        deployed: false,
      })
        .then((saved) => setCurrentDatabaseId(saved.id))
        .catch(() => {});
    } catch (err: any) {
      toast.error(err?.message || 'Error generating schema with AI', { id: toastId });
    } finally {
      setIsGenerating(false);
    }
  };

  // State for SQL Modal
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [sqlText, setSqlText] = useState('');
  const [copiedSql, setCopiedSql] = useState(false);

  // Open SQL Modal
  const handleOpenSqlModal = () => {
    const currentTables = getSchemaTables();
    if (!currentTables.length) {
      toast.error('Canvas is empty. Add or generate tables first.');
      return;
    }
    const sql = generateSQL(currentTables);
    setSqlText(sql);
    setShowSqlModal(true);
  };

  // Copy SQL to clipboard
  const handleCopySql = async () => {
    try {
      await navigator.clipboard.writeText(sqlText);
      setCopiedSql(true);
      toast.success('SQL copied to clipboard!');
      setTimeout(() => setCopiedSql(false), 2000);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  // Export Full SQL as .sql file from current canvas
  const handleExportSQL = async () => {
    const currentTables = getSchemaTables();
    if (!currentTables.length) {
      toast.error('No tables on canvas to export');
      return;
    }
    const sql = generateSQL(currentTables);
    const blob = new Blob([sql], { type: 'application/sql' });
    const module = await import('file-saver');
    const safeName = databaseName.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'schema';
    module.saveAs(blob, `${safeName}.sql`);
    toast.success(`Exported ${safeName}.sql`);
  };

  // Approve Schema Review Modal
  const handleApprove = () => {
    const currentTables = getSchemaTables();
    if (!currentTables.length) {
      toast.error('Canvas is empty. Add or generate tables first.');
      return;
    }
    setStoreTables(currentTables);
    setShowReviewModal(true);
  };

  // Deploy to Supabase PostgreSQL: deploys the exact manipulated schema on the canvas
  const handleDeploy = async () => {
    const currentTables = getSchemaTables();
    if (!currentTables.length) {
      toast.error('No schema tables to deploy');
      return;
    }

    setIsDeploying(true);
    const toastId = toast.loading(`Deploying ${currentTables.length} tables to Supabase...`);

    try {
      const res = await fetch('/api/create-tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tables: currentTables }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || `Successfully created ${currentTables.length} tables!`, { id: toastId });
        setShowReviewModal(false);

        if (data.connectionStrings) {
          setConnectionData(data.connectionStrings);
        }
        setShowConnectionModal(true);

        // Sync with zustand & persist into history
        setStoreTables(currentTables);
        persistDatabase({
          name: databaseName,
          prompt,
          tables: currentTables,
          deployed: true,
          userId: user?.id,
        }).catch(() => {});
        return;
      }

      throw new Error(data.error || 'Deployment failed');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to deploy schema to Supabase', { id: toastId });
    } finally {
      setIsDeploying(false);
    }
  };

  const schemaTables = getSchemaTables();
  const totalColumns = schemaTables.reduce((acc, t) => acc + t.columns.length, 0);
  const foreignKeyCount = schemaTables.reduce(
    (acc, t) => acc + t.columns.filter((c) => c.references).length,
    0
  );

  return (
    <div className="space-y-3.5 max-w-[1240px] mx-auto w-full px-2 sm:px-4">
      {/* Header Title Section */}
      <div className="space-y-0.5">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Interactive{' '}
          <span className="shimmer-text bg-gradient-to-r from-purple-400 via-indigo-300 to-cyan-300 bg-clip-text text-transparent">
            Schema Builder
          </span>
        </h1>
        <p className="text-xs text-slate-400 max-w-2xl">
          Prompt AI to architect your normalized schema, then freely drag, modify columns, and draw relationships on the visual canvas.
        </p>
      </div>

      {/* AI Schema Architect Input Bar (GROQ POWERED) - Compact & Sleek */}
      <section
        className="glass-panel prompter-glow rounded-xl p-3 sm:p-3.5 border-purple-500/30 shadow-xl relative overflow-hidden"
        data-purpose="ai-prompter"
      >
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center space-x-1.5">
            {/* Sparkles Icon */}
            <svg className="w-3.5 h-3.5 text-purple-400 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"></path>
            </svg>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-300">
              AI Schema Architect <span className="text-purple-400 font-semibold">(Groq Powered)</span>
            </span>
          </div>
          <span className="hidden sm:inline-block text-[10px] text-slate-400">
            Generates 3NF compliant tables & loads onto canvas
          </span>
        </div>

        {/* Prompt Input with embedded Generation Button */}
        <form onSubmit={handleGenerateAI} className="relative flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-grow group">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
              placeholder="e.g. School student database with departments, teachers, students, courses, grades following 3NF..."
              className="w-full bg-[#05040a]/90 border border-purple-900/60 rounded-lg px-3.5 py-2 text-xs sm:text-[13px] text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-purple-400 pr-3 transition-all duration-200 shadow-inner group-hover:border-purple-700/60"
            />
          </div>
          <button
            type="submit"
            disabled={isGenerating || !prompt.trim()}
            className="ai-btn-shimmer shrink-0 flex items-center justify-center space-x-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold px-4 py-2 rounded-lg text-xs shadow-md shadow-purple-900/50 hover:shadow-purple-600/70 hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                <span>Architecting...</span>
              </>
            ) : (
              <>
                <span className="transition-transform group-hover:rotate-12 duration-200 text-xs">✨</span>
                <span>Generate with AI</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Template Chips */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2 text-xs">
          <span className="text-slate-400 text-[10px] font-medium mr-1">Quick Templates:</span>
          {PROMPT_SUGGESTIONS.map((sug) => (
            <button
              key={sug.label}
              type="button"
              onClick={() => setPrompt(sug.prompt)}
              className="template-chip px-2.5 py-0.5 bg-[#0d0c18]/80 hover:bg-purple-950/70 border border-purple-900/50 hover:border-purple-400/60 hover:shadow-[0_0_10px_rgba(139,92,246,0.3)] hover:-translate-y-0.5 rounded-md text-slate-300 hover:text-white text-[10.5px] transition-all duration-200 active:scale-95 cursor-pointer"
            >
              {sug.label}
            </button>
          ))}
        </div>
      </section>

      {/* Unified Canvas Action Toolbar */}
      <BuilderToolbar
        onAddTable={() => addTable()}
        onAddRelationship={() =>
          setRelationshipModal({
            isOpen: true,
            sourceTableId: tables[0]?.id || '',
            targetTableId: tables[1]?.id || '',
          })
        }
        onAutoLayout={autoLayout}
        onClearCanvas={() => {
          if (confirm('Clear all tables from the canvas?')) {
            clearCanvas();
            toast.info('Canvas cleared');
          }
        }}
        onApprove={handleApprove}
        onDeploy={handleDeploy}
        onExportSQL={handleOpenSqlModal}
        tableCount={tables.length}
        databaseName={databaseName}
        onDatabaseNameChange={setDatabaseName}
        isDeploying={isDeploying}
      />

      {/* Interactive Visual Canvas (Manipulate AI or Manual Schema) */}
      <BuilderCanvas builder={builder} />

      {/* Helpful Canvas Tips */}
      <div className="glass-panel p-4 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>💡</span>
          <span>
            <strong className="text-purple-300">Interactive Manipulations:</strong> Drag nodes to rearrange • Drag purple ports between tables to link foreign keys • Click + or edit icons to modify columns.
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span className="text-amber-300">🔑 = Primary Key</span>
          <span className="text-cyan-300">🔗 = Foreign Key</span>
          <span className="text-purple-300">UQ = Unique</span>
          <span className="text-rose-300">REQ = NOT NULL</span>
        </div>
      </div>

      {/* SQL Preview Modal (Generated PostgreSQL DDL) */}
      {showSqlModal && (
        <div
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 animate-fade-in"
          role="dialog"
        >
          <div className="glass-panel w-full max-w-2xl rounded-2xl border-purple-500/40 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-purple-900/40 pb-3">
              <div className="flex items-center space-x-2">
                <span className="text-lg">📄</span>
                <h3 className="font-bold text-base text-white">Generated PostgreSQL DDL</h3>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-slate-400 hover:text-white hover:scale-110 text-xl px-2 transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            <pre className="bg-[#05040a] p-4 rounded-xl border border-purple-900/60 font-mono text-xs text-purple-200 overflow-x-auto leading-relaxed max-h-96 whitespace-pre-wrap">
              <code>{sqlText}</code>
            </pre>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-purple-900/30">
              <button
                onClick={handleExportSQL}
                className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all cursor-pointer"
              >
                <span>💾</span>
                <span>Download .sql</span>
              </button>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopySql}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all active:scale-95 shadow-lg shadow-purple-900/40 cursor-pointer"
                >
                  <span>{copiedSql ? '✅' : '📋'}</span>
                  <span>{copiedSql ? 'Copied!' : 'Copy to Clipboard'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schema Approval & Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div
            className="glass-panel max-w-xl w-full p-6 rounded-2xl space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">✅</span>
                <div>
                  <h3 className="text-lg font-bold text-white">Schema Approved</h3>
                  <p className="text-xs text-gray-400">Ready for direct deployment to Supabase PostgreSQL</p>
                </div>
              </div>
              <button
                onClick={() => setShowReviewModal(false)}
                className="text-gray-400 hover:text-white p-1 text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Stats Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-black/40 border border-gray-800 text-center">
                <div className="text-xl font-bold text-purple-300">{schemaTables.length}</div>
                <div className="text-[11px] text-gray-400">Total Tables</div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-gray-800 text-center">
                <div className="text-xl font-bold text-cyan-300">{totalColumns}</div>
                <div className="text-[11px] text-gray-400">Total Columns</div>
              </div>
              <div className="p-3 rounded-xl bg-black/40 border border-gray-800 text-center">
                <div className="text-xl font-bold text-emerald-300">{foreignKeyCount}</div>
                <div className="text-[11px] text-gray-400">Foreign Keys</div>
              </div>
            </div>

            {/* Tables preview list */}
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
                Schema Tables Preview:
              </div>
              <div className="max-h-52 overflow-y-auto space-y-2 pr-1">
                {schemaTables.map((t) => (
                  <div
                    key={t.name}
                    className="p-2.5 rounded-xl bg-black/30 border border-gray-800 flex items-center justify-between text-xs font-mono"
                  >
                    <span className="font-bold text-white">📋 {t.name}</span>
                    <span className="text-gray-400">
                      {t.columns.map((c) => c.name).join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
              <button
                onClick={handleExportSQL}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer border border-white/10"
              >
                📄 Export SQL
              </button>
              <button
                onClick={handleDeploy}
                disabled={isDeploying}
                className="deploy-btn-glow px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-emerald-900/30 disabled:opacity-50"
              >
                <span>🚀</span>
                <span>{isDeploying ? 'Deploying...' : 'Deploy to Supabase Now'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connection Info Modal */}
      {showConnectionModal && (
        <ConnectionStringModal
          isOpen={showConnectionModal}
          onClose={() => setShowConnectionModal(false)}
          deployedTableName={schemaTables.map((t) => t.name).join(', ')}
        />
      )}
    </div>
  );
}
