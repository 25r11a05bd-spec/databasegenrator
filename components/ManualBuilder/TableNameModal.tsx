"use client";

import React, { useState, useEffect } from 'react';

interface TableNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  tableId: string;
  currentName: string;
  onSave: (tableId: string, newName: string) => void;
}

export default function TableNameModal({
  isOpen,
  onClose,
  tableId,
  currentName,
  onSave,
}: TableNameModalProps) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
    }
  }, [isOpen, currentName]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.toLowerCase().replace(/[^a-z0-9_]/g, '').trim();
    if (!cleanName) return;
    onSave(tableId, cleanName);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div
        className="glass-card max-w-sm w-full p-6 rounded-2xl space-y-4"
        style={{ background: '#14121f', border: '1px solid rgba(139, 92, 246, 0.3)' }}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-800">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>✏️</span>
            <span>Rename Table</span>
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 text-sm">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-1">
              Table Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. users, products, orders"
              className="input-field w-full text-sm font-mono"
              autoFocus
            />
            <p className="text-[11px] text-gray-500 mt-1">
              Only lowercase letters, numbers, and underscores.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary text-xs"
              style={{ padding: '8px 14px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary text-xs"
              style={{ padding: '8px 18px', cursor: 'pointer' }}
            >
              Save Name
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
