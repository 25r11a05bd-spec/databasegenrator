// Schema types used across Groq parsing and the schema store

export interface SchemaColumn {
  name: string;
  type: string;
  length?: number;
  nullable?: boolean;
  isPrimaryKey?: boolean;
  isUnique?: boolean;
  defaultValue?: string | null;
  references?: {
    table: string;
    column: string;
  };
}

export interface SchemaTable {
  name: string;
  columns: SchemaColumn[];
}

export interface SchemaRelationship {
  fromTable: string;
  fromColumn: string;
  toTable: string;
  toColumn: string;
  type: 'one-to-many' | 'many-to-many' | 'one-to-one';
}

export interface ParsedSchema {
  tables: SchemaTable[];
  relationships?: SchemaRelationship[];
  clarifications?: string[];
}
