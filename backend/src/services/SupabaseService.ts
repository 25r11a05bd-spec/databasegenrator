import { supabaseAdmin, supabasePublic } from '../config/supabase';

export class SupabaseService {
  /**
   * Execute arbitrary DDL SQL via the PostgreSQL 'sql' RPC function.
   */
  public static async executeSql(query: string): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabaseAdmin.rpc('sql', { query });
      if (error) {
        return { success: false, error };
      }
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err };
    }
  }

  /**
   * Drops a list of tables using DROP TABLE IF EXISTS ... CASCADE.
   */
  public static async dropTables(tableNames: string[]): Promise<{ success: boolean; dropped: string[]; error?: any }> {
    const validNames = tableNames
      .filter((n) => typeof n === 'string' && n.trim())
      .map((n) => n.replace(/[^a-zA-Z0-9_]/g, ''));

    if (validNames.length === 0) {
      return { success: true, dropped: [] };
    }

    const dropSql = validNames.map((name) => `DROP TABLE IF EXISTS "${name}" CASCADE;`).join(' ');
    const result = await this.executeSql(dropSql);

    if (!result.success) {
      return { success: false, dropped: [], error: result.error };
    }

    return { success: true, dropped: validNames };
  }

  /**
   * Save database record in created_databases table.
   */
  public static async recordDatabase(params: {
    userId: string;
    databaseName: string;
    schemaJson: any;
    connectionString: string;
  }) {
    try {
      const { data, error } = await supabaseAdmin.from('created_databases').insert([
        {
          user_id: params.userId,
          database_name: params.databaseName,
          schema_json: params.schemaJson,
          connection_string: params.connectionString,
        },
      ]);
      if (error) throw error;
      return data;
    } catch (err) {
      console.warn('created_databases insert notice:', err);
      return null;
    }
  }

  /**
   * Delete database record from created_databases.
   */
  public static async deleteDatabaseRecord(id: string | number, userId?: string) {
    try {
      if (!isNaN(Number(id))) {
        await supabaseAdmin.from('created_databases').delete().eq('id', Number(id));
      } else if (userId) {
        await supabaseAdmin.from('created_databases').delete().eq('user_id', userId).eq('id', id);
      }
    } catch (err) {
      console.warn('created_databases delete notice:', err);
    }
  }

  /**
   * Fetch all databases for a specific user.
   */
  public static async getUserDatabases(userId: string) {
    try {
      const { data, error } = await supabaseAdmin
        .from('created_databases')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (err) {
      console.warn('created_databases fetch notice:', err);
      return [];
    }
  }
}
