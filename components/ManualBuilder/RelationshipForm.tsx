"use client";

import React, { useState, useEffect } from 'react';
import { ManualTable } from '@/lib/hooks/useManualBuilder';

interface RelationshipFormProps {
  isOpen: boolean;
  onClose: () => void;
  tables: ManualTable[];
  sourceTableId: string;
  targetTableId: string;
  initialSourceColumn?: string;
  initialTargetColumn?: string;
  onSave: (params: {
    sourceTableId: string;
    sourceColumnName: string;
    targetTableId: string;
    targetColumnName: string;
    relationshipType: 'one-to-many' | 'many-to-many' | 'one-to-one';
  }) => void;
}

export default function RelationshipForm({
  isOpen,
  onClose,
  tables,
  sourceTableId: propSourceTableId,
  targetTableId: propTargetTableId,
  initialSourceColumn,
  initialTargetColumn,
  onSave,
}: RelationshipFormProps) {
  const [sourceTableId, setSourceTableId] = useState('');
  const [targetTableId, setTargetTableId] = useState('');
  const [sourceColumnName, setSourceColumnName] = useState('');
  const [targetColumnName, setTargetColumnName] = useState('');
  const [relationshipType, setRelationshipType] = useState<'one-to-many' | 'many-to-many' | 'one-to-one'>('one-to-many');

  useEffect(() => {
    if (isOpen) {
      const srcId = propSourceTableId || tables[0]?.id || '';
      const tgtId = propTargetTableId || tables[1]?.id || tables[0]?.id || '';

      setSourceTableId(srcId);
      setTargetTableId(tgtId);

      const srcTable = tables.find((t) => t.id === srcId);
      const tgtTable = tables.find((t) => t.id === tgtId);

      // Default source column: initialSourceColumn, or find a foreign key/id column
      const defaultSrcCol =
        initialSourceColumn ||
        srcTable?.columns.find((c) => c.name.endsWith('_id') || c.references)?.name ||
        `${tgtTable?.name || 'target'}_id`;

      // Default target column: initialTargetColumn, or primary key 'id'
      const defaultTgtCol =
        initialTargetColumn ||
        tgtTable?.columns.find((c) => c.primaryKey)?.name ||
        'id';

      setSourceColumnName(defaultSrcCol);
      setTargetColumnName(defaultTgtCol);
      setRelationshipType('one-to-many');
    }
  }, [isOpen, propSourceTableId, propTargetTableId, initialSourceColumn, initialTargetColumn, tables]);

  if (!isOpen) return null;

  const sourceTable = tables.find((t) => t.id === sourceTableId);
  const targetTable = tables.find((t) => t.id === targetTableId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceTableId || !targetTableId || !sourceColumnName || !targetColumnName) return;

    onSave({
      sourceTableId,
      sourceColumnName,
      targetTableId,
      targetColumnName,
      relationshipType,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="glass-card max-w-lg w-full p-6 rounded-2xl space-y-4"
        style={{ background: '#14121f', border: '1px solid rgba(139, 92, 246, 0.3)' }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>🔗</span>
              <span>Create Table Relationship</span>
            </h3>
            <p className="text-xs text-gray-400">
              Connect tables with foreign key constraints or junction tables
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg text-sm"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Relationship Type Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1.5">
              Relationship Cardinality
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setRelationshipType('one-to-many')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  relationshipType === 'one-to-many'
                    ? 'border-purple-500 bg-purple-600/20 text-white'
                    : 'border-gray-800 bg-black/30 text-gray-400 hover:border-gray-700'
                }`}
              >
                <div className="font-bold text-xs">1 : N</div>
                <div className="text-[11px] mt-0.5">One-to-Many</div>
              </button>

              <button
                type="button"
                onClick={() => setRelationshipType('one-to-one')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  relationshipType === 'one-to-one'
                    ? 'border-purple-500 bg-purple-600/20 text-white'
                    : 'border-gray-800 bg-black/30 text-gray-400 hover:border-gray-700'
                }`}
              >
                <div className="font-bold text-xs">1 : 1</div>
                <div className="text-[11px] mt-0.5">One-to-One</div>
              </button>

              <button
                type="button"
                onClick={() => setRelationshipType('many-to-many')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  relationshipType === 'many-to-many'
                    ? 'border-purple-500 bg-purple-600/20 text-white'
                    : 'border-gray-800 bg-black/30 text-gray-400 hover:border-gray-700'
                }`}
              >
                <div className="font-bold text-xs">N : M</div>
                <div className="text-[11px] mt-0.5">Many-to-Many</div>
              </button>
            </div>
          </div>

          {/* Many to many notification */}
          {relationshipType === 'many-to-many' ? (
            <div
              className="p-3 rounded-xl text-xs space-y-1"
              style={{
                background: 'rgba(124, 58, 237, 0.12)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
                color: '#c4b5fd',
              }}
            >
              <div className="font-semibold text-white">✨ Automated Junction Table:</div>
              <div>
                Will automatically generate table{' '}
                <strong className="text-white font-mono">
                  {sourceTable?.name || 'source'}_{targetTable?.name || 'target'}
                </strong>{' '}
                containing composite foreign keys referencing both tables!
              </div>
            </div>
          ) : null}

          {/* Source Table & Column */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                Source Table (Child)
              </label>
              <select
                value={sourceTableId}
                onChange={(e) => {
                  setSourceTableId(e.target.value);
                  const st = tables.find((t) => t.id === e.target.value);
                  setSourceColumnName(st?.columns[0]?.name || '');
                }}
                className="input-field w-full text-sm font-mono cursor-pointer"
                style={{ background: '#0e0d16' }}
              >
                {tables.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                Foreign Key Column
              </label>
              <input
                type="text"
                value={sourceColumnName}
                onChange={(e) => setSourceColumnName(e.target.value)}
                placeholder="e.g. user_id"
                className="input-field w-full text-sm font-mono"
                list="source-cols"
              />
              <datalist id="source-cols">
                {sourceTable?.columns.map((c) => (
                  <option key={c.id} value={c.name} />
                ))}
              </datalist>
            </div>
          </div>

          {/* Target Table & Column */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                Target Table (Parent)
              </label>
              <select
                value={targetTableId}
                onChange={(e) => {
                  setTargetTableId(e.target.value);
                  const tt = tables.find((t) => t.id === e.target.value);
                  setTargetColumnName(tt?.columns.find((c) => c.primaryKey)?.name || 'id');
                }}
                className="input-field w-full text-sm font-mono cursor-pointer"
                style={{ background: '#0e0d16' }}
              >
                {tables.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                Referenced Column
              </label>
              <select
                value={targetColumnName}
                onChange={(e) => setTargetColumnName(e.target.value)}
                className="input-field w-full text-sm font-mono cursor-pointer"
                style={{ background: '#0e0d16' }}
              >
                {targetTable?.columns.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} {c.primaryKey ? '(PK)' : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Summary Diagram Preview */}
          <div className="p-3 rounded-xl bg-black/40 border border-gray-800 text-xs font-mono flex items-center justify-center gap-2 text-gray-300">
            <span className="text-purple-300 font-bold">{sourceTable?.name || 'source'}.{sourceColumnName || 'fk'}</span>
            <span className="text-cyan-400">─────▶</span>
            <span className="text-emerald-300 font-bold">{targetTable?.name || 'target'}.{targetColumnName || 'pk'}</span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs"
              style={{ padding: '8px 16px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs"
              style={{ padding: '8px 18px', cursor: 'pointer' }}
            >
              Save Relationship
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
