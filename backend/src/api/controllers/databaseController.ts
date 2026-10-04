import { Request, Response } from 'express';
import { DatabaseService } from '../../services/DatabaseService';
import { SupabaseService } from '../../services/SupabaseService';

export class DatabaseController {
  public static async create(req: Request, res: Response) {
    try {
      const { tables, userId, name } = req.body;
      const result = await DatabaseService.deployTables(tables, userId, name);

      if ((result as any).requiresSetup) {
        return res.status(428).json(result);
      }

      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to deploy database' });
    }
  }

  public static async history(req: Request, res: Response) {
    try {
      const userId = (req.query.userId as string) || '';
      if (!userId) {
        return res.status(200).json([]);
      }
      const data = await SupabaseService.getUserDatabases(userId);
      return res.status(200).json(data);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch history' });
    }
  }

  public static async delete(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const { tables, userId } = req.body;
      const result = await DatabaseService.deleteDatabase({ id, tables, userId });
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to delete database' });
    }
  }

  public static async connectionString(_req: Request, res: Response) {
    try {
      const strings = DatabaseService.getConnectionStrings();
      return res.status(200).json(strings);
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to get connection strings' });
    }
  }
}
