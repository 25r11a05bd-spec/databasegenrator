import { create } from 'zustand';

export interface TableColumn {
  name: string;
  type: string;
  // Optional foreign key relationship
  references?: {
    table: string;
    column: string;
  };
}

export interface TableSchema {
  name: string;
  columns: TableColumn[];
}

interface SchemaState {
  tables: TableSchema[];
  prompt: string;
  currentDatabaseId: string | null;
  setTables: (tables: TableSchema[]) => void;
  setPrompt: (prompt: string) => void;
  setCurrentDatabaseId: (id: string | null) => void;
  clear: () => void;
  addTable: (table: TableSchema) => void;
  setColumnReference: (tableName: string, columnName: string, reference: { table: string; column: string }) => void;
}

export const useSchemaStore = create<SchemaState>((set) => ({
  tables: [],
  prompt: '',
  currentDatabaseId: null,
  setTables: (tables) => set({ tables }),
  setPrompt: (prompt) => set({ prompt }),
  setCurrentDatabaseId: (id) => set({ currentDatabaseId: id }),
  clear: () => set({ tables: [], prompt: '', currentDatabaseId: null }),
  addTable: (table) => set((state) => ({ tables: [...state.tables, table] })),
  setColumnReference: (tableName, columnName, reference) =>
    set((state) => {
      const updatedTables = state.tables.map((tbl) => {
        if (tbl.name !== tableName) return tbl;
        const updatedColumns = tbl.columns.map((col) =>
          col.name === columnName ? { ...col, references: reference } : col
        );
        return { ...tbl, columns: updatedColumns };
      });
      return { tables: updatedTables };
    }),
}));
