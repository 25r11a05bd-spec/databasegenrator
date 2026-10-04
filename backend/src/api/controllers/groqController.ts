import { Request, Response } from 'express';
import { GroqService } from '../../services/GroqService';

export class GroqController {
  public static async parse(req: Request, res: Response) {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const schema = await GroqService.parsePrompt(prompt);
      return res.status(200).json(schema);
    } catch (err: any) {
      console.error('Groq parse error:', err);
      return res.status(500).json({ error: err.message || 'Failed to parse schema prompt' });
    }
  }

  public static async adjust(req: Request, res: Response) {
    try {
      const { currentSchema, adjustmentPrompt } = req.body;
      if (!currentSchema || !adjustmentPrompt) {
        return res.status(400).json({ error: 'currentSchema and adjustmentPrompt are required' });
      }

      const schema = await GroqService.adjustSchema(currentSchema, adjustmentPrompt);
      return res.status(200).json(schema);
    } catch (err: any) {
      console.error('Groq adjust error:', err);
      return res.status(500).json({ error: err.message || 'Failed to adjust schema' });
    }
  }

  public static async clarify(_req: Request, res: Response) {
    return res.status(200).json({ clarifications: [] });
  }
}
