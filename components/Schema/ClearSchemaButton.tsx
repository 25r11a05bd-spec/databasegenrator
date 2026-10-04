"use client";

import { useSchemaStore } from '@/lib/store/schemaStore';
import { toast } from 'sonner';

export default function ClearSchemaButton() {
  const clear = useSchemaStore((s) => s.clear);

  const handleClear = () => {
    if (confirm('Are you sure you want to clear the current schema?')) {
      clear();
      toast.success('Schema cleared');
    }
  };

  return (
    <button
      onClick={handleClear}
      className="btn-secondary"
      style={{ borderColor: "var(--danger)", color: "var(--danger)" }}
    >
      🗑️ Clear Schema
    </button>
  );
}
