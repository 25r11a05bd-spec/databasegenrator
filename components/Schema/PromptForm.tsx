"use client";

import { useState } from "react";
import { useSchemaStore } from "@/lib/store/schemaStore";
import { useAuth } from "@/lib/hooks/useAuth";
import { persistDatabase } from "@/lib/services/databaseHistory";
import { toast } from "sonner";

export default function PromptForm() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const setTables = useSchemaStore((state) => state.setTables);
  const setStorePrompt = useSchemaStore((state) => state.setPrompt);
  const setCurrentDatabaseId = useSchemaStore((state) => state.setCurrentDatabaseId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Prompt cannot be empty");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generate-schema", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to generate schema");
      }
      const data = await res.json();
      const generatedTables = data.tables || [];
      setTables(generatedTables);
      setStorePrompt(prompt);
      toast.success(`Schema generated — ${generatedTables.length} table(s)`);

      // Automatically save to database history and track active database ID
      if (generatedTables.length > 0) {
        persistDatabase({ prompt, tables: generatedTables, userId: user?.id })
          .then((saved) => setCurrentDatabaseId(saved.id))
          .catch(() => {});
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder={"Describe the database schema you need...\ne.g. Users table with id, name, email. Posts table with id, title, body, user_id."}
        className="input-field"
        style={{ minHeight: "120px", resize: "vertical" }}
        disabled={loading}
      />
      <div className="flex flex-wrap gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? (
            <>
              <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              Generating…
            </>
          ) : (
            "✨ Generate Schema"
          )}
        </button>
      </div>
    </form>
  );
}
