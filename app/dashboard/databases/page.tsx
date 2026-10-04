"use client";

import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import {
  getAllDatabases,
  removeDatabase,
  SavedDatabase,
} from '@/lib/services/databaseHistory';
import { useSchemaStore, TableSchema } from '@/lib/store/schemaStore';
import { generateSQL } from '@/lib/util/sqlGenerator';
import ConnectionStringModal from '@/components/Schema/ConnectionStringModal';
import { toast } from 'sonner';

export default function MyDatabasesPage() {
  const { user, loading: authLoading } = useAuth();
  const [databases, setDatabases] = useState<SavedDatabase[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDb, setSelectedDb] = useState<SavedDatabase | null>(null);
  const [deleteModalDb, setDeleteModalDb] = useState<SavedDatabase | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedDbIds, setExpandedDbIds] = useState<Set<string>>(new Set());

  const setTables = useSchemaStore((state) => state.setTables);
  const setStorePrompt = useSchemaStore((state) => state.setPrompt);
  const setCurrentDatabaseId = useSchemaStore((state) => state.setCurrentDatabaseId);
  const router = useRouter();

  // Load databases on mount / auth change
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const list = await getAllDatabases(user?.id);
        setDatabases(list);
        // By default, expand the first database so user can immediately see individual tables
        if (list.length > 0) {
          setExpandedDbIds(new Set([list[0].id]));
        }
      } catch (err) {
        console.error('Failed to load databases:', err);
      } finally {
        setLoading(false);
      }
    }
    if (!authLoading) {
      loadData();
    }
  }, [user?.id, authLoading]);

  // Filtered databases based on search query
  const filteredDbs = useMemo(() => {
    if (!searchQuery.trim()) return databases;
    const q = searchQuery.toLowerCase();
    return databases.filter(
      (db) =>
        db.name.toLowerCase().includes(q) ||
        (db.tables && db.tables.some((t) => t.name.toLowerCase().includes(q))) ||
        (db.prompt && db.prompt.toLowerCase().includes(q))
    );
  }, [databases, searchQuery]);

  // Total tables count across all databases
  const totalTables = useMemo(
    () => databases.reduce((acc, db) => acc + (db.tables?.length || 0), 0),
    [databases]
  );

  const toggleExpand = (id: string) => {
    setExpandedDbIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    setExpandedDbIds(new Set(databases.map((d) => d.id)));
  };

  const collapseAll = () => {
    setExpandedDbIds(new Set());
  };

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleLoadInBuilder = (db: SavedDatabase) => {
    if (!db.tables || db.tables.length === 0) {
      toast.error('This database has no saved tables');
      return;
    }
    setTables(db.tables);
    if (db.prompt) setStorePrompt(db.prompt);
    setCurrentDatabaseId(db.id);
    toast.success(`Loaded "${db.name}" (${db.tables.length} tables) into Schema Builder`);
    router.push('/dashboard/schema');
  };

  const handleExportSQL = async (db: SavedDatabase) => {
    if (!db.tables || db.tables.length === 0) {
      toast.error('No tables to export');
      return;
    }
    const sql = generateSQL(db.tables);
    const blob = new Blob([sql], { type: 'application/sql' });
    const module = await import('file-saver');
    const safeName = db.name.toLowerCase().replace(/[^a-z0-9]/g, '_');
    module.saveAs(blob, `${safeName}.sql`);
    toast.success(`Exported ${db.name}.sql`);
  };

  const handleConfirmDelete = async () => {
    if (!deleteModalDb) return;
    const db = deleteModalDb;
    setIsDeleting(true);
    const tableNames = db.tables?.map((t) => t.name).join(', ') || 'tables';
    const toastId = toast.loading(`Dropping all ${db.tables?.length || 0} tables from Supabase...`);

    try {
      const res = await removeDatabase({
        id: db.id,
        name: db.name,
        tables: db.tables,
        userId: user?.id,
      });

      setDatabases((prev) => prev.filter((d) => d.id !== db.id));
      setExpandedDbIds((prev) => {
        const next = new Set(prev);
        next.delete(db.id);
        return next;
      });
      setDeleteModalDb(null);
      toast.success(res.message, { id: toastId });
    } catch {
      toast.error('Failed to delete database from Supabase', { id: toastId });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      }).format(date);
    } catch {
      return 'Recent';
    }
  };

  const getDbIcon = (db: SavedDatabase) => {
    const text = `${db.name} ${db.prompt || ''} ${db.tables?.map((t) => t.name).join(' ')}`.toLowerCase();
    if (text.includes('school') || text.includes('student') || text.includes('grade') || text.includes('teacher')) return '🏫';
    if (text.includes('shop') || text.includes('order') || text.includes('product') || text.includes('cart')) return '🛍️';
    if (text.includes('hospital') || text.includes('doctor') || text.includes('patient') || text.includes('clinic')) return '🏥';
    if (text.includes('employee') || text.includes('payroll') || text.includes('salary') || text.includes('hr')) return '💼';
    if (text.includes('blog') || text.includes('post') || text.includes('comment') || text.includes('article')) return '📝';
    if (text.includes('hotel') || text.includes('room') || text.includes('booking')) return '🏨';
    if (text.includes('bank') || text.includes('account') || text.includes('transaction')) return '🏦';
    return '🗄️';
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            My <span className="gradient-text">Databases</span>
          </h2>
          <p className="mt-1" style={{ color: 'var(--muted)', fontSize: '0.95rem' }}>
            Unified database environments created by your prompts with full table hierarchy and PostgreSQL deployment.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/schema"
            className="btn-primary inline-flex items-center gap-2 self-start"
            style={{ textDecoration: 'none' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14" />
            </svg>
            Build New Schema
          </Link>
        </div>
      </div>

      {/* Stats Summary Pills */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="text-2xl p-2.5 rounded-xl" style={{ background: 'rgba(124, 58, 237, 0.15)' }}>
            🗄️
          </div>
          <div>
            <div className="text-xl font-bold text-white">{databases.length}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Main Databases</div>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="text-2xl p-2.5 rounded-xl" style={{ background: 'rgba(59, 130, 246, 0.15)' }}>
            📊
          </div>
          <div>
            <div className="text-xl font-bold text-white">{totalTables}</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Total Tables Created</div>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="text-2xl p-2.5 rounded-xl" style={{ background: 'rgba(16, 185, 129, 0.15)' }}>
            ⚡
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-400">PostgreSQL</div>
            <div className="text-xs" style={{ color: 'var(--muted)' }}>Supabase Integrated</div>
          </div>
        </div>
      </div>

      {/* Search & Expansion Controls */}
      {databases.length > 0 && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by database name, table name, or prompt..."
              className="input-field w-full text-sm"
              style={{ paddingLeft: '38px' }}
            />
            <span className="absolute left-3 top-3 text-gray-400 text-sm">🔍</span>
          </div>
          <div className="flex items-center gap-2">
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="btn-secondary text-xs"
                style={{ padding: '8px 14px' }}
              >
                Clear Search
              </button>
            )}
            <button
              onClick={expandAll}
              className="btn-secondary text-xs"
              style={{ padding: '8px 12px', color: '#c4b5fd' }}
            >
              Expand All Tables
            </button>
            <button
              onClick={collapseAll}
              className="btn-secondary text-xs"
              style={{ padding: '8px 12px' }}
            >
              Collapse All
            </button>
          </div>
        </div>
      )}

      {/* Databases List */}
      {loading ? (
        <div className="py-16 text-center text-sm" style={{ color: 'var(--muted)' }}>
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin mx-auto mb-3"
            style={{ borderColor: '#a78bfa', borderTopColor: 'transparent' }}
          />
          Loading your databases...
        </div>
      ) : filteredDbs.length > 0 ? (
        <div className="space-y-6">
          {filteredDbs.map((db) => {
            const isExpanded = expandedDbIds.has(db.id);
            const icon = getDbIcon(db);
            const tableCount = db.tables?.length || 0;

            return (
              <div
                key={db.id}
                className="glass-card transition-all overflow-hidden"
                style={{
                  borderRadius: '18px',
                  border: isExpanded
                    ? '1px solid rgba(139, 92, 246, 0.45)'
                    : '1px solid rgba(255, 255, 255, 0.08)',
                  background: 'rgba(19, 17, 28, 0.92)',
                  boxShadow: isExpanded ? '0 12px 36px -10px rgba(124, 58, 237, 0.25)' : 'none',
                }}
              >
                {/* Main Database Header Container */}
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Title & Metadata */}
                    <div
                      className="flex items-start gap-3.5 cursor-pointer flex-1"
                      onClick={() => toggleExpand(db.id)}
                      title="Click to toggle individual tables"
                    >
                      <div
                        className="text-3xl p-3 rounded-2xl flex-shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25), rgba(59, 130, 246, 0.15))',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                        }}
                      >
                        {icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3 className="text-xl font-bold text-white tracking-tight hover:text-purple-300 transition-colors">
                            {db.name}
                          </h3>

                          {/* Table count badge */}
                          <span
                            className="px-2.5 py-0.5 rounded-full text-xs font-semibold"
                            style={{
                              background: 'rgba(124, 58, 237, 0.2)',
                              color: '#c4b5fd',
                              border: '1px solid rgba(139, 92, 246, 0.35)',
                            }}
                          >
                            📁 {tableCount} {tableCount === 1 ? 'Table' : 'Tables'}
                          </span>

                          {/* Deployment Status */}
                          {db.deployed ? (
                            <span
                              className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-emerald-400 inline-flex items-center gap-1"
                              style={{
                                background: 'rgba(16, 185, 129, 0.15)',
                                border: '1px solid rgba(16, 185, 129, 0.35)',
                              }}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              🚀 Deployed in Supabase
                            </span>
                          ) : (
                            <span
                              className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold text-purple-300"
                              style={{
                                background: 'rgba(124, 58, 237, 0.15)',
                                border: '1px solid rgba(124, 58, 237, 0.3)',
                              }}
                            >
                              📝 Generated Schema
                            </span>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs mt-1.5" style={{ color: 'var(--muted)' }}>
                          <span>📅 Created: {formatDate(db.createdAt)}</span>
                          <span>•</span>
                          <span>PostgreSQL Engine</span>
                          <span>•</span>
                          <span className="text-purple-400 hover:underline">
                            {isExpanded ? '▲ Hide Tables' : '▼ Click to View Individual Tables'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Header Action Buttons */}
                    <div className="flex items-center gap-2 self-start lg:self-center">
                      <button
                        onClick={() => toggleExpand(db.id)}
                        className="btn-secondary text-xs inline-flex items-center gap-1.5"
                        style={{
                          padding: '7px 12px',
                          border: '1px solid rgba(139, 92, 246, 0.3)',
                          color: '#c4b5fd',
                        }}
                      >
                        📂 {isExpanded ? 'Hide Tables' : `View Tables (${tableCount})`}
                        <span className="text-[10px]">{isExpanded ? '▲' : '▼'}</span>
                      </button>

                      <button
                        onClick={() => setDeleteModalDb(db)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded-xl transition-all cursor-pointer border border-red-500/20"
                        title="Delete Entire Database (Drops All Tables from Supabase)"
                      >
                        <span className="text-sm">🗑️ Delete Database</span>
                      </button>
                    </div>
                  </div>

                  {/* Prompt Quote Preview */}
                  {db.prompt && (
                    <div
                      className="mt-4 p-3 rounded-xl flex items-start gap-2 text-xs font-mono"
                      style={{
                        background: 'rgba(0, 0, 0, 0.45)',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        color: '#d1d5db',
                      }}
                    >
                      <span className="text-purple-400 text-sm">💬</span>
                      <div className="flex-1">
                        <span className="text-purple-400 font-semibold mr-1">Original Prompt:</span>
                        <span>&ldquo;{db.prompt}&rdquo;</span>
                      </div>
                    </div>
                  )}

                  {/* PostgreSQL Connection Box */}
                  <div className="mt-4">
                    <div
                      className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider mb-1.5"
                      style={{ color: 'var(--muted)' }}
                    >
                      <span>PostgreSQL Direct Connection URI:</span>
                      <button
                        onClick={() => handleCopy(db.connectionString, 'Connection URI')}
                        className="text-purple-400 hover:text-purple-300 font-medium normal-case cursor-pointer text-xs"
                      >
                        📋 Copy URI
                      </button>
                    </div>
                    <div
                      className="p-2.5 rounded-xl text-xs font-mono truncate flex items-center justify-between gap-2"
                      style={{
                        background: '#09080e',
                        border: '1px solid rgba(255, 255, 255, 0.06)',
                        color: '#a78bfa',
                      }}
                    >
                      <span className="truncate">{db.connectionString}</span>
                    </div>
                  </div>

                  {/* Quick Table Name Badges (Preview) */}
                  <div className="mt-4 flex flex-wrap items-center gap-1.5">
                    <span className="text-xs text-gray-400 mr-1 font-medium">Included Tables:</span>
                    {db.tables.map((table) => (
                      <span
                        key={table.name}
                        onClick={() => {
                          if (!isExpanded) toggleExpand(db.id);
                        }}
                        className="text-xs px-2.5 py-0.5 rounded-md font-mono cursor-pointer transition-colors hover:border-purple-400"
                        style={{
                          background: 'rgba(124, 58, 237, 0.12)',
                          color: '#c4b5fd',
                          border: '1px solid rgba(139, 92, 246, 0.22)',
                        }}
                      >
                        {table.name} ({table.columns.length})
                      </span>
                    ))}
                  </div>

                  {/* Main Action Bar */}
                  <div className="flex flex-wrap items-center gap-2.5 pt-4 mt-4 border-t border-gray-800/80">
                    <button
                      onClick={() => handleLoadInBuilder(db)}
                      className="btn-primary text-xs flex-1 sm:flex-initial"
                      style={{ padding: '8px 16px', cursor: 'pointer' }}
                    >
                      ⚡ Open in Schema Builder
                    </button>
                    <button
                      onClick={() => setSelectedDb(db)}
                      className="btn-secondary text-xs"
                      style={{
                        padding: '8px 14px',
                        border: '1px solid rgba(139, 92, 246, 0.3)',
                        color: '#c4b5fd',
                        cursor: 'pointer',
                      }}
                    >
                      🔌 Connection Snippets & Pooler
                    </button>
                    <button
                      onClick={() => handleExportSQL(db)}
                      className="btn-secondary text-xs"
                      style={{ padding: '8px 14px', cursor: 'pointer' }}
                    >
                      📄 Export Full SQL (.sql)
                    </button>
                  </div>
                </div>

                {/* Collapsible / Expandable Individual Tables Section */}
                {isExpanded && (
                  <div
                    className="p-6 border-t animate-fade-in-up"
                    style={{
                      background: 'rgba(12, 10, 18, 0.85)',
                      borderColor: 'rgba(139, 92, 246, 0.25)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-sm font-bold uppercase tracking-wider text-purple-300 flex items-center gap-2">
                          <span>📋 Individual Tables in &ldquo;{db.name}&rdquo;</span>
                          <span className="text-xs text-gray-400 font-normal">({tableCount} tables total)</span>
                        </h4>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Inspect the schema, column definitions, and foreign key relationships generated for each table.
                        </p>
                      </div>
                      <button
                        onClick={() => toggleExpand(db.id)}
                        className="text-xs text-gray-400 hover:text-white transition-colors"
                      >
                        Collapse ▲
                      </button>
                    </div>

                    {/* Grid of Individual Tables */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {db.tables.map((table: TableSchema, idx: number) => {
                        const hasFk = table.columns.some((c) => c.references?.table);

                        return (
                          <div
                            key={table.name || idx}
                            className="p-4 rounded-xl flex flex-col justify-between"
                            style={{
                              background: 'rgba(25, 23, 36, 0.95)',
                              border: '1px solid rgba(255, 255, 255, 0.08)',
                            }}
                          >
                            <div>
                              {/* Table Card Header */}
                              <div className="flex items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-gray-800">
                                <div className="flex items-center gap-2 truncate">
                                  <span className="text-base">📋</span>
                                  <span className="font-mono font-bold text-white text-sm truncate">
                                    {table.name}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 flex-shrink-0">
                                  <span
                                    className="text-[10px] font-mono px-2 py-0.5 rounded"
                                    style={{ background: 'rgba(255, 255, 255, 0.07)', color: 'var(--muted)' }}
                                  >
                                    {table.columns.length} cols
                                  </span>
                                  {hasFk && (
                                    <span
                                      className="text-[10px] px-1.5 py-0.5 rounded font-semibold text-cyan-400"
                                      style={{ background: 'rgba(6, 182, 212, 0.15)' }}
                                      title="Has foreign key relationship"
                                    >
                                      🔗 FK
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Column Definitions List */}
                              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                                {table.columns.map((col) => {
                                  const isPk =
                                    col.name.toLowerCase() === 'id' ||
                                    col.name.toLowerCase() === `${table.name.toLowerCase()}_id`;
                                  const fk = col.references;

                                  return (
                                    <div
                                      key={col.name}
                                      className="flex items-center justify-between text-xs py-1 px-2 rounded font-mono"
                                      style={{ background: 'rgba(0, 0, 0, 0.3)' }}
                                    >
                                      <div className="flex items-center gap-1.5 truncate mr-2">
                                        {isPk ? (
                                          <span className="text-amber-400 text-[11px]" title="Primary Key">🔑</span>
                                        ) : fk ? (
                                          <span className="text-cyan-400 text-[11px]" title={`References ${fk.table}.${fk.column}`}>🔗</span>
                                        ) : (
                                          <span className="text-gray-500 text-[11px]">•</span>
                                        )}
                                        <span className="text-gray-200 truncate">{col.name}</span>
                                      </div>

                                      <div className="flex items-center gap-1 flex-shrink-0">
                                        <span
                                          className="text-[10px] px-1.5 py-0.2 rounded"
                                          style={{
                                            background: 'rgba(124, 58, 237, 0.18)',
                                            color: '#c4b5fd',
                                          }}
                                        >
                                          {col.type}
                                        </span>
                                        {fk && (
                                          <span
                                            className="text-[9px] px-1 py-0.2 rounded text-cyan-300 truncate max-w-[90px]"
                                            title={`Foreign key references ${fk.table}.${fk.column}`}
                                            style={{ background: 'rgba(6, 182, 212, 0.15)' }}
                                          >
                                            → {fk.table}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            {/* Table Quick Footer */}
                            <div className="mt-3 pt-2 border-t border-gray-800/60 flex items-center justify-between text-[11px]">
                              <button
                                onClick={() => handleCopy(table.name, 'Table name')}
                                className="text-gray-400 hover:text-white transition-colors"
                              >
                                Copy Name
                              </button>
                              <span className="text-gray-600 font-mono text-[10px]">
                                public.{table.name}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="glass-card p-12 text-center rounded-2xl animate-fade-in-up">
          <div className="text-5xl mb-4">🗄️</div>
          <h3 className="text-xl font-bold mb-2">
            {searchQuery ? 'No matching databases found' : 'No databases created yet'}
          </h3>
          <p className="text-sm max-w-md mx-auto mb-6" style={{ color: 'var(--muted)' }}>
            {searchQuery
              ? `No databases matched "${searchQuery}". Try a different keyword.`
              : 'Describe your application schema in the Schema Builder. Antigravity will generate your multi-table relational schema and deploy it to Supabase PostgreSQL.'}
          </p>
          <Link
            href="/dashboard/schema"
            className="btn-primary inline-flex items-center gap-2"
            style={{ textDecoration: 'none' }}
          >
            🚀 Build Your First Database
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalDb && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
          <div
            className="glass-card p-6 max-w-lg w-full rounded-2xl space-y-4 border border-red-500/30"
            style={{ background: '#14121f' }}
          >
            <div className="flex items-center gap-3">
              <div className="text-3xl p-2.5 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
                ⚠️
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Delete Entire Database?</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  Permanent cascade drop from Supabase PostgreSQL
                </p>
              </div>
            </div>

            <p className="text-sm text-gray-300">
              Are you sure you want to delete <strong className="text-white">&ldquo;{deleteModalDb.name}&rdquo;</strong>?
            </p>

            <div
              className="p-3 rounded-xl text-xs space-y-1.5"
              style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}
            >
              <div className="font-semibold text-red-400">
                ⚠️ This will permanently DROP all {deleteModalDb.tables.length} tables from Supabase:
              </div>
              <div className="flex flex-wrap gap-1 font-mono text-[11px] text-gray-300">
                {deleteModalDb.tables.map((t) => (
                  <span
                    key={t.name}
                    className="px-2 py-0.5 rounded bg-black/40 border border-red-500/20 text-red-300"
                  >
                    DROP TABLE &ldquo;{t.name}&rdquo; CASCADE;
                  </span>
                ))}
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Any deployed data, rows, and constraints in these tables will be erased permanently.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
              <button
                onClick={() => setDeleteModalDb(null)}
                disabled={isDeleting}
                className="btn-secondary text-xs"
                style={{ padding: '8px 16px' }}
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-red-600/30"
              >
                {isDeleting ? 'Dropping Tables...' : '🗑️ Yes, Drop All Tables & Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connection Info Modal */}
      {selectedDb && (
        <ConnectionStringModal
          isOpen={!!selectedDb}
          onClose={() => setSelectedDb(null)}
          deployedTableName={selectedDb.tables.map((t) => t.name).join(', ')}
        />
      )}
    </div>
  );
}
