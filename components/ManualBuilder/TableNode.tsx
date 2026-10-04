"use client";

import React, { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { ManualColumn } from '@/lib/hooks/useManualBuilder';

export interface TableNodeData {
  tableId: string;
  name: string;
  columns: ManualColumn[];
  onAddColumn: (tableId: string) => void;
  onEditColumn: (tableId: string, col: ManualColumn) => void;
  onDeleteColumn: (tableId: string, columnId: string) => void;
  onRenameTable: (tableId: string, currentName: string) => void;
  onDeleteTable: (tableId: string) => void;
  onContextMenu: (e: React.MouseEvent, tableId: string) => void;
}

function TableNodeComponent({ data, selected }: NodeProps<TableNodeData>) {
  const {
    tableId,
    name,
    columns = [],
    onAddColumn,
    onEditColumn,
    onDeleteColumn,
    onRenameTable,
    onDeleteTable,
    onContextMenu,
  } = data;

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onContextMenu(e, tableId);
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      className={`rounded-lg transition-all shadow-xl select-none card-glow overflow-visible backdrop-blur-xl ${
        selected ? 'ring-2 ring-purple-400 shadow-purple-500/30' : ''
      }`}
      style={{
        background: 'rgba(13, 12, 24, 0.95)',
        border: selected ? '1px solid rgba(192, 132, 252, 0.8)' : '1px solid rgba(139, 92, 246, 0.4)',
        width: '230px',
      }}
    >
      {/* Left Connector Ports (Target & Source) */}
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="port-node !w-3 !h-3 !rounded-full !bg-purple-400 !border-2 !border-[#07060e] !cursor-crosshair shadow-md shadow-purple-500/50"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
        title="Connect relationship"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="!w-3 !h-3 !rounded-full !bg-purple-400 !border-2 !border-[#07060e] !cursor-crosshair"
        style={{ top: '50%', transform: 'translateY(-50%)', opacity: 0 }}
        title="Connect relationship"
      />

      {/* Right Connector Ports (Target & Source) */}
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="port-node !w-3 !h-3 !rounded-full !bg-purple-400 !border-2 !border-[#07060e] !cursor-crosshair shadow-md shadow-purple-500/50"
        style={{ top: '50%', transform: 'translateY(-50%)' }}
        title="Connect relationship"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="!w-3 !h-3 !rounded-full !bg-purple-400 !border-2 !border-[#07060e] !cursor-crosshair"
        style={{ top: '50%', transform: 'translateY(-50%)', opacity: 0 }}
        title="Connect relationship"
      />

      {/* Table Header */}
      <div className="table-drag-handle bg-purple-950/60 border-b border-purple-800/40 px-2.5 py-1.5 rounded-t-lg flex items-center justify-between select-none">
        <div
          className="flex items-center space-x-1.5 truncate cursor-pointer flex-1"
          onClick={() => onRenameTable(tableId, name)}
          title="Click to rename table"
        >
          <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_6px_#c084fc] flex-shrink-0"></span>
          <span className="font-bold text-[11px] text-white tracking-wide font-mono truncate hover:text-purple-300 transition-colors">
            {name}
          </span>
          <span className="text-[10px] text-purple-300/70 font-mono flex-shrink-0">({columns.length})</span>
        </div>

        <div className="flex items-center space-x-1 text-slate-400 flex-shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddColumn(tableId);
            }}
            className="hover:text-purple-300 hover:scale-110 transition-all p-0.5"
            title="Add Column"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRenameTable(tableId, name);
            }}
            className="hover:text-purple-300 hover:scale-110 transition-all p-0.5"
            title="Rename Table"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteTable(tableId);
            }}
            className="hover:text-rose-400 hover:scale-110 transition-all p-0.5"
            title="Remove table"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Column Rows List */}
      <div className="p-1.5 space-y-0.5 text-[10px] font-mono max-h-[260px] overflow-y-auto">
        {columns.length === 0 ? (
          <div className="py-2.5 text-center text-[10px] text-purple-400/60 italic font-mono">
            No columns yet.
          </div>
        ) : (
          columns.map((col) => {
            const hasFk = !!col.references;
            const isPk = !!col.primaryKey;

            return (
              <div
                key={col.id}
                onClick={() => onEditColumn(tableId, col)}
                className={`group flex items-center justify-between px-1.5 py-1 rounded transition-all cursor-pointer border ${
                  isPk
                    ? 'bg-purple-950/30 border-purple-500/25 hover:bg-purple-900/40'
                    : hasFk
                    ? 'bg-purple-950/40 border-purple-500/40 hover:bg-purple-900/50'
                    : 'hover:bg-purple-900/30 border-transparent hover:border-purple-500/20'
                }`}
              >
                {/* Column Name & Key Badges */}
                <div className="flex items-center space-x-1 truncate mr-1.5 flex-1">
                  {isPk ? (
                    <span className="text-amber-400 font-bold text-[10px]" title="Primary Key">🔑</span>
                  ) : hasFk ? (
                    <span className="text-cyan-400 animate-pulse font-bold text-[10px]" title={`Foreign Key -> ${col.references?.table}`}>🔗</span>
                  ) : (
                    <span className="w-2.5 text-center text-slate-600 text-[9px]">•</span>
                  )}

                  <span className={`truncate text-[10px] ${isPk ? 'text-purple-100 font-semibold' : hasFk ? 'text-purple-200 font-semibold' : 'text-slate-200'}`}>
                    {col.name}
                  </span>

                  {col.unique && !isPk && (
                    <span className="px-1 py-0.1 rounded bg-purple-800/40 text-purple-300 text-[8px]">UQ</span>
                  )}
                  {!col.nullable && !isPk && (
                    <span className="px-1 py-0.1 rounded bg-rose-900/30 text-rose-300 text-[8px]">REQ</span>
                  )}
                </div>

                {/* Data Type & FK Target */}
                <div className="flex items-center space-x-1 flex-shrink-0">
                  {isPk && (
                    <span className="px-1 py-0.1 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 text-[8px] font-bold">
                      PK
                    </span>
                  )}

                  <span className="px-1 py-0.2 rounded bg-purple-900/40 border border-purple-500/30 text-purple-300 text-[9px]">
                    {col.length && col.type.startsWith('VARCHAR') ? `VARCHAR(${col.length})` : col.type}
                  </span>

                  {hasFk && (
                    <span
                      className="text-[9px] text-cyan-300 font-medium truncate max-w-[70px]"
                      title={`References ${col.references?.table}.${col.references?.column}`}
                    >
                      → {col.references?.table}
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteColumn(tableId, col.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-rose-400 rounded transition-opacity"
                    title="Delete column"
                  >
                    ✕
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Column Button */}
      <div className="p-1 border-t border-purple-900/30 bg-[#07060e]/50 rounded-b-lg">
        <button
          onClick={() => onAddColumn(tableId)}
          className="w-full py-0.5 text-[10px] font-mono text-purple-400 hover:text-purple-200 hover:bg-purple-950/50 rounded flex items-center justify-center space-x-1 transition-all cursor-pointer"
        >
          <span>+</span>
          <span>Add Column</span>
        </button>
      </div>
    </div>
  );
}

export const TableNode = memo(TableNodeComponent);
