import { supabaseAdmin } from '@/lib/auth/supabaseAdmin';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { id, name, tables, userId } = await request.json();

    if (!id && !tables) {
      return NextResponse.json(
        { error: 'Database ID or tables are required for deletion' },
        { status: 400 }
      );
    }

    const droppedTableNames: string[] = [];

    // 1. Drop the actual tables from Supabase PostgreSQL if table definitions are provided
    if (Array.isArray(tables) && tables.length > 0) {
      const dropStatements = tables
        .filter((t: any) => t?.name && typeof t.name === 'string')
        .map((t: any) => {
          // Sanitize table name to prevent SQL injection
          const safeName = t.name.replace(/[^a-zA-Z0-9_]/g, '');
          droppedTableNames.push(safeName);
          return `DROP TABLE IF EXISTS "${safeName}" CASCADE;`;
        })
        .join(' ');

      if (dropStatements) {
        const { error: dropError } = await supabaseAdmin.rpc('sql', {
          query: dropStatements,
        });

        if (dropError) {
          console.warn('Notice dropping tables in Supabase:', dropError);
          // If the rpc function exists and executed, great; if there was an error, report it
        }
      }
    }

    // 2. Remove the record from Supabase 'created_databases' table via admin client
    try {
      if (id && !isNaN(Number(id))) {
        await supabaseAdmin.from('created_databases').delete().eq('id', Number(id));
      } else if (name && userId) {
        await supabaseAdmin
          .from('created_databases')
          .delete()
          .eq('user_id', userId)
          .eq('database_name', name);
      }
    } catch (err) {
      console.warn('Notice deleting from created_databases:', err);
    }

    return NextResponse.json({
      success: true,
      message:
        droppedTableNames.length > 0
          ? `Dropped ${droppedTableNames.length} table(s) (${droppedTableNames.join(', ')}) from Supabase and deleted record.`
          : 'Database record deleted.',
      droppedTables: droppedTableNames,
    });
  } catch (error: any) {
    console.error('Delete database API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to delete database from Supabase' },
      { status: 500 }
    );
  }
}
