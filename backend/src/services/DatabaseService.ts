import { SqlService, TableDefinition } from './SqlService';
import { SupabaseService } from './SupabaseService';
import { ENV } from '../config/env';

export class DatabaseService {
  /**
   * Deploy tables to Supabase PostgreSQL.
   */
  public static async deployTables(tables: TableDefinition[], userId?: string, name?: string) {
    if (!Array.isArray(tables) || tables.length === 0) {
      throw new Error('No tables provided for deployment');
    }

    const ddlQuery = SqlService.generateCreateSql(tables);
    const execResult = await SupabaseService.executeSql(ddlQuery);

    if (!execResult.success) {
      const err = execResult.error;
      const isMissingFunction =
        err?.code === 'PGRST202' ||
        err?.message?.toLowerCase().includes('could not find the function') ||
        err?.message?.toLowerCase().includes('does not exist');

      if (isMissingFunction) {
        return {
          success: false,
          requiresSetup: true,
          error: "Supabase requires the one-time 'sql' RPC helper function to deploy tables.",
          setupSql: `CREATE OR REPLACE FUNCTION sql(query text)\nRETURNS void\nLANGUAGE plpgsql\nSECURITY DEFINER\nAS $$\nBEGIN\n  EXECUTE query;\nEND;\n$$;`,
          schemaSql: ddlQuery,
          sqlEditorUrl: `${ENV.SUPABASE_URL.replace('https://', 'https://supabase.com/dashboard/project/').split('.')[0]}/sql/new`,
        };
      }

      throw new Error(err?.message || 'Database error occurred during table creation');
    }

    // Return connection strings and metadata
    const connectionStrings = this.getConnectionStrings();

    if (userId) {
      await SupabaseService.recordDatabase({
        userId,
        databaseName: name || `${tables[0]?.name || 'App'} Database`,
        schemaJson: { tables },
        connectionString: connectionStrings.directUri,
      });
    }

    return {
      success: true,
      message: `Successfully deployed ${tables.length} table(s) to Supabase!`,
      connectionStrings,
      schemaSql: ddlQuery,
    };
  }

  /**
   * Delete database and drop its tables from Supabase PostgreSQL.
   */
  public static async deleteDatabase(params: {
    id: string | number;
    tables?: { name: string }[];
    userId?: string;
  }) {
    let droppedTables: string[] = [];

    // Drop actual tables in Supabase
    if (params.tables && params.tables.length > 0) {
      const tableNames = params.tables.map((t) => t.name);
      const dropRes = await SupabaseService.dropTables(tableNames);
      if (dropRes.success) {
        droppedTables = dropRes.dropped;
      }
    }

    // Delete record from Supabase table
    await SupabaseService.deleteDatabaseRecord(params.id, params.userId);

    return {
      success: true,
      message:
        droppedTables.length > 0
          ? `Dropped ${droppedTables.length} table(s) (${droppedTables.join(', ')}) from Supabase and removed record.`
          : 'Database record removed.',
      droppedTables,
    };
  }

  /**
   * Formats database connection strings in all supported formats.
   */
  public static getConnectionStrings() {
    const projectRef = ENV.SUPABASE_URL.replace('https://', '').split('.')[0];
    const directUri = `postgresql://postgres:[YOUR-PASSWORD]@db.${projectRef}.supabase.co:5432/postgres`;
    const poolerUri = `postgresql://postgres.${projectRef}:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true`;

    const envSnippet = `# PostgreSQL Database Connection
DATABASE_URL="${directUri}"
DIRECT_URL="${directUri}"

# Supabase Client API
NEXT_PUBLIC_SUPABASE_URL="${ENV.SUPABASE_URL}"
NEXT_PUBLIC_SUPABASE_ANON_KEY="${ENV.SUPABASE_ANON_KEY}"`;

    const prismaSnippet = `datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}`;

    const nodePgSnippet = `import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});`;

    return {
      projectRef,
      supabaseUrl: ENV.SUPABASE_URL,
      anonKey: ENV.SUPABASE_ANON_KEY,
      directUri,
      poolerUri,
      envSnippet,
      prismaSnippet,
      nodePgSnippet,
    };
  }
}
