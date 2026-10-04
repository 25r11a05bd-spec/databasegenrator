"use client";

import { useSchemaStore } from '@/lib/store/schemaStore';
import { generateSQL } from '@/lib/util/sqlGenerator';

export default function ExportSQLButton() {
  const tables = useSchemaStore((state) => state.tables);

  const handleExport = async () => {
    if (!tables.length) return;
    const sql = generateSQL(tables);
    const blob = new Blob([sql], { type: 'application/sql' });
    const module = await import('file-saver');
    module.saveAs(blob, 'schema.sql');
  };

  return (
    <button onClick={handleExport} className="btn-secondary">
      📄 Export SQL
    </button>
  );
}
