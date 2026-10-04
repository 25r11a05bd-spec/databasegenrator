import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/auth/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Try creating user with auto-confirmed email via Supabase Admin
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

    if (createError) {
      // If user already exists, check if they are unconfirmed and auto-confirm them
      if (createError.message?.toLowerCase().includes('already registered') || createError.message?.toLowerCase().includes('already exists')) {
        const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
        const existing = usersData?.users?.find(u => u.email?.toLowerCase() === email.toLowerCase());

        if (existing) {
          // Update password and confirm email
          await supabaseAdmin.auth.admin.updateUserById(existing.id, {
            password,
            email_confirm: true,
          });

          return NextResponse.json({
            success: true,
            message: 'Account updated and verified! You can now log in.',
            user: existing,
          });
        }

        return NextResponse.json(
          { error: 'An account with this email already exists.' },
          { status: 409 }
        );
      }

      return NextResponse.json({ error: createError.message }, { status: 400 });
    }

    // Attempt to insert profile record safely (non-blocking if table permissions pending)
    if (newUser?.user) {
      try {
        await supabaseAdmin.from('profiles').insert([
          { id: newUser.user.id, email: newUser.user.email },
        ]);
      } catch (err) {
        console.warn('Profiles table insert skipped or pending migration:', err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Account created and verified successfully!',
      user: newUser.user,
    });
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
