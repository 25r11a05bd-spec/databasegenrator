"use client";

import { useState } from 'react';
import { useSchemaStore } from '@/lib/store/schemaStore';

// Separate component per column row so useState is called at top level
function ColumnRefRow({
  tableName,
  colName,
  existingRef,
  allTables,
}: {
  tableName: string;
  colName: string;
  existingRef?: { table: string; column: string };
  allTables: { name: string; columns: { name: string; type: string }[] }[];
}) {
  const setColumnReference = useSchemaStore((s) => s.setColumnReference);
  const [targetTable, setTargetTable] = useState('');
  const [targetColumn, setTargetColumn] = useState('');

  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="text-sm font-mono" style={{ color: "var(--foreground)", minWidth: "180px" }}>
        {tableName}.<span style={{ color: "#a78bfa" }}>{colName}</span>
      </span>
      {existingRef ? (
        <span className="text-xs px-2 py-1 rounded" style={{ background: "rgba(63, 185, 80, 0.15)", color: "#3fb950" }}>
          → {existingRef.table}.{existingRef.column}
        </span>
      ) : (
        <div className="flex items-center gap-2">
          <select
            className="input-field"
            style={{ padding: "6px 10px", fontSize: "0.85rem", width: "auto" }}
            value={targetTable}
            onChange={(e) => {
              setTargetTable(e.target.value);
              setTargetColumn('');
            }}
          >
            <option value="">Target table</option>
            {allTables
              .filter((t) => t.name !== tableName)
              .map((t) => (
                <option key={t.name} value={t.name}>{t.name}</option>
              ))}
          </select>
          <select
            className="input-field"
            style={{ padding: "6px 10px", fontSize: "0.85rem", width: "auto" }}
            value={targetColumn}
            disabled={!targetTable}
            onChange={(e) => {
              setTargetColumn(e.target.value);
              if (e.target.value) {
                setColumnReference(tableName, colName, { table: targetTable, column: e.target.value });
              }
            }}
          >
            <option value="">Target column</option>
            {allTables
              .find((t) => t.name === targetTable)
              ?.columns.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
          </select>
        </div>
      )}
    </div>
  );
}

export default function ColumnReferenceEditor() {
  const tables = useSchemaStore((s) => s.tables);

  if (!tables.length) return null;

  return (
    <div className="space-y-3">
      {tables.map((tbl) =>
        tbl.columns.map((col) => (
          <ColumnRefRow
            key={`${tbl.name}-${col.name}`}
            tableName={tbl.name}
            colName={col.name}
            existingRef={col.references}
            allTables={tables}
          />
        ))
      )}
    </div>
  );
}
