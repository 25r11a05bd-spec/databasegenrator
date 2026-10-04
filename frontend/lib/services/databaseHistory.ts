import type { TableSchema } from '@/lib/store/schemaStore';
import { supabase } from '@/lib/auth/supabaseAuth';

export interface SavedDatabase {
  id: string;
  name: string;
  prompt?: string;
  tables: TableSchema[];
  createdAt: string;
  deployed?: boolean;
  deployedAt?: string;
  connectionString: string;
  poolerString: string;
}

const STORAGE_KEY = 'db_generator_saved_databases';

const DEFAULT_CONN_STRING =
  'postgresql://postgres:[YOUR-PASSWORD]@db.vhkwzctqkgaalmekeoge.supabase.co:5432/postgres';
const DEFAULT_POOLER_STRING =
  'postgresql://postgres.vhkwzctqkgaalmekeoge:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true';

// Helper to get local databases with automatic duplicate cleanup
export function getLocalDatabases(): SavedDatabase[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list: SavedDatabase[] = JSON.parse(raw);
    const cleaned = deduplicateDatabases(list);
    if (cleaned.length !== list.length) {
      saveLocalDatabases(cleaned);
    }
    return cleaned;
  } catch {
    return [];
  }
}

// Deduplicate databases that have identical table structures or belong to the same prompt session
export function deduplicateDatabases(list: SavedDatabase[]): SavedDatabase[] {
  if (!Array.isArray(list) || list.length === 0) return [];

  // Step 1: Clean names of all items (don't leave comma-separated table names as database names)
  const normalized = list.map((db) => {
    let name = db.name;
    const isCommaSeparated = name.includes(',') || (name.includes(' Database') && name.split(',').length > 1);
    if (isCommaSeparated || !name || name === 'Untitled Database' || name === 'Database') {
      name = deriveNameFromPrompt(db.prompt, db.tables);
    }
    return { ...db, name };
  });

  // Step 2: Group by prompt (if prompt exists and is substantial)
  // Two entries with similar prompt belong to the same prompt session -> same main database!
  const groupedByPrompt: SavedDatabase[] = [];
  const promptMap = new Map<string, SavedDatabase>();

  for (const db of normalized) {
    const rawPrompt = (db.prompt || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    if (rawPrompt.length > 8) {
      if (!promptMap.has(rawPrompt)) {
        promptMap.set(rawPrompt, { ...db, tables: [...(db.tables || [])] });
      } else {
        const existing = promptMap.get(rawPrompt)!;
        // Merge tables by unique name
        const tableMap = new Map<string, TableSchema>();
        existing.tables.forEach((t) => tableMap.set(t.name.toLowerCase(), t));
        (db.tables || []).forEach((t) => {
          if (!tableMap.has(t.name.toLowerCase())) {
            tableMap.set(t.name.toLowerCase(), t);
          } else {
            // Pick table with more columns
            const cur = tableMap.get(t.name.toLowerCase())!;
            if ((t.columns?.length || 0) > (cur.columns?.length || 0)) {
              tableMap.set(t.name.toLowerCase(), t);
            }
          }
        });
        existing.tables = Array.from(tableMap.values());
        existing.deployed = existing.deployed || db.deployed;
        if (new Date(db.createdAt).getTime() > new Date(existing.createdAt).getTime()) {
          existing.createdAt = db.createdAt;
        }
      }
    } else {
      groupedByPrompt.push(db);
    }
  }

  const mergedPromptList = [...Array.from(promptMap.values()), ...groupedByPrompt];

  // Step 3: Foreign Key / Relational Clustering
  // If entry A has tables that reference tables in entry B, or vice-versa, merge them into ONE database!
  const finalDatabases: SavedDatabase[] = [];

  for (const db of mergedPromptList) {
    if (!db.tables || db.tables.length === 0) continue;

    let mergedInto: SavedDatabase | null = null;

    for (const target of finalDatabases) {
      const targetTableNames = new Set(target.tables.map((t) => t.name.toLowerCase()));
      const curTableNames = new Set(db.tables.map((t) => t.name.toLowerCase()));

      // 1. Any table name collision?
      const sharesTables = Array.from(curTableNames).some((name) => targetTableNames.has(name));

      // 2. Any foreign key reference between them?
      const targetFks = target.tables.flatMap((t) =>
        t.columns.filter((c) => c.references?.table).map((c) => c.references!.table.toLowerCase())
      );
      const curFks = db.tables.flatMap((t) =>
        t.columns.filter((c) => c.references?.table).map((c) => c.references!.table.toLowerCase())
      );

      const hasFkRelation =
        curFks.some((ref) => targetTableNames.has(ref)) ||
        targetFks.some((ref) => curTableNames.has(ref));

      // 3. Subsets?
      const isSubset = Array.from(curTableNames).every((name) => targetTableNames.has(name));
      const isTargetSubset = Array.from(targetTableNames).every((name) => curTableNames.has(name));

      if (sharesTables || hasFkRelation || isSubset || isTargetSubset) {
        mergedInto = target;
        break;
      }
    }

    if (mergedInto) {
      const tableMap = new Map<string, TableSchema>();
      mergedInto.tables.forEach((t) => tableMap.set(t.name.toLowerCase(), t));
      db.tables.forEach((t) => {
        if (!tableMap.has(t.name.toLowerCase())) {
          tableMap.set(t.name.toLowerCase(), t);
        } else {
          const cur = tableMap.get(t.name.toLowerCase())!;
          if ((t.columns?.length || 0) > (cur.columns?.length || 0)) {
            tableMap.set(t.name.toLowerCase(), t);
          }
        }
      });
      mergedInto.tables = Array.from(tableMap.values());
      mergedInto.deployed = mergedInto.deployed || db.deployed;
      mergedInto.prompt = mergedInto.prompt || db.prompt;
      mergedInto.name = deriveNameFromPrompt(mergedInto.prompt, mergedInto.tables);
    } else {
      finalDatabases.push({
        ...db,
        name: deriveNameFromPrompt(db.prompt, db.tables),
      });
    }
  }

  // Sort by createdAt descending
  return finalDatabases.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

// Helper to save local databases
export function saveLocalDatabases(dbs: SavedDatabase[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dbs));
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

// Fetch all databases (merges local + Supabase if available)
export async function getAllDatabases(userId?: string): Promise<SavedDatabase[]> {
  const localList = getLocalDatabases();

  if (!userId) {
    return localList;
  }

  try {
    const { data, error } = await supabase
      .from('created_databases')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      const remoteList: SavedDatabase[] = data.map((row: any) => ({
        id: String(row.id),
        name: row.database_name || 'Untitled Database',
        prompt: row.schema_json?.prompt || undefined,
        tables: Array.isArray(row.schema_json?.tables)
          ? row.schema_json.tables
          : Array.isArray(row.schema_json)
          ? row.schema_json
          : [],
        createdAt: row.created_at,
        deployed: true,
        connectionString: row.connection_string || DEFAULT_CONN_STRING,
        poolerString: DEFAULT_POOLER_STRING,
      }));

      // Merge remote & local avoiding duplicate IDs
      const mergedMap = new Map<string, SavedDatabase>();
      remoteList.forEach((db) => mergedMap.set(db.id, db));
      localList.forEach((db) => {
        if (!mergedMap.has(db.id)) {
          mergedMap.set(db.id, db);
        }
      });

      const combined = Array.from(mergedMap.values());
      return deduplicateDatabases(combined);
    }
  } catch (err) {
    console.warn('Remote fetch notice (using local storage):', err);
  }

  return localList;
}

// Save or update a database record
export async function persistDatabase(params: {
  id?: string | null;
  name?: string;
  prompt?: string;
  tables: TableSchema[];
  userId?: string;
  deployed?: boolean;
}): Promise<SavedDatabase> {
  const localList = getLocalDatabases();
  const name =
    params.name || deriveNameFromPrompt(params.prompt, params.tables);

  let existingIndex = -1;

  if (params.id) {
    existingIndex = localList.findIndex((d) => d.id === params.id);
  }

  if (existingIndex === -1 && params.prompt) {
    const p = params.prompt.trim().toLowerCase().replace(/[^a-z0-9]/g, '');
    existingIndex = localList.findIndex((d) => {
      const dp = (d.prompt || '').trim().toLowerCase().replace(/[^a-z0-9]/g, '');
      return dp.length > 8 && dp === p;
    });
  }

  if (existingIndex === -1 && params.tables.length > 0) {
    const currentTableNames = new Set(params.tables.map((t) => t.name.toLowerCase()));
    existingIndex = localList.findIndex((d) => {
      const otherNames = (d.tables || []).map((t) => t.name.toLowerCase());
      return otherNames.some((name) => currentTableNames.has(name));
    });
  }

  const id =
    existingIndex !== -1
      ? localList[existingIndex].id
      : params.id || `db_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

  const existing = existingIndex !== -1 ? localList[existingIndex] : null;

  const targetDb: SavedDatabase = {
    id,
    name: params.name || existing?.name || name,
    prompt: params.prompt || existing?.prompt,
    tables: params.tables,
    createdAt: existing?.createdAt || new Date().toISOString(),
    deployed: params.deployed ?? existing?.deployed ?? false,
    deployedAt: params.deployed ? new Date().toISOString() : existing?.deployedAt,
    connectionString: DEFAULT_CONN_STRING,
    poolerString: DEFAULT_POOLER_STRING,
  };

  const updatedList =
    existingIndex !== -1
      ? localList.map((d, i) => (i === existingIndex ? targetDb : d))
      : [targetDb, ...localList];

  const cleaned = deduplicateDatabases(updatedList);
  saveLocalDatabases(cleaned);

  // Attempt sync to Supabase if user is authenticated
  if (params.userId) {
    try {
      await supabase.from('created_databases').insert([
        {
          user_id: params.userId,
          database_name: targetDb.name,
          schema_json: { tables: params.tables, prompt: targetDb.prompt },
          connection_string: DEFAULT_CONN_STRING,
        },
      ]);
    } catch (err) {
      console.warn('Supabase DB record sync notice:', err);
    }
  }

  return targetDb;
}

// Delete database record and drop its tables from Supabase
export async function removeDatabase(params: {
  id: string;
  name?: string;
  tables?: TableSchema[];
  userId?: string;
}): Promise<{ success: boolean; message: string }> {
  // 1. Remove from local storage
  const localList = getLocalDatabases();
  saveLocalDatabases(localList.filter((db) => db.id !== params.id));

  // 2. Call server API to drop tables from Supabase PostgreSQL & remove database record
  try {
    const res = await fetch('/api/delete-database', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: params.id,
        name: params.name,
        tables: params.tables || [],
        userId: params.userId,
      }),
    });

    const data = await res.json();
    return {
      success: true,
      message: data.message || 'Database and tables removed from Supabase.',
    };
  } catch (err: any) {
    console.warn('API delete-database notice:', err);
    return {
      success: true,
      message: 'Database removed from history.',
    };
  }
}

export function deriveNameFromPrompt(prompt?: string, tables?: TableSchema[]): string {
  if (prompt && prompt.trim()) {
    let cleaned = prompt
      .replace(/^(can\s+you|please|i\s+want\s+you\s+to|i\s+need\s+you\s+to|i\s+want|i\s+need|generate|create|build|make)\s+/i, '')
      .replace(/^(a\s+|an\s+|the\s+)?(database\s+for\s+|bdata\s+base\s+for\s+|bdata\s+for\s+|data\s+base\s+for\s+|database\s+of\s+|schema\s+for\s+|database\s+with\s+|table\s+with\s+name\s+|database\s+)/i, '')
      .replace(/\s+(i\s+need|need|which\s+are|which|connected|tabled|tables|that|follow|following|3nf|normalized|relational).*/i, '')
      .trim();

    const words = cleaned.split(/\s+/).slice(0, 3).join(' ');
    const title = words
      .split(' ')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
      .join(' ')
      .trim();

    if (title && title.length > 2 && !title.toLowerCase().includes('data base') && !title.toLowerCase().includes('database')) {
      return `${title} Database`;
    } else if (title && title.length > 2) {
      return title;
    }
  }

  if (tables && tables.length > 0) {
    const tableNames = tables.map((t) => t.name.toLowerCase());
    if (tableNames.some((n) => n.includes('school') || n.includes('student') || n.includes('grade') || n.includes('teacher') || n.includes('course') || n.includes('department') || n.includes('classroom'))) {
      return 'School Management Database';
    }
    if (tableNames.some((n) => n.includes('order') || n.includes('product') || n.includes('cart') || n.includes('item'))) {
      return 'E-Commerce Database';
    }
    if (tableNames.some((n) => n.includes('post') || n.includes('comment') || n.includes('author') || n.includes('blog'))) {
      return 'Blog Platform Database';
    }
    if (tableNames.some((n) => n.includes('patient') || n.includes('doctor') || n.includes('appointment') || n.includes('hospital'))) {
      return 'Hospital Management Database';
    }
    if (tableNames.some((n) => n.includes('employee') || n.includes('salary') || n.includes('payroll'))) {
      return 'HR & Payroll Database';
    }
    const first = tables[0]?.name || 'Application';
    return `${capitalize(first)} Database`;
  }

  return 'Relational Database';
}

function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

