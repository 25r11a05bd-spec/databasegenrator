import { supabaseAdmin, supabasePublic } from '../config/supabase';
import { ENV } from '../config/env';
import { EmailService } from './EmailService';

export class AuthError extends Error {
  public code?: string;
  public requiresVerification?: boolean;

  constructor(message: string, code?: string, requiresVerification?: boolean) {
    super(message);
    this.name = 'AuthError';
    this.code = code;
    this.requiresVerification = requiresVerification;
  }
}

export class AuthService {
  /**
   * Register a user with email verification dispatched via Resend.
   */
  public static async registerUser(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Check if user already exists
    const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
    const existing = usersData?.users?.find((u) => u.email?.toLowerCase() === normalizedEmail);

    if (existing) {
      const isAlreadyConfirmed = Boolean(existing.email_confirmed_at);

      if (isAlreadyConfirmed) {
        throw new Error('An account with this email already exists. Please log in.');
      }

      // Existing unconfirmed user: update password and generate fresh verification link
      await supabaseAdmin.auth.admin.updateUserById(existing.id, {
        password,
        email_confirm: false,
      });

      const { data: linkData } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: normalizedEmail,
        options: {
          redirectTo: `${ENV.APP_URL}/login?verified=true`,
        },
      });

      const verificationLink =
        linkData?.properties?.action_link || `${ENV.APP_URL}/login?email=${encodeURIComponent(normalizedEmail)}`;

      await EmailService.sendVerificationEmail({
        to: normalizedEmail,
        verificationLink,
        otpCode: linkData?.properties?.email_otp,
        isNewUserLogin: false,
      });

      return {
        success: true,
        message: 'Account exists but was unverified. A new verification email has been sent to your inbox!',
        requiresVerification: true,
        email: normalizedEmail,
      };
    }

    // New user registration: generate signup link and create user with unconfirmed email
    const { data: linkData, error: createError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email: normalizedEmail,
      password,
      options: {
        redirectTo: `${ENV.APP_URL}/login?verified=true`,
      },
    });

    if (createError) {
      // Fallback: createUser with email_confirm: false
      const { data: newUser, error: directCreateError } = await supabaseAdmin.auth.admin.createUser({
        email: normalizedEmail,
        password,
        email_confirm: false,
      });

      if (directCreateError) {
        throw new Error(directCreateError.message);
      }

      const { data: magicLinkData } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: normalizedEmail,
        options: {
          redirectTo: `${ENV.APP_URL}/login?verified=true`,
        },
      });

      const fallbackLink =
        magicLinkData?.properties?.action_link ||
        `${ENV.APP_URL}/login?email=${encodeURIComponent(normalizedEmail)}`;

      await EmailService.sendVerificationEmail({
        to: normalizedEmail,
        verificationLink: fallbackLink,
        otpCode: magicLinkData?.properties?.email_otp,
        isNewUserLogin: false,
      });

      // Try creating profile record safely
      if (newUser?.user) {
        try {
          await supabaseAdmin
            .from('profiles')
            .insert([{ id: newUser.user.id, email: newUser.user.email }]);
        } catch (err) {
          console.warn('Profiles table insert skipped:', err);
        }
      }

      return {
        success: true,
        message: 'Account created! Please check your email to verify your address.',
        requiresVerification: true,
        user: newUser.user,
        email: normalizedEmail,
      };
    }

    const verificationLink =
      linkData?.properties?.action_link ||
      `${ENV.APP_URL}/login?email=${encodeURIComponent(normalizedEmail)}`;

    await EmailService.sendVerificationEmail({
      to: normalizedEmail,
      verificationLink,
      otpCode: linkData?.properties?.email_otp,
      isNewUserLogin: false,
    });

    // Try creating profile record safely
    if (linkData?.user) {
      try {
        await supabaseAdmin
          .from('profiles')
          .insert([{ id: linkData.user.id, email: linkData.user.email }]);
      } catch (err) {
        console.warn('Profiles table insert skipped:', err);
      }
    }

    return {
      success: true,
      message: 'Account created successfully! A verification email has been sent to your inbox.',
      requiresVerification: true,
      user: linkData.user,
      email: normalizedEmail,
    };
  }

  /**
   * Sign in using email and password.
   * If user email is unconfirmed, triggers verification email via Resend and requires verification.
   */
  public static async loginUser(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    const normalizedEmail = email.trim().toLowerCase();

    const { data, error } = await supabasePublic.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      if (error.message?.toLowerCase().includes('email not confirmed')) {
        throw new AuthError(
          'Email not verified yet. Please click the verification link sent to your inbox during registration before logging in.',
          'EMAIL_NOT_CONFIRMED',
          false
        );
      }
      throw error;
    }

    return data;
  }

  /**
   * Resend a verification email to an unverified user.
   */
  public static async resendVerificationEmail(email: string) {
    if (!email) {
      throw new Error('Email is required');
    }

    const normalizedEmail = email.trim().toLowerCase();
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    const user = usersData?.users?.find((u) => u.email?.toLowerCase() === normalizedEmail);
    if (!user) {
      throw new Error('No user found with this email address');
    }

    if (user.email_confirmed_at) {
      return {
        success: true,
        message: 'This email is already verified. You can log in directly.',
        alreadyVerified: true,
      };
    }

    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: normalizedEmail,
      options: {
        redirectTo: `${ENV.APP_URL}/login?verified=true`,
      },
    });

    if (linkError) throw linkError;

    const verificationLink =
      linkData?.properties?.action_link || `${ENV.APP_URL}/login?email=${encodeURIComponent(normalizedEmail)}`;

    await EmailService.sendVerificationEmail({
      to: normalizedEmail,
      verificationLink,
      otpCode: linkData?.properties?.email_otp,
      isNewUserLogin: true,
    });

    return {
      success: true,
      message: 'A fresh verification email has been sent to your inbox.',
    };
  }

  /**
   * Verify email via token or direct admin confirm.
   */
  public static async verifyEmail(params: { token?: string; email?: string; type?: string }) {
    const { token, email, type } = params;

    if (token) {
      try {
        const { data, error } = await supabasePublic.auth.verifyOtp({
          token_hash: token,
          type: (type as any) || 'signup',
        });
        if (!error && data.user) {
          return data.user;
        }
      } catch (err) {
        console.warn('[AuthService] verifyOtp failed, trying fallback confirmation:', err);
      }
    }

    if (email) {
      return await this.confirmUser(email);
    }

    throw new Error('Invalid or expired verification token');
  }

  /**
   * Confirm user email directly via Supabase Admin.
   */
  public static async confirmUser(email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    const targetUser = usersData?.users?.find(
      (u) => u.email?.toLowerCase() === normalizedEmail
    );

    if (!targetUser) throw new Error('User not found');

    const { data: updated, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      targetUser.id,
      { email_confirm: true }
    );

    if (updateError) throw updateError;
    return updated.user;
  }
}
