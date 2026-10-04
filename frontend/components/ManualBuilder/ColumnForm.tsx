"use client";

import React, { useState, useEffect } from 'react';
import { ManualColumn } from '@/lib/hooks/useManualBuilder';

interface ColumnFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (columnData: Omit<ManualColumn, 'id'>) => void;
  initialData?: ManualColumn | null;
  tableName: string;
}

const DATA_TYPES = [
  'VARCHAR',
  'INT',
  'BIGINT',
  'SERIAL',
  'BIGSERIAL',
  'DECIMAL',
  'TEXT',
  'BOOLEAN',
  'TIMESTAMP',
  'DATE',
  'UUID',
  'JSON',
  'JSONB',
];

export default function ColumnForm({
  isOpen,
  onClose,
  onSave,
  initialData,
  tableName,
}: ColumnFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState('VARCHAR');
  const [length, setLength] = useState<number>(255);
  const [nullable, setNullable] = useState(false);
  const [primaryKey, setPrimaryKey] = useState(false);
  const [unique, setUnique] = useState(false);
  const [defaultValue, setDefaultValue] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setType(initialData.type.toUpperCase().replace(/\(.*\)/, ''));
      setLength(initialData.length || 255);
      setNullable(initialData.nullable);
      setPrimaryKey(initialData.primaryKey);
      setUnique(initialData.unique);
      setDefaultValue(initialData.defaultValue || '');
    } else {
      setName('');
      setType('VARCHAR');
      setLength(255);
      setNullable(false);
      setPrimaryKey(false);
      setUnique(false);
      setDefaultValue('');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handlePrimaryKeyToggle = (checked: boolean) => {
    setPrimaryKey(checked);
    if (checked) {
      setNullable(false);
      setUnique(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.toLowerCase().replace(/[^a-z0-9_]/g, '').trim();
    if (!cleanName) return;

    onSave({
      name: cleanName,
      type,
      length: type === 'VARCHAR' ? length : undefined,
      nullable: primaryKey ? false : nullable,
      primaryKey,
      unique: primaryKey ? true : unique,
      defaultValue: defaultValue.trim() || undefined,
      references: initialData?.references,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="glass-card max-w-md w-full p-6 rounded-2xl space-y-4"
        style={{ background: '#14121f', border: '1px solid rgba(139, 92, 246, 0.3)' }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <div>
            <h3 className="text-lg font-bold text-white">
              {initialData ? 'Edit Column' : 'Add New Column'}
            </h3>
            <p className="text-xs text-gray-400">
              Table: <span className="font-mono text-purple-300 font-semibold">{tableName}</span>
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
          {/* Column Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
              Column Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. email, user_id, price"
              className="input-field w-full text-sm font-mono"
              autoFocus
            />
          </div>

          {/* Data Type & Length */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                Data Type *
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="input-field w-full text-sm font-mono cursor-pointer"
                style={{ background: '#0e0d16' }}
              >
                {DATA_TYPES.map((dt) => (
                  <option key={dt} value={dt}>
                    {dt}
                  </option>
                ))}
              </select>
            </div>

            {type === 'VARCHAR' && (
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
                  Length
                </label>
                <input
                  type="number"
                  min="1"
                  max="10485760"
                  value={length}
                  onChange={(e) => setLength(Number(e.target.value))}
                  className="input-field w-full text-sm font-mono"
                />
              </div>
            )}
          </div>

          {/* Default Value */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
              Default Value (Optional)
            </label>
            <input
              type="text"
              value={defaultValue}
              onChange={(e) => setDefaultValue(e.target.value)}
              placeholder="e.g. now(), 'active', 0, false"
              className="input-field w-full text-sm font-mono"
            />
          </div>

          {/* Checkboxes / Constraints */}
          <div className="p-3 rounded-xl bg-black/40 border border-gray-800 space-y-2 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer text-gray-200">
              <input
                type="checkbox"
                checked={primaryKey}
                onChange={(e) => handlePrimaryKeyToggle(e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
              />
              <span className="font-semibold text-amber-300">🔑 Primary Key</span>
              <span className="text-gray-500 text-[11px]">(Auto sets NOT NULL & Unique)</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-gray-200">
              <input
                type="checkbox"
                checked={unique}
                disabled={primaryKey}
                onChange={(e) => setUnique(e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer disabled:opacity-50"
              />
              <span className="font-medium">Unique Constraint (UNIQUE)</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-gray-200">
              <input
                type="checkbox"
                checked={nullable}
                disabled={primaryKey}
                onChange={(e) => setNullable(e.target.checked)}
                className="w-4 h-4 accent-purple-600 rounded cursor-pointer disabled:opacity-50"
              />
              <span className="font-medium">Nullable (Allow NULL)</span>
            </label>
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
              {initialData ? 'Save Changes' : 'Add Column'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
