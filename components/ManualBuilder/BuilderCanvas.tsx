"use client";

import React, { useMemo, useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  MiniMap,
  Panel,
  ReactFlowProvider,
  useReactFlow,
  Node,
  Edge,
  Connection,
  MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { TableNode } from './TableNode';
import ColumnForm from './ColumnForm';
import RelationshipForm from './RelationshipForm';
import TableNameModal from './TableNameModal';
import { useManualBuilder, ManualColumn } from '@/lib/hooks/useManualBuilder';

interface BuilderCanvasProps {
  builder: ReturnType<typeof useManualBuilder>;
}

// Define node types statically outside component for optimal React Flow performance
const NODE_TYPES = { tableNode: TableNode };

// Inner Canvas Component that has access to useReactFlow hook
function CanvasInner({ builder }: BuilderCanvasProps) {
  const {
    tables,
    addTable,
    updateTableName,
    deleteTable,
    addColumn,
    updateColumn,
    deleteColumn,
    addRelationship,
    updateTablePosition,
    autoLayout,
    columnModal,
    setColumnModal,
    relationshipModal,
    setRelationshipModal,
    tableNameModal,
    setTableNameModal,
    contextMenu,
    setContextMenu,
  } = builder;

  const { fitView, zoomIn, zoomOut, setViewport } = useReactFlow();

  const [showMinimap, setShowMinimap] = useState(false);
  const [snapToGrid, setSnapToGrid] = useState(true);

  // Handlers passed into TableNode data
  const handleAddColumn = useCallback(
    (tableId: string) => {
      setContextMenu(null);
      setColumnModal({ isOpen: true, tableId, column: null });
    },
    [setColumnModal, setContextMenu]
  );

  const handleEditColumn = useCallback(
    (tableId: string, col: ManualColumn) => {
      setContextMenu(null);
      setColumnModal({ isOpen: true, tableId, column: col });
    },
    [setColumnModal, setContextMenu]
  );

  const handleDeleteColumn = useCallback(
    (tableId: string, columnId: string) => {
      deleteColumn(tableId, columnId);
    },
    [deleteColumn]
  );

  const handleRenameTable = useCallback(
    (tableId: string, currentName: string) => {
      setContextMenu(null);
      setTableNameModal({ isOpen: true, tableId, currentName });
    },
    [setTableNameModal, setContextMenu]
  );

  const handleDeleteTable = useCallback(
    (tableId: string) => {
      setContextMenu(null);
      deleteTable(tableId);
    },
    [deleteTable, setContextMenu]
  );

  const handleContextMenu = useCallback(
    (e: React.MouseEvent, tableId: string) => {
      e.preventDefault();
      setContextMenu({
        x: e.clientX,
        y: e.clientY,
        tableId,
      });
    },
    [setContextMenu]
  );

  // Convert tables to React Flow nodes
  const nodes: Node[] = useMemo(() => {
    return tables.map((t) => ({
      id: t.id,
      type: 'tableNode',
      position: t.position,
      data: {
        tableId: t.id,
        name: t.name,
        columns: t.columns,
        onAddColumn: handleAddColumn,
        onEditColumn: handleEditColumn,
        onDeleteColumn: handleDeleteColumn,
        onRenameTable: handleRenameTable,
        onDeleteTable: handleDeleteTable,
        onContextMenu: handleContextMenu,
      },
    }));
  }, [
    tables,
    handleAddColumn,
    handleEditColumn,
    handleDeleteColumn,
    handleRenameTable,
    handleDeleteTable,
    handleContextMenu,
  ]);

  // Convert foreign key relationships to React Flow edges with smooth orthogonal routing
  const edges: Edge[] = useMemo(() => {
    const edgeList: Edge[] = [];

    tables.forEach((sourceTable) => {
      sourceTable.columns.forEach((col) => {
        if (col.references) {
          const targetTable = tables.find((t) => t.name === col.references!.table);
          if (targetTable) {
            const edgeId = `edge_${sourceTable.id}_${targetTable.id}_${col.name}`;
            const relType = col.references.relationshipType || 'one-to-many';
            const label =
              relType === 'one-to-one'
                ? `1:1 (${col.name} → ${col.references.column})`
                : `${col.name} → ${col.references.column}`;

            const isSourceToLeft = sourceTable.position.x < targetTable.position.x;

            edgeList.push({
              id: edgeId,
              source: sourceTable.id,
              target: targetTable.id,
              sourceHandle: isSourceToLeft ? 'right-source' : 'left-source',
              targetHandle: isSourceToLeft ? 'left-target' : 'right-target',
              type: 'smoothstep',
              pathOptions: {
                borderRadius: 16,
                offset: 25,
              },
              animated: true,
              style: {
                stroke: '#a78bfa',
                strokeWidth: 2,
              },
              markerEnd: {
                type: MarkerType.ArrowClosed,
                color: '#a78bfa',
                width: 14,
                height: 14,
              },
              label,
              labelStyle: { fill: '#ddd6fe', fontWeight: 600, fontSize: 10, fontFamily: 'monospace' },
              labelBgStyle: { fill: '#141224', fillOpacity: 0.95, stroke: 'rgba(139, 92, 246, 0.4)', strokeWidth: 1 },
              labelBgPadding: [6, 4],
              labelBgBorderRadius: 6,
            });
          }
        }
      });
    });

    return edgeList;
  }, [tables]);

  // When user connects two nodes with cursor drag
  const onConnect = useCallback(
    (connection: Connection) => {
      if (connection.source && connection.target && connection.source !== connection.target) {
        setRelationshipModal({
          isOpen: true,
          sourceTableId: connection.source,
          targetTableId: connection.target,
        });
      }
    },
    [setRelationshipModal]
  );

  // Update table position in store when user finishes dragging node
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      updateTablePosition(node.id, node.position);
    },
    [updateTablePosition]
  );

  // Close context menu on canvas click
  const onPaneClick = useCallback(() => {
    if (contextMenu) setContextMenu(null);
  }, [contextMenu, setContextMenu]);

  // Auto-layout and fit view
  const handleTidyLayout = useCallback(() => {
    autoLayout();
    setTimeout(() => {
      fitView({ padding: 0.25, duration: 400 });
    }, 60);
  }, [autoLayout, fitView]);

  // Current active table for column modal
  const activeModalTable = useMemo(() => {
    return tables.find((t) => t.id === columnModal.tableId);
  }, [tables, columnModal.tableId]);

  // Current context menu table
  const contextTable = useMemo(() => {
    return tables.find((t) => t.id === contextMenu?.tableId);
  }, [tables, contextMenu?.tableId]);

  return (
    <div
      onClick={onPaneClick}
      className="relative w-full rounded-2xl border border-purple-500/25 bg-[#07060e] bg-dot-grid overflow-hidden shadow-2xl select-none"
      data-purpose="schema-canvas"
      style={{
        height: '540px',
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        onConnect={onConnect}
        onNodeDragStop={onNodeDragStop}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        minZoom={0.15}
        maxZoom={1.8}
        snapToGrid={snapToGrid}
        snapGrid={[20, 20]}
        deleteKeyCode={['Backspace', 'Delete']}
      >
        <Background color="rgba(139, 92, 246, 0.18)" gap={26} size={1.5} />

        {/* Top-Left Canvas Instruction Badge */}
        <Panel position="top-left" className="m-4">
          <div className="glass-panel px-3.5 py-1.5 rounded-full flex items-center space-x-2 text-[11px] text-purple-200 border-purple-500/40 shadow-lg">
            <span className="animate-pulse">💡</span>
            <span>Drag cards freely • Drag purple side ports to link foreign keys</span>
          </div>
        </Panel>

        {/* Top-Right Canvas Floating HUD Navigation Controls */}
        <Panel position="top-right" className="m-4">
          <div
            className="flex items-center space-x-1 glass-panel px-2.5 py-1.5 rounded-full border-purple-500/30 text-xs shadow-xl"
            data-purpose="canvas-hud"
          >
            {/* Auto-Align / Tidy button */}
            <button
              onClick={handleTidyLayout}
              className="px-2.5 py-1 bg-purple-700/70 hover:bg-purple-600 text-white font-semibold rounded-full flex items-center space-x-1 transition-all duration-200 hover:shadow-[0_0_10px_rgba(168,85,247,0.5)] active:scale-95 cursor-pointer text-xs"
              title="Automatically arrange and space out tables nicely"
            >
              <span>✨</span>
              <span>Tidy & Align</span>
            </button>

            {/* Fit View button */}
            <button
              onClick={() => fitView({ padding: 0.25, duration: 400 })}
              className="px-2.5 py-1 text-slate-300 hover:text-white hover:bg-purple-900/40 rounded-full flex items-center space-x-1 transition-all duration-200 cursor-pointer text-xs"
              title="Center and fit all tables on screen"
            >
              <span>🎯</span>
              <span>Fit View</span>
            </button>

            <span className="text-slate-600 mx-0.5">|</span>

            {/* Zoom Out button */}
            <button
              onClick={() => zoomOut({ duration: 250 })}
              className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white hover:bg-purple-900/40 rounded transition-colors font-bold cursor-pointer text-sm"
              title="Zoom Out (−)"
            >
              −
            </button>

            {/* Reset 100% Zoom */}
            <button
              onClick={() => setViewport({ x: 60, y: 60, zoom: 1 }, { duration: 250 })}
              className="text-[11px] font-mono font-semibold text-slate-300 px-1 hover:text-white transition-colors cursor-pointer"
              title="Reset Zoom to 100%"
            >
              100%
            </button>

            {/* Zoom In button */}
            <button
              onClick={() => zoomIn({ duration: 250 })}
              className="w-6 h-6 flex items-center justify-center text-slate-300 hover:text-white hover:bg-purple-900/40 rounded transition-colors font-bold cursor-pointer text-sm"
              title="Zoom In (+)"
            >
              +
            </button>

            <span className="text-slate-600 mx-0.5">|</span>

            {/* Grid Snap Toggle */}
            <button
              onClick={() => setSnapToGrid((prev) => !prev)}
              className={`px-2 py-1 rounded-full flex items-center space-x-1 text-[11px] transition-colors cursor-pointer ${
                snapToGrid
                  ? 'text-purple-300 bg-purple-900/40 border border-purple-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-purple-900/40'
              }`}
              title="Toggle Grid Snapping (20px)"
            >
              <span>🧲</span>
              <span>Snap</span>
            </button>

            {/* Minimap Toggle */}
            <button
              onClick={() => setShowMinimap((prev) => !prev)}
              className={`px-2 py-1 rounded-full flex items-center space-x-1 text-[11px] transition-colors cursor-pointer ${
                showMinimap
                  ? 'text-cyan-300 bg-cyan-900/40 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-purple-900/40'
              }`}
              title="Toggle Minimap Overlay"
            >
              <span>🗺️</span>
              <span>Map</span>
            </button>
          </div>
        </Panel>

        {/* Collapsible, Translucent MiniMap */}
        {showMinimap && (
          <Panel position="bottom-right" className="m-4">
            <div
              className="rounded-2xl overflow-hidden border shadow-2xl p-1 backdrop-blur-lg"
              style={{
                background: 'rgba(15, 12, 26, 0.95)',
                borderColor: 'rgba(139, 92, 246, 0.4)',
              }}
            >
              <div className="flex items-center justify-between px-2.5 py-1 text-[10px] font-mono text-purple-300 border-b border-gray-800">
                <span>🗺️ Canvas Map</span>
                <button
                  onClick={() => setShowMinimap(false)}
                  className="text-gray-400 hover:text-white cursor-pointer px-1 text-xs"
                  title="Close Map"
                >
                  ✕
                </button>
              </div>
              <MiniMap
                nodeColor="#8b5cf6"
                nodeStrokeColor="#c4b5fd"
                nodeBorderRadius={4}
                maskColor="rgba(10, 8, 20, 0.85)"
                style={{
                  width: 150,
                  height: 100,
                  position: 'relative',
                  margin: 0,
                  background: '#0d0b16',
                }}
              />
            </div>
          </Panel>
        )}
      </ReactFlow>

      {/* Right-Click Context Menu */}
      {contextMenu && contextTable && (
        <div
          className="fixed z-50 py-1.5 rounded-xl shadow-2xl border text-xs font-medium space-y-0.5 animate-fade-in"
          style={{
            top: contextMenu.y,
            left: contextMenu.x,
            background: '#161324',
            borderColor: 'rgba(139, 92, 246, 0.4)',
            minWidth: '180px',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-3 py-1 text-[11px] font-mono font-bold text-purple-300 border-b border-gray-800/80">
            Table: {contextTable.name}
          </div>

          <button
            onClick={() => handleAddColumn(contextTable.id)}
            className="w-full text-left px-3 py-1.5 text-gray-200 hover:text-white hover:bg-purple-600/30 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>➕</span>
            <span>Add Column</span>
          </button>

          <button
            onClick={() => handleRenameTable(contextTable.id, contextTable.name)}
            className="w-full text-left px-3 py-1.5 text-gray-200 hover:text-white hover:bg-purple-600/30 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>✏️</span>
            <span>Rename Table</span>
          </button>

          <button
            onClick={() => {
              setContextMenu(null);
              setRelationshipModal({
                isOpen: true,
                sourceTableId: contextTable.id,
                targetTableId: '',
              });
            }}
            className="w-full text-left px-3 py-1.5 text-gray-200 hover:text-white hover:bg-purple-600/30 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>🔗</span>
            <span>Connect to Table</span>
          </button>

          <div className="border-t border-gray-800/80 my-1" />

          <button
            onClick={() => handleDeleteTable(contextTable.id)}
            className="w-full text-left px-3 py-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 flex items-center gap-2 transition-colors cursor-pointer"
          >
            <span>🗑️</span>
            <span>Delete Table</span>
          </button>
        </div>
      )}

      {/* Add / Edit Column Modal */}
      {columnModal.isOpen && activeModalTable && (
        <ColumnForm
          isOpen={columnModal.isOpen}
          tableName={activeModalTable.name}
          initialData={columnModal.column}
          onClose={() => setColumnModal({ isOpen: false, tableId: '' })}
          onSave={(colData) => {
            if (columnModal.column) {
              updateColumn(columnModal.tableId, columnModal.column.id, colData);
            } else {
              addColumn(columnModal.tableId, colData);
            }
          }}
        />
      )}

      {/* Relationship Config Modal */}
      {relationshipModal.isOpen && (
        <RelationshipForm
          isOpen={relationshipModal.isOpen}
          tables={tables}
          sourceTableId={relationshipModal.sourceTableId}
          targetTableId={relationshipModal.targetTableId}
          initialSourceColumn={relationshipModal.sourceColumn}
          initialTargetColumn={relationshipModal.targetColumn}
          onClose={() => setRelationshipModal({ isOpen: false, sourceTableId: '', targetTableId: '' })}
          onSave={(rel) => {
            addRelationship(rel);
          }}
        />
      )}

      {/* Rename Table Modal */}
      {tableNameModal.isOpen && (
        <TableNameModal
          isOpen={tableNameModal.isOpen}
          tableId={tableNameModal.tableId}
          currentName={tableNameModal.currentName}
          onClose={() => setTableNameModal({ isOpen: false, tableId: '', currentName: '' })}
          onSave={(tableId, newName) => {
            updateTableName(tableId, newName);
          }}
        />
      )}
    </div>
  );
}

// Wrap in ReactFlowProvider to enable useReactFlow hooks
export default function BuilderCanvas(props: BuilderCanvasProps) {
  return (
    <ReactFlowProvider>
      <CanvasInner {...props} />
    </ReactFlowProvider>
  );
}
