export interface ColumnDefinition {
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

export interface TableDefinition {
  name: string;
  columns: ColumnDefinition[];
}

export class SqlService {
  /**
   * Generates robust CREATE TABLE statements with primary keys,
   * topological parent-first ordering, and foreign-key constraints.
   */
  public static generateCreateSql(tables: TableDefinition[]): string {
    if (!tables || !tables.length) return '';

    // 1. Collect all referenced tables and columns
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

    // 2. Ensure every table has a primary key & referenced targets are PK or unique
    const preparedTables = tables.map((table) => {
      let hasExplicitPk = table.columns.some((c) => c.isPrimaryKey);
      const targetCols = referencedTargets.get(table.name) || new Set<string>();

      const cols = table.columns.map((col, idx) => {
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
        if (targetCols.has(col.name) && !isPk) {
          isPk = true;
        }
        return { ...col, isPrimaryKey: isPk };
      });

      return { ...table, columns: cols };
    });

    // 3. Topological ordering: parents before children
    const sorted: TableDefinition[] = [];
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

    // 4. Generate SQL
    return sorted
      .map((table) => {
        const safeTableName = table.name.replace(/[^a-zA-Z0-9_]/g, '');

        const colDefs = table.columns.map((col) => {
          const safeColName = col.name.replace(/[^a-zA-Z0-9_]/g, '');
          let def = `"${safeColName}" ${col.type}`;

          if (col.isPrimaryKey) {
            def += ' PRIMARY KEY';
          } else if (col.isUnique) {
            def += ' UNIQUE';
          }
          if (col.nullable === false && !col.isPrimaryKey) {
            def += ' NOT NULL';
          }
          if (col.defaultValue !== undefined && col.defaultValue !== null) {
            def += ` DEFAULT ${col.defaultValue}`;
          }
          return def;
        });

        const fkDefs = table.columns
          .filter((col) => col.references && col.references.table && col.references.column)
          .map((col) => {
            const safeCol = col.name.replace(/[^a-zA-Z0-9_]/g, '');
            const refTable = col.references!.table.replace(/[^a-zA-Z0-9_]/g, '');
            const refCol = col.references!.column.replace(/[^a-zA-Z0-9_]/g, '');
            return `FOREIGN KEY ("${safeCol}") REFERENCES "${refTable}"("${refCol}") ON DELETE CASCADE`;
          });

        const allDefs = [...colDefs, ...fkDefs].join(', ');
        return `CREATE TABLE IF NOT EXISTS "${safeTableName}" (${allDefs});`;
      })
      .join('\n');
  }

  /**
   * Generates DROP TABLE IF EXISTS statements with CASCADE.
   */
  public static generateDropSql(tables: { name: string }[]): string {
    return tables
      .filter((t) => t?.name)
      .map((t) => {
        const safeName = t.name.replace(/[^a-zA-Z0-9_]/g, '');
        return `DROP TABLE IF EXISTS "${safeName}" CASCADE;`;
      })
      .join(' ');
  }
}
