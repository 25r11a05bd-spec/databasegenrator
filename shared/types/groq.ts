import type { ParsedSchema } from './schema';

export interface GroqParseRequest {
  prompt: string;
}

export interface GroqAdjustRequest {
  currentSchema: ParsedSchema;
  adjustmentPrompt: string;
}

export interface GroqResponse {
  schema?: ParsedSchema;
  error?: string;
  clarifications?: string[];
}
