import { groq, groqModel } from './client';
import type { ParsedSchema } from '@/types/schema';

const SYSTEM_PROMPT = `You are an expert PostgreSQL database architect. Parse natural language descriptions into a clean, normalized (3NF) relational database schema. Return ONLY valid JSON (no markdown fences, no backticks).

RULES:
1. Every table MUST have an 'id' primary key column with "isPrimaryKey": true (e.g. type: "SERIAL").
2. Foreign key columns must include "references": { "table": "parent_table", "column": "id" }.
3. Ensure parent tables exist and can be referenced cleanly.
4. Normalize to 3NF (eliminate transitive dependencies and redundant repeating groups).

Format:
{
  "tables": [
    {
      "name": "departments",
      "columns": [
        { "name": "id", "type": "SERIAL", "isPrimaryKey": true },
        { "name": "name", "type": "VARCHAR(255)", "nullable": false }
      ]
    },
    {
      "name": "students",
      "columns": [
        { "name": "id", "type": "SERIAL", "isPrimaryKey": true },
        { "name": "first_name", "type": "VARCHAR(255)", "nullable": false },
        { "name": "last_name", "type": "VARCHAR(255)", "nullable": false },
        { "name": "department_id", "type": "INT", "references": { "table": "departments", "column": "id" } }
      ]
    }
  ],
  "relationships": [
    {
      "fromTable": "departments",
      "fromColumn": "id",
      "toTable": "students",
      "toColumn": "department_id",
      "type": "one-to-many"
    }
  ],
  "clarifications": []
}`;

export async function parsePromptToSchema(userPrompt: string): Promise<ParsedSchema> {
  const response = await groq.chat.completions.create({
    model: groqModel,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.1,
    max_tokens: 3500,
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from Groq');

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid JSON response from Groq');

  return JSON.parse(jsonMatch[0]) as ParsedSchema;
}
