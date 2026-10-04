import Groq from 'groq-sdk';

const groqApiKey = process.env.GROQ_API_KEY;
const groqModel = process.env.GROQ_MODEL || 'openai/gpt-oss-120b';

export const groq = new Groq({ apiKey: groqApiKey });
export { groqModel };
