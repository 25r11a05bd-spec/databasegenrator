import Groq from 'groq-sdk';
import { ENV } from './env';

export const groq = new Groq({
  apiKey: ENV.GROQ_API_KEY,
});

export const groqModel = ENV.GROQ_MODEL;
