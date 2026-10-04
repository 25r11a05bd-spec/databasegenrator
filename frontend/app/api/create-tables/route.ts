import { supabaseAdmin } from '@/lib/auth/supabaseAdmin';
import type { NextRequest } from 'next/server';
import { generateSQL } from '@/lib/util/sqlGenerator';

const SETUP_SQL = `-- Run this once in your Supabase SQL Editor to enable 1-click deployments:
CREATE OR REPLACE FUNCTION sql(query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  EXECUTE query;
END;
$$;`;

export async function POST(request: NextRequest) {
  try {
    const { tables } = await request.json();
    if (!Array.isArray(tables) || tables.length === 0) {
      return new Response(JSON.stringify({ error: 'No tables provided to deploy' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const fullSql = generateSQL(tables);

    // Try executing full schema via RPC 'sql' function
    const { error: rpcError } = await supabaseAdmin.rpc('sql', { query: fullSql });

    if (rpcError) {
      console.warn('Supabase RPC execution notice:', rpcError);

      // PGRST202 = function does not exist in schema cache
      const isMissingFunction =
        rpcError.code === 'PGRST202' ||
        rpcError.message?.toLowerCase().includes('could not find the function') ||
        rpcError.message?.toLowerCase().includes('does not exist');

      if (isMissingFunction) {
        return new Response(
          JSON.stringify({
            success: false,
            requiresSetup: true,
            error: "Supabase requires a one-time 'sql' RPC helper function for automated DDL deployments.",
            setupSql: SETUP_SQL,
            schemaSql: fullSql,
            sqlEditorUrl: 'https://supabase.com/dashboard/project/vhkwzctqkgaalmekeoge/sql/new',
          }),
          { status: 428, headers: { 'Content-Type': 'application/json' } }
        );
      }

      // Any other Postgres error (e.g., duplicate relation, constraint error)
      return new Response(
        JSON.stringify({
          success: false,
          error: rpcError.message || 'Database error occurred during table creation.',
          schemaSql: fullSql,
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vhkwzctqkgaalmekeoge.supabase.co';
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const projectRef = supabaseUrl.replace('https://', '').split('.')[0];
    const directUri = `postgresql://postgres:[YOUR-PASSWORD]@db.${projectRef}.supabase.co:5432/postgres`;
    const poolerUri = `postgresql://postgres.${projectRef}:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true`;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully created ${tables.length} table(s) in Supabase!`,
        connectionStrings: {
          directUri,
          poolerUri,
          supabaseUrl,
          anonKey,
          projectRef,
          envSnippet: `# Database Connection\nDATABASE_URL="${directUri}"\nDIRECT_URL="${directUri}"\n\n# Supabase Client API\nNEXT_PUBLIC_SUPABASE_URL="${supabaseUrl}"\nNEXT_PUBLIC_SUPABASE_ANON_KEY="${anonKey}"`,
        },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err: any) {
    console.error('Create tables API error:', err);
    return new Response(
      JSON.stringify({ error: err.message || 'Server error deploying tables' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
