"use client";

import { useSchemaStore } from '@/lib/store/schemaStore';
import { useAuth } from '@/lib/hooks/useAuth';
import { persistDatabase } from '@/lib/services/databaseHistory';
import { toast } from 'sonner';
import { useState } from 'react';
import ConnectionStringModal from './ConnectionStringModal';

interface SetupData {
  setupSql: string;
  schemaSql: string;
  sqlEditorUrl: string;
}

export default function DeployButton() {
  const tables = useSchemaStore((state) => state.tables);
  const prompt = useSchemaStore((state) => state.prompt);
  const currentDatabaseId = useSchemaStore((state) => state.currentDatabaseId);
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [setupData, setSetupData] = useState<SetupData | null>(null);
  const [connectionData, setConnectionData] = useState<any>(null);

  const handleDeploy = async () => {
    if (!tables.length) {
      toast.error('No schema to deploy');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/create-tables', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tables }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        toast.success(data.message || 'Tables created in Supabase!');
        setShowSetupModal(false);
        if (data.connectionStrings) {
          setConnectionData(data.connectionStrings);
        }
        setShowConnectionModal(true);

        // Update existing database record with deployed status and prompt
        persistDatabase({
          id: currentDatabaseId,
          prompt,
          tables,
          deployed: true,
          userId: user?.id,
        }).catch(() => {});
        return;
      }

      if (data.requiresSetup) {
        setSetupData({
          setupSql: data.setupSql,
          schemaSql: data.schemaSql,
          sqlEditorUrl: data.sqlEditorUrl,
        });
        setShowSetupModal(true);
        toast.info('One-time Supabase setup required for direct deployment.');
        return;
      }

      throw new Error(data.error || 'Deploy failed');
    } catch (err: any) {
      toast.error(err?.message ?? 'Deployment failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard!`);
    } catch {
      toast.error('Failed to copy to clipboard');
    }
  };

  return (
    <>
      <button
        onClick={handleDeploy}
        disabled={loading}
        className="btn-primary"
        style={{
          background: "linear-gradient(135deg, #059669, #10b981)",
          boxShadow: "0 4px 14px rgba(16, 185, 129, 0.3)",
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? '⏳ Deploying…' : '🚀 Deploy to Supabase'}
      </button>

      {/* Success Connection Modal */}
      <ConnectionStringModal
        isOpen={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
        initialData={connectionData}
        deployedTableName={tables.map((t) => t.name).join(', ')}
      />

      {/* Setup Guide Modal */}
      {showSetupModal && setupData && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(6px)' }}
        >
          <div
            className="glass-card w-full max-w-2xl p-6 rounded-2xl relative animate-fade-in-up"
            style={{
              background: '#13111c',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold gradient-text">
                  ⚡ One-Time Supabase Setup Needed
                </h3>
                <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                  Supabase requires a secure RPC helper function before apps can execute <code>CREATE TABLE</code> queries automatically.
                </p>
              </div>
              <button
                onClick={() => setShowSetupModal(false)}
                className="text-gray-400 hover:text-white p-1 rounded text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Step 1 */}
            <div
              className="p-4 rounded-xl mb-4"
              style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)' }}
            >
              <h4 className="font-semibold text-sm mb-2 text-purple-300">
                Option 1: Enable 1-Click Automated Deploys (Recommended)
              </h4>
              <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
                Run this short snippet once in your Supabase SQL Editor. Once run, the <strong>Deploy</strong> button will work automatically forever:
              </p>
              <pre
                className="p-3 rounded-lg text-xs font-mono overflow-x-auto mb-3"
                style={{ background: '#0a0910', color: '#c4b5fd', border: '1px solid rgba(139,92,246,0.2)' }}
              >
                {setupData.setupSql}
              </pre>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => copyToClipboard(setupData.setupSql, 'Setup SQL')}
                  className="btn-primary text-xs"
                  style={{ padding: '6px 14px', cursor: 'pointer' }}
                >
                  📋 Copy Setup SQL
                </button>
                <a
                  href={setupData.sqlEditorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs"
                  style={{ padding: '6px 14px', textDecoration: 'none' }}
                >
                  ↗️ Open Supabase SQL Editor
                </a>
                <button
                  onClick={handleDeploy}
                  disabled={loading}
                  className="btn-primary text-xs"
                  style={{
                    padding: '6px 14px',
                    background: 'linear-gradient(135deg, #059669, #10b981)',
                    cursor: 'pointer',
                  }}
                >
                  {loading ? '⏳ Verifying…' : '✅ I’ve Run It — Deploy Now!'}
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div
              className="p-4 rounded-xl"
              style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border)' }}
            >
              <h4 className="font-semibold text-sm mb-2 text-blue-300">
                Option 2: Run This Schema Directly
              </h4>
              <p className="text-xs mb-3" style={{ color: 'var(--muted)' }}>
                Alternatively, you can copy the generated schema SQL right now and paste it directly into Supabase:
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => copyToClipboard(setupData.schemaSql, 'Schema SQL')}
                  className="btn-secondary text-xs"
                  style={{ padding: '6px 14px', cursor: 'pointer' }}
                >
                  📋 Copy Generated Schema SQL
                </button>
                <a
                  href={setupData.sqlEditorUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-xs"
                  style={{ padding: '6px 14px', textDecoration: 'none' }}
                >
                  ↗️ Paste in SQL Editor
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
