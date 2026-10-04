import type { TableSchema } from '@/lib/store/schemaStore';

/**
 * Generate robust PostgreSQL CREATE TABLE statements.
 * - Guarantees primary key constraints on referenced columns (fixes "no unique constraint" error).
 * - Performs topological ordering so referenced parent tables are created before child tables.
 * - Generates foreign key constraints with ON DELETE CASCADE.
 */
export function generateSQL(tables: TableSchema[]): string {
  if (!tables || !tables.length) return '';

  // 1. Identify all referenced tables and columns
  const referencedTargets = new Map<string, Set<string>>();
  for (const table of tables) {
    for (const col of table.columns || []) {
      if (col.references && col.references.table && col.references.column) {
        if (!referencedTargets.has(col.references.table)) {
          referencedTargets.set(col.references.table, new Set());
        }
        referencedTargets.get(col.references.table)!.add(col.references.column);
      }
    }
  }

  // 2. Ensure each table has a primary key and all referenced targets have primary key/unique
  const preparedTables = tables.map((table) => {
    let hasExplicitPk = table.columns.some((c: any) => c.isPrimaryKey);
    const targetCols = referencedTargets.get(table.name) || new Set<string>();

    const cols = table.columns.map((col: any, idx: number) => {
      let isPk = !!col.isPrimaryKey;
      if (!hasExplicitPk) {
        if (
          col.name.toLowerCase() === 'id' ||
          col.name.toLowerCase() === `${table.name}_id`.toLowerCase() ||
          idx === 0
        ) {
          isPk = true;
          hasExplicitPk = true;
        }
      }
      // If referenced by another table, MUST be PK or Unique in PostgreSQL
      if (targetCols.has(col.name) && !isPk) {
        isPk = true;
      }
      return { ...col, isPrimaryKey: isPk };
    });

    return { ...table, columns: cols };
  });

  // 3. Topological sort: ensure parent tables are created before child tables
  const sorted: TableSchema[] = [];
  const visited = new Set<string>();
  const tableMap = new Map(preparedTables.map((t) => [t.name, t]));

  function visit(tableName: string) {
    if (visited.has(tableName)) return;
    visited.add(tableName);
    const tbl = tableMap.get(tableName);
    if (!tbl) return;

    for (const col of tbl.columns) {
      if (col.references && col.references.table && col.references.table !== tableName) {
        visit(col.references.table);
      }
    }
    sorted.push(tbl);
  }

  for (const table of preparedTables) {
    visit(table.name);
  }

  // 4. Generate SQL statements
  return sorted
    .map((table) => {
      const colDefs = table.columns.map((col: any) => {
        let def = `"${col.name}" ${col.type}`;
        if (col.isPrimaryKey) {
          def += ' PRIMARY KEY';
        } else if (col.isUnique) {
          def += ' UNIQUE';
        }
        if (col.nullable === false && !col.isPrimaryKey) {
          def += ' NOT NULL';
        }
        return def;
      });

      const fkDefs = table.columns
        .filter((col) => col.references && col.references.table && col.references.column)
        .map(
          (col) =>
            `FOREIGN KEY ("${col.name}") REFERENCES "${col.references!.table}"("${col.references!.column}") ON DELETE CASCADE`
        );

      const allDefs = [...colDefs, ...fkDefs].join(', ');
      return `CREATE TABLE IF NOT EXISTS "${table.name}" (${allDefs});`;
    })
    .join('\n');
}
