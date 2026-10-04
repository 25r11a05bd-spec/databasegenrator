import type { SchemaTable, SchemaColumn } from '../types/schema';

const SQL_IDENTIFIER_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

export function isValidSqlIdentifier(name: string): boolean {
  return SQL_IDENTIFIER_REGEX.test(name) && name.length <= 63;
}

export function validateColumn(column: Partial<SchemaColumn>): { valid: boolean; error?: string } {
  if (!column.name || !column.name.trim()) {
    return { valid: false, error: 'Column name cannot be empty' };
  }
  if (!isValidSqlIdentifier(column.name)) {
    return { valid: false, error: `Invalid column name: "${column.name}". Must start with a letter/underscore and contain alphanumeric characters.` };
  }
  if (!column.type || !column.type.trim()) {
    return { valid: false, error: 'Column type is required' };
  }
  return { valid: true };
}

export function validateTable(table: Partial<SchemaTable>): { valid: boolean; error?: string } {
  if (!table.name || !table.name.trim()) {
    return { valid: false, error: 'Table name cannot be empty' };
  }
  if (!isValidSqlIdentifier(table.name)) {
    return { valid: false, error: `Invalid table name: "${table.name}". Must start with a letter/underscore and contain alphanumeric characters.` };
  }
  if (!table.columns || table.columns.length === 0) {
    return { valid: false, error: `Table "${table.name}" must contain at least one column.` };
  }
  for (const col of table.columns) {
    const colVal = validateColumn(col);
    if (!colVal.valid) return colVal;
  }
  return { valid: true };
}

export function validateSchema(tables: SchemaTable[]): { valid: boolean; error?: string } {
  if (!Array.isArray(tables) || tables.length === 0) {
    return { valid: false, error: 'Schema must contain at least one table' };
  }
  const seenTableNames = new Set<string>();
  for (const table of tables) {
    if (seenTableNames.has(table.name.toLowerCase())) {
      return { valid: false, error: `Duplicate table name found: "${table.name}"` };
    }
    seenTableNames.add(table.name.toLowerCase());
    const tableVal = validateTable(table);
    if (!tableVal.valid) return tableVal;
  }
  return { valid: true };
}
