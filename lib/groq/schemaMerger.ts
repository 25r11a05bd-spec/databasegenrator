import { groq, groqModel } from './client';
import type { ParsedSchema } from '@/types/schema';

export async function mergeSchemaAdjustment(
  currentSchema: ParsedSchema,
  adjustmentPrompt: string,
): Promise<ParsedSchema> {
  const mergePrompt = `You are merging a database schema adjustment.

Current schema:
${JSON.stringify(currentSchema, null, 2)}

User adjustment: "${adjustmentPrompt}"

Merge the adjustment into the current schema. Add new tables/columns if needed.
Don't remove existing tables unless explicitly asked.
Return complete merged schema as JSON only (no markdown, no explanation).`;

  const response = await groq.chat.completions.create({
    model: groqModel,
    messages: [{ role: 'user', content: mergePrompt }],
    temperature: 0.7,
    max_tokens: 2048,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from Groq');

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid JSON response from Groq');

  return JSON.parse(jsonMatch[0]) as ParsedSchema;
}
