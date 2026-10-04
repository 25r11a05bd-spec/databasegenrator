import type { SchemaTable } from './schema';

export interface SavedDatabase {
  id: string;
  name: string;
  prompt?: string;
  tables: SchemaTable[];
  createdAt: string;
  deployed?: boolean;
  deployedAt?: string;
  connectionString: string;
  poolerString: string;
}

export interface ConnectionStrings {
  projectRef: string;
  supabaseUrl: string;
  anonKey: string;
  directUri: string;
  poolerUri: string;
  envSnippet: string;
  prismaSnippet: string;
  nodePgSnippet: string;
}

export interface CreateDatabaseRequest {
  tables: SchemaTable[];
  name?: string;
  prompt?: string;
  userId?: string;
}
