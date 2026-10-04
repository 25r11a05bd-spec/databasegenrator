"use client";

import { useState, useCallback, useMemo } from 'react';
import { TableSchema } from '@/lib/store/schemaStore';

export interface ManualColumn {
  id: string;
  name: string;
  type: string;
  length?: number;
  nullable: boolean;
  primaryKey: boolean;
  unique: boolean;
  defaultValue?: string;
  references?: {
    table: string;
    column: string;
    relationshipType?: 'one-to-many' | 'many-to-many' | 'one-to-one';
  };
}

export interface ManualTable {
  id: string;
  name: string;
  columns: ManualColumn[];
  position: { x: number; y: number };
}

export interface ColumnModalState {
  isOpen: boolean;
  tableId: string;
  column?: ManualColumn | null;
}

export interface RelationshipModalState {
  isOpen: boolean;
  sourceTableId: string;
  targetTableId: string;
  sourceColumn?: string;
  targetColumn?: string;
}

export interface TableNameModalState {
  isOpen: boolean;
  tableId: string;
  currentName: string;
}

export interface ContextMenuState {
  x: number;
  y: number;
  tableId: string;
}

const DEFAULT_SAMPLE_TABLES: ManualTable[] = [
  {
    id: 'tbl_users',
    name: 'users',
    position: { x: 80, y: 80 },
    columns: [
      { id: 'col_u_1', name: 'id', type: 'SERIAL', nullable: false, primaryKey: true, unique: true },
      { id: 'col_u_2', name: 'email', type: 'VARCHAR', length: 255, nullable: false, primaryKey: false, unique: true },
      { id: 'col_u_3', name: 'name', type: 'VARCHAR', length: 100, nullable: false, primaryKey: false, unique: false },
      { id: 'col_u_4', name: 'created_at', type: 'TIMESTAMP', nullable: false, primaryKey: false, unique: false, defaultValue: 'now()' },
    ],
  },
  {
    id: 'tbl_posts',
    name: 'posts',
    position: { x: 480, y: 80 },
    columns: [
      { id: 'col_p_1', name: 'id', type: 'SERIAL', nullable: false, primaryKey: true, unique: true },
      {
        id: 'col_p_2',
        name: 'user_id',
        type: 'INT',
        nullable: false,
        primaryKey: false,
        unique: false,
        references: { table: 'users', column: 'id', relationshipType: 'one-to-many' },
      },
      { id: 'col_p_3', name: 'title', type: 'VARCHAR', length: 200, nullable: false, primaryKey: false, unique: false },
      { id: 'col_p_4', name: 'content', type: 'TEXT', nullable: true, primaryKey: false, unique: false },
      { id: 'col_p_5', name: 'published', type: 'BOOLEAN', nullable: false, primaryKey: false, unique: false, defaultValue: 'false' },
    ],
  },
];

export function useManualBuilder(initialSchemaTables?: TableSchema[]) {
  const [tables, setTables] = useState<ManualTable[]>(() => {
    if (initialSchemaTables && initialSchemaTables.length > 0) {
      return convertSchemaToManualTables(initialSchemaTables);
    }
    return DEFAULT_SAMPLE_TABLES;
  });
  const [columnModal, setColumnModal] = useState<ColumnModalState>({ isOpen: false, tableId: '' });
  const [relationshipModal, setRelationshipModal] = useState<RelationshipModalState>({
    isOpen: false,
    sourceTableId: '',
    targetTableId: '',
  });
  const [tableNameModal, setTableNameModal] = useState<TableNameModalState>({
    isOpen: false,
    tableId: '',
    currentName: '',
  });
  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  // Add a new blank table
  const addTable = useCallback((customName?: string) => {
    setTables((prev) => {
      const count = prev.length + 1;
      const baseName = customName || `table_${count}`;
      // Clean table name (lowercase, letters/numbers/underscores only)
      const safeName = baseName.toLowerCase().replace(/[^a-z0-9_]/g, '') || `table_${Date.now() % 1000}`;

      // Calculate staggered position so new nodes don't stack on top of each other
      const colIndex = (count - 1) % 3;
      const rowIndex = Math.floor((count - 1) / 3);
      const position = {
        x: 80 + colIndex * 380,
        y: 80 + rowIndex * 340,
      };

      const newTable: ManualTable = {
        id: `tbl_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        name: safeName,
        position,
        columns: [
          {
            id: `col_${Date.now()}_id`,
            name: 'id',
            type: 'SERIAL',
            nullable: false,
            primaryKey: true,
            unique: true,
          },
        ],
      };

      return [...prev, newTable];
    });
  }, []);

  // Update table name
  const updateTableName = useCallback((tableId: string, newName: string) => {
    const safeName = newName.toLowerCase().replace(/[^a-z0-9_]/g, '').trim();
    if (!safeName) return;

    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        const oldName = t.name;

        // Also update any foreign key references pointing to the old table name
        return { ...t, name: safeName };
      }).map((t) => ({
        ...t,
        columns: t.columns.map((c) => {
          const oldTarget = prev.find((x) => x.id === tableId)?.name;
          if (c.references && c.references.table === oldTarget) {
            return {
              ...c,
              references: { ...c.references, table: safeName },
            };
          }
          return c;
        }),
      }))
    );
  }, []);

  // Delete a table
  const deleteTable = useCallback((tableId: string) => {
    setTables((prev) => {
      const tableToDelete = prev.find((t) => t.id === tableId);
      const deletedName = tableToDelete?.name;

      return prev
        .filter((t) => t.id !== tableId)
        .map((t) => ({
          ...t,
          columns: t.columns.map((c) => {
            // Remove foreign key references to the deleted table
            if (c.references && c.references.table === deletedName) {
              const { references, ...rest } = c;
              return rest as ManualColumn;
            }
            return c;
          }),
        }));
    });
  }, []);

  // Add column to a table
  const addColumn = useCallback((tableId: string, colData: Omit<ManualColumn, 'id'>) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;

        const newCol: ManualColumn = {
          ...colData,
          id: `col_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
          name: colData.name.toLowerCase().replace(/[^a-z0-9_]/g, ''),
        };

        // If new column is primary key, unset primary key on others if desired, or allow composite
        return {
          ...t,
          columns: [...t.columns, newCol],
        };
      })
    );
  }, []);

  // Update an existing column
  const updateColumn = useCallback(
    (tableId: string, columnId: string, updates: Partial<ManualColumn>) => {
      setTables((prev) =>
        prev.map((t) => {
          if (t.id !== tableId) return t;
          return {
            ...t,
            columns: t.columns.map((c) => {
              if (c.id !== columnId) return c;
              return {
                ...c,
                ...updates,
                name: updates.name ? updates.name.toLowerCase().replace(/[^a-z0-9_]/g, '') : c.name,
              };
            }),
          };
        })
      );
    },
    []
  );

  // Delete a column
  const deleteColumn = useCallback((tableId: string, columnId: string) => {
    setTables((prev) =>
      prev.map((t) => {
        if (t.id !== tableId) return t;
        return {
          ...t,
          columns: t.columns.filter((c) => c.id !== columnId),
        };
      })
    );
  }, []);

  // Create relationship between two tables
  const addRelationship = useCallback(
    (params: {
      sourceTableId: string;
      sourceColumnName: string;
      targetTableId: string;
      targetColumnName: string;
      relationshipType: 'one-to-many' | 'many-to-many' | 'one-to-one';
    }) => {
      const { sourceTableId, sourceColumnName, targetTableId, targetColumnName, relationshipType } = params;

      setTables((prev) => {
        const sourceTable = prev.find((t) => t.id === sourceTableId);
        const targetTable = prev.find((t) => t.id === targetTableId);

        if (!sourceTable || !targetTable) return prev;

        // If many-to-many: Automatically generate a junction table!
        if (relationshipType === 'many-to-many') {
          const junctionName = `${sourceTable.name}_${targetTable.name}`;
          const junctionId = `tbl_junction_${Date.now()}`;

          const junctionTable: ManualTable = {
            id: junctionId,
            name: junctionName,
            position: {
              x: (sourceTable.position.x + targetTable.position.x) / 2,
              y: Math.max(sourceTable.position.y, targetTable.position.y) + 260,
            },
            columns: [
              {
                id: `col_j_id`,
                name: 'id',
                type: 'SERIAL',
                nullable: false,
                primaryKey: true,
                unique: true,
              },
              {
                id: `col_j_${sourceTable.name}_id`,
                name: `${sourceTable.name}_id`,
                type: 'INT',
                nullable: false,
                primaryKey: false,
                unique: false,
                references: {
                  table: sourceTable.name,
                  column: sourceColumnName,
                  relationshipType: 'one-to-many',
                },
              },
              {
                id: `col_j_${targetTable.name}_id`,
                name: `${targetTable.name}_id`,
                type: 'INT',
                nullable: false,
                primaryKey: false,
                unique: false,
                references: {
                  table: targetTable.name,
                  column: targetColumnName,
                  relationshipType: 'one-to-many',
                },
              },
              {
                id: `col_j_created_at`,
                name: 'created_at',
                type: 'TIMESTAMP',
                nullable: false,
                primaryKey: false,
                unique: false,
                defaultValue: 'now()',
              },
            ],
          };

          return [...prev, junctionTable];
        }

        // For one-to-many or one-to-one:
        // Source table gets foreign key reference to target table
        return prev.map((t) => {
          if (t.id !== sourceTableId) return t;

          // Check if column exists, otherwise create it
          const colExists = t.columns.some((c) => c.name === sourceColumnName);

          if (colExists) {
            return {
              ...t,
              columns: t.columns.map((c) => {
                if (c.name !== sourceColumnName) return c;
                return {
                  ...c,
                  references: {
                    table: targetTable.name,
                    column: targetColumnName,
                    relationshipType,
                  },
                };
              }),
            };
          } else {
            // Append foreign key column
            const newFkCol: ManualColumn = {
              id: `col_${Date.now()}_fk`,
              name: sourceColumnName,
              type: 'INT',
              nullable: false,
              primaryKey: false,
              unique: relationshipType === 'one-to-one',
              references: {
                table: targetTable.name,
                column: targetColumnName,
                relationshipType,
              },
            };
            return {
              ...t,
              columns: [...t.columns, newFkCol],
            };
          }
        });
      });
    },
    []
  );

  // Update table position after dragging
  const updateTablePosition = useCallback((tableId: string, position: { x: number; y: number }) => {
    setTables((prev) =>
      prev.map((t) => (t.id === tableId ? { ...t, position } : t))
    );
  }, []);

  // Clear all tables from canvas
  const clearCanvas = useCallback(() => {
    setTables([]);
  }, []);

  // Convert internal ManualTable[] to standard TableSchema[]
  const getSchemaTables = useCallback((): TableSchema[] => {
    return tables.map((t) => ({
      name: t.name,
      columns: t.columns.map((c) => {
        let typeStr = c.type;
        if (c.length && c.type.toUpperCase().startsWith('VARCHAR')) {
          typeStr = `VARCHAR(${c.length})`;
        }
        return {
          name: c.name,
          type: typeStr,
          references: c.references
            ? {
                table: c.references.table,
                column: c.references.column,
              }
            : undefined,
        };
      }),
    }));
  }, [tables]);

  // Auto-layout / tidy all tables on canvas
  const autoLayout = useCallback(() => {
    setTables((prev) => autoLayoutTables(prev));
  }, []);

  // Load standard TableSchema[] into canvas (e.g. from AI Generator or Supabase)
  const loadSchemaTables = useCallback((schemaTables: TableSchema[]) => {
    if (!Array.isArray(schemaTables)) return;
    setTables(autoLayoutTables(convertSchemaToManualTables(schemaTables)));
  }, []);

  return {
    tables,
    setTables,
    addTable,
    updateTableName,
    deleteTable,
    addColumn,
    updateColumn,
    deleteColumn,
    addRelationship,
    updateTablePosition,
    clearCanvas,
    getSchemaTables,
    loadSchemaTables,
    autoLayout,
    // Modals
    columnModal,
    setColumnModal,
    relationshipModal,
    setRelationshipModal,
    tableNameModal,
    setTableNameModal,
    contextMenu,
    setContextMenu,
  };
}

/**
 * Automatically calculates tidy, non-overlapping positions for all schema tables.
 * Uses topological / dependency tiering (independent parent tables first, then dependent child tables)
 * with dynamic vertical spacing that adapts to the column count of each table.
 */
export function autoLayoutTables(tables: ManualTable[]): ManualTable[] {
  if (!Array.isArray(tables) || tables.length === 0) return [];

  // Group by dependency level:
  // Tier 0: Root tables (0 foreign keys outgoing)
  // Tier 1: Tables with 1 foreign key
  // Tier 2: Tables with 2+ foreign keys (junction / child tables)
  const tier0: ManualTable[] = [];
  const tier1: ManualTable[] = [];
  const tier2: ManualTable[] = [];

  tables.forEach((t) => {
    const fkCount = (t.columns || []).filter((c) => c.references).length;
    if (fkCount === 0) {
      tier0.push(t);
    } else if (fkCount === 1) {
      tier1.push(t);
    } else {
      tier2.push(t);
    }
  });

  const ordered = [...tier0, ...tier1, ...tier2];

  const COL_WIDTH = 310;
  const H_GAP = 130; // 130px clean channel between columns for lines & labels
  const V_GAP = 95;  // 95px clear gap between bottom of one row and top of next
  const START_X = 60;
  const START_Y = 60;
  const PER_ROW = 3;

  const rows: ManualTable[][] = [];
  for (let i = 0; i < ordered.length; i += PER_ROW) {
    rows.push(ordered.slice(i, i + PER_ROW));
  }

  let currentY = START_Y;
  const result: ManualTable[] = [];

  rows.forEach((row) => {
    let maxRowHeight = 220;

    row.forEach((t) => {
      const colCount = t.columns?.length || 1;
      const estimatedH = 48 + colCount * 36 + 44 + 20;
      if (estimatedH > maxRowHeight) {
        maxRowHeight = estimatedH;
      }
    });

    row.forEach((t, colIdx) => {
      result.push({
        ...t,
        position: {
          x: START_X + colIdx * (COL_WIDTH + H_GAP),
          y: currentY,
        },
      });
    });

    currentY += maxRowHeight + V_GAP;
  });

  return result;
}

export function convertSchemaToManualTables(schemaTables: TableSchema[]): ManualTable[] {
  if (!Array.isArray(schemaTables) || schemaTables.length === 0) return [];

  const rawTables: ManualTable[] = schemaTables.map((t, idx) => {
    const columns: ManualColumn[] = (t.columns || []).map((c, cIdx) => {
      const isPk = c.name.toLowerCase() === 'id' || c.name.toLowerCase() === `${t.name.toLowerCase()}_id`;
      let typeStr = c.type || 'VARCHAR';
      let len: number | undefined = undefined;
      const match = typeStr.match(/VARCHAR\((\d+)\)/i);
      if (match) {
        typeStr = 'VARCHAR';
        len = parseInt(match[1], 10);
      }

      return {
        id: `col_${t.name}_${c.name}_${cIdx}`,
        name: c.name,
        type: typeStr,
        length: len,
        nullable: !isPk,
        primaryKey: isPk,
        unique: isPk,
        references: c.references
          ? {
              table: c.references.table,
              column: c.references.column,
              relationshipType: 'one-to-many',
            }
          : undefined,
      };
    });

    return {
      id: `tbl_${t.name}_${idx}`,
      name: t.name,
      position: { x: 0, y: 0 },
      columns,
    };
  });

  return autoLayoutTables(rawTables);
}
