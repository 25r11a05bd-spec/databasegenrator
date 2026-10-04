"use client";

import React, { useMemo } from 'react';
import ReactFlow, { Background, Controls, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import { useSchemaStore } from '@/lib/store/schemaStore';

// Custom node to display table name and its columns
const TableNode = ({ data }: { data: { label: string; columns: { name: string; type: string }[] } }) => (
  <div className="rounded border border-gray-600 bg-gray-800 p-2 shadow-md min-w-[150px]">
    <h3 className="text-sm font-medium text-white mb-1">{data.label}</h3>
    <ul className="text-xs text-gray-300 space-y-0.5">
      {data.columns.map((col) => (
        <li key={col.name}>
          <span className="font-semibold">{col.name}</span>: {col.type}
        </li>
      ))}
    </ul>
  </div>
);

export default function Diagram() {
  const tables = useSchemaStore((state) => state.tables);

  // Convert tables to react‑flow nodes
  const nodes: Node[] = useMemo(
    () =>
      tables.map((t, i) => ({
        id: t.name,
        type: 'custom', // we'll register a custom node below
        data: { label: t.name, columns: t.columns },
        position: { x: i * 250, y: 0 }, // simple horizontal layout
      })),
    [tables]
  );

  // Generate edges based on foreign‑key references
const edges: Edge[] = [];

tables.forEach((table) => {
  table.columns.forEach((col) => {
    if (col.references) {
      const source = table.name;
      const target = col.references.table;
      const edgeId = `${source}-${target}-${col.name}`;
      edges.push({
        id: edgeId,
        source,
        target,
        // simple straight edge; customize style if desired
        animated: true,
        style: { stroke: '#8B5CF6' },
        label: `${col.name} → ${col.references.column}`,
      });
    }
  });
});

  // Register the custom node type
  const nodeTypes = useMemo(() => ({ custom: TableNode }), []);

  if (!tables.length) return null;

  return (
    <div className="h-[500px] w-full rounded border border-gray-700 bg-gray-900">
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes} fitView>
        <Background color="#444" gap={12} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
