import { Request, Response } from 'express';
import { AuthService, AuthError } from '../../services/AuthService';
import { ENV } from '../../config/env';

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
      if (err instanceof AuthError && err.requiresVerification) {
        return res.status(403).json({
          error: err.message,
          code: 'EMAIL_NOT_CONFIRMED',
          requiresVerification: true,
        });
      }
      return res.status(401).json({ error: err.message || 'Login failed' });
    }
  }

  public static async resendVerification(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
      const result = await AuthService.resendVerificationEmail(email);
      return res.status(200).json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message || 'Failed to resend verification email' });
    }
  }

  public static async verifyEmail(req: Request, res: Response) {
    try {
      const token = (req.query.token || req.query.token_hash) as string;
      const email = (req.query.email as string) || '';
      const type = (req.query.type as string) || 'signup';

      await AuthService.verifyEmail({ token, email, type });

      if (req.accepts('html')) {
        return res.redirect(`${ENV.APP_URL}/login?verified=true`);
      }

      return res.status(200).json({
        success: true,
        message: 'Email confirmed successfully! You can now log in.',
      });
    } catch (err: any) {
      if (req.accepts('html')) {
        return res.redirect(
          `${ENV.APP_URL}/login?error=${encodeURIComponent(err.message || 'Verification failed')}`
        );
      }
      return res.status(400).json({ error: err.message || 'Email verification failed' });
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
