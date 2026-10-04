import { mergeSchemaAdjustment } from '@/lib/groq/schemaMerger';
import type { NextRequest } from 'next/server';
import type { ParsedSchema } from '@/types/schema';

export async function POST(request: NextRequest) {
  try {
    const { currentSchema, adjustmentPrompt } = await request.json();

    if (!currentSchema || !adjustmentPrompt) {
      return new Response(
        JSON.stringify({ error: 'currentSchema and adjustmentPrompt required' }),
        { status: 400 },
      );
    }

    const mergedSchema = await mergeSchemaAdjustment(currentSchema as ParsedSchema, adjustmentPrompt);

    return new Response(JSON.stringify({ schema: mergedSchema }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || 'Adjustment failed' }), { status: 500 });
  }
}
