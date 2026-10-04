import { Request, Response } from 'express';
import { AuthService } from '../../services/AuthService';

export class AuthController {
  public static async register(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.registerUser(email, password);
      return res.status(201).json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Registration failed' });
    }
  }

  public static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await AuthService.loginUser(email, password);
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(401).json({ error: err.message || 'Login failed' });
    }
  }

  public static async confirm(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await AuthService.confirmUser(email);
      return res.status(200).json({
        success: true,
        message: 'Email confirmed successfully! You can now log in.',
        user,
      });
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Confirmation failed' });
    }
  }

  public static async logout(_req: Request, res: Response) {
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  }
}
