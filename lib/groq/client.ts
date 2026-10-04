import Groq from 'groq-sdk';

export const groqModel = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

function getApiKey(): string {
  const key = process.env.GROQ_API_KEY;
  if (!key || key.startsWith('gsk_placeholder')) {
    // If during build phase, return placeholder to allow compilation
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return 'gsk_placeholder_build_time_key';
    }
    // Return key if available or throw clear message at runtime
    return key || 'gsk_placeholder_build_time_key';
  }
  return key;
}

export const groq = new Proxy({} as Groq, {
  get(_target, prop) {
    const client = new Groq({ apiKey: getApiKey() });
    const value = (client as any)[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
