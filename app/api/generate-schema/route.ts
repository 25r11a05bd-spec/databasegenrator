import { parsePromptToSchema } from '@/lib/groq/parsers';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid prompt' }), { status: 400 });
    }

    const schema = await parsePromptToSchema(prompt);

    return new Response(JSON.stringify({ tables: schema.tables, relationships: schema.relationships, clarifications: schema.clarifications }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('Schema generation error:', err);
    return new Response(JSON.stringify({ error: err.message || 'Server error' }), { status: 500 });
  }
}
