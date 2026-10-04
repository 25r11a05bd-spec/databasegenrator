export interface ColumnReference {
  table: string;
  column: string;
}

export interface SchemaColumn {
  name: string;
  type: string;
  length?: number;
  nullable?: boolean;
  isPrimaryKey?: boolean;
  isUnique?: boolean;
  defaultValue?: string | null;
  references?: ColumnReference;
}

export interface SchemaTable {
  name: string;
  columns: SchemaColumn[];
  description?: string;
}

export interface SchemaRelationship {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: 'one-to-one' | 'one-to-many' | 'many-to-many';
}

export interface ParsedSchema {
  tables: SchemaTable[];
  relationships?: SchemaRelationship[];
  clarifications?: string[];
}

// Aliases for compatibility
export type TableColumn = SchemaColumn;
export type TableSchema = SchemaTable;
