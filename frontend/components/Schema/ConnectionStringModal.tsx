"use client";

import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface ConnectionData {
  projectRef: string;
  supabaseUrl: string;
  anonKey: string;
  directUri: string;
  poolerUri: string;
  envSnippet: string;
  prismaSnippet: string;
  nodePgSnippet: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ConnectionData | null;
  deployedTableName?: string;
}

export default function ConnectionStringModal({
  isOpen,
  onClose,
  initialData,
  deployedTableName,
}: Props) {
  const [data, setData] = useState<ConnectionData | null>(initialData || null);
  const [activeTab, setActiveTab] = useState<'env' | 'direct' | 'pooler' | 'prisma'>('env');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && !data) {
      setLoading(true);
      fetch('/api/connection-string')
        .then((r) => r.json())
        .then((res) => setData(res))
        .catch(() => toast.error('Failed to load connection data'))
        .finally(() => setLoading(false));
    }
  }, [isOpen, data]);

  if (!isOpen) return null;

  const replacePassword = (str: string) => {
    if (!password) return str;
    return str.replaceAll('[YOUR-PASSWORD]', password);
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const currentSnippet = () => {
    if (!data) return '';
    switch (activeTab) {
      case 'direct':
        return replacePassword(data.directUri);
      case 'pooler':
        return replacePassword(data.poolerUri);
      case 'prisma':
        return replacePassword(
          `${data.prismaSnippet}\n\n// In your .env file:\nDATABASE_URL="${data.directUri}"`
        );
      case 'env':
      default:
        return replacePassword(data.envSnippet);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.8)', backdropFilter: 'blur(8px)' }}
    >
      <div
        className="glass-card w-full max-w-2xl p-6 rounded-2xl relative animate-fade-in-up"
        style={{
          background: '#13111c',
          border: '1px solid rgba(139, 92, 246, 0.4)',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔌</span>
              <h3 className="text-xl font-bold gradient-text">
                Database Connection Strings
              </h3>
            </div>
            {deployedTableName && (
              <p className="text-xs text-emerald-400 font-medium mt-1">
                ✅ Schema deployed! Use these credentials to connect your project.
              </p>
            )}
            <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
              Project ID:{' '}
              <code className="text-purple-300 font-mono">
                {data?.projectRef || 'vhkwzctqkgaalmekeoge'}
              </code>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded text-lg cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Password inserter helper */}
        <div
          className="p-3 rounded-xl mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
          style={{ background: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(124, 58, 237, 0.2)' }}
        >
          <div className="text-xs" style={{ color: 'var(--muted)' }}>
            <span className="font-semibold text-white">Fill in your DB Password:</span>
            <div className="text-[11px] text-gray-400">
              (Optional: replaces <code>[YOUR-PASSWORD]</code> in the snippets below for easy copying)
            </div>
          </div>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter database password"
            className="input-field text-xs font-mono"
            style={{ maxWidth: '240px', padding: '6px 12px' }}
          />
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-3 border-b border-gray-800 pb-2 overflow-x-auto">
          {[
            { id: 'env', label: '.env File' },
            { id: 'direct', label: 'PostgreSQL URI' },
            { id: 'pooler', label: 'Connection Pooler (Serverless)' },
            { id: 'prisma', label: 'Prisma ORM' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              style={{
                background: activeTab === tab.id ? 'rgba(124, 58, 237, 0.25)' : 'transparent',
                color: activeTab === tab.id ? '#c4b5fd' : 'var(--muted)',
                border: activeTab === tab.id ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Code Snippet */}
        {loading ? (
          <div className="py-12 text-center text-sm" style={{ color: 'var(--muted)' }}>
            Loading connection details…
          </div>
        ) : (
          <div className="relative">
            <pre
              className="p-4 rounded-xl text-xs font-mono overflow-x-auto mb-4"
              style={{
                background: '#0a0910',
                color: '#a78bfa',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                lineHeight: '1.6',
              }}
            >
              {currentSnippet()}
            </pre>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => copyToClipboard(currentSnippet(), 'Connection snippet')}
                className="btn-primary text-xs"
                style={{ padding: '8px 18px', cursor: 'pointer' }}
              >
                📋 Copy {activeTab === 'env' ? '.env snippet' : 'Connection String'}
              </button>
            </div>
          </div>
        )}

        {/* Supabase Dashboard Direct Link */}
        <div
          className="mt-4 pt-3 border-t border-gray-800/80 flex items-center justify-between text-xs"
          style={{ color: 'var(--muted)' }}
        >
          <span>Need to find or reset your database password?</span>
          <a
            href="https://supabase.com/dashboard/project/vhkwzctqkgaalmekeoge/settings/database"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-400 hover:text-purple-300 font-medium"
            style={{ textDecoration: 'none' }}
          >
            Open Supabase Database Settings ↗
          </a>
        </div>
      </div>
    </div>
  );
}
