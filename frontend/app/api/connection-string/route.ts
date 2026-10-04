import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vhkwzctqkgaalmekeoge.supabase.co';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

  // Extract project ref (e.g. 'vhkwzctqkgaalmekeoge' from 'https://vhkwzctqkgaalmekeoge.supabase.co')
  const projectRef = supabaseUrl.replace('https://', '').split('.')[0];

  const directUri = `postgresql://postgres:[YOUR-PASSWORD]@db.${projectRef}.supabase.co:5432/postgres`;
  const poolerUri = `postgresql://postgres.${projectRef}:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true`;

  const envSnippet = `# Database connection strings
DATABASE_URL="${directUri}"
DIRECT_URL="${directUri}"

# Supabase Client API
NEXT_PUBLIC_SUPABASE_URL="${supabaseUrl}"
NEXT_PUBLIC_SUPABASE_ANON_KEY="${anonKey}"`;

  const prismaSnippet = `// schema.prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}`;

  const nodePgSnippet = `import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});`;

  return NextResponse.json({
    projectRef,
    supabaseUrl,
    anonKey,
    directUri,
    poolerUri,
    envSnippet,
    prismaSnippet,
    nodePgSnippet,
  });
}
