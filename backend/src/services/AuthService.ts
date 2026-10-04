import { supabaseAdmin, supabasePublic } from '../config/supabase';

export class AuthService {
  /**
   * Register a user with automatic email verification via Supabase Admin API.
   */
  public static async registerUser(email: string, password: string) {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      // If user exists but is unconfirmed, confirm and update
      if (
        createError.message?.toLowerCase().includes('already registered') ||
        createError.message?.toLowerCase().includes('already exists')
      ) {
        const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
        const existing = usersData?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());

        if (existing) {
          await supabaseAdmin.auth.admin.updateUserById(existing.id, {
            password,
            email_confirm: true,
          });

          return {
            user: existing,
            message: 'Account updated and verified! You can now log in.',
          };
        }
      }
      throw new Error(createError.message);
    }

    // Try creating profile row safely
    if (newUser?.user) {
      try {
        await supabaseAdmin.from('profiles').insert([{ id: newUser.user.id, email: newUser.user.email }]);
      } catch (err) {
        console.warn('Profiles table insert skipped:', err);
      }
    }

    return {
      user: newUser.user,
      message: 'Account created and verified successfully!',
    };
  }

  /**
   * Sign in using email and password.
   */
  public static async loginUser(email: string, password: string) {
    const { data, error } = await supabasePublic.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // Auto-confirm if needed
      if (error.message?.toLowerCase().includes('email not confirmed')) {
        await this.confirmUser(email);
        const retry = await supabasePublic.auth.signInWithPassword({ email, password });
        if (retry.error) throw retry.error;
        return retry.data;
      }
      throw error;
    }

    return data;
  }

  /**
   * Auto-confirm unconfirmed email.
   */
  public static async confirmUser(email: string) {
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    const targetUser = usersData?.users?.find(
      (u) => u.email?.toLowerCase() === email.toLowerCase()
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
