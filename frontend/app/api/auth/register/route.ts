import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/auth/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

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

    const normalizedEmail = email.trim().toLowerCase();
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://databasegenrator.onrender.com'
        : 'http://localhost:3001');

    // 1. Try Express Backend (with Resend HTML verification dispatch)
    try {
      const backendRes = await fetch(`${backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });

      const contentType = backendRes.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await backendRes.json();
        return NextResponse.json(data, { status: backendRes.status });
      }

      // If backend returned HTML (e.g. 502/503 from Render cold boot)
      console.warn(`Backend returned non-JSON (${backendRes.status}), attempting direct Supabase fallback`);
    } catch (backendError) {
      console.warn('Backend registration dispatch unreachable, attempting direct Supabase fallback:', backendError);
    }

    // 2. Direct Supabase Admin fallback when backend is offline or returning HTML
    try {
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'signup',
        email: normalizedEmail,
        password,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login?verified=true`,
        },
      });

      if (linkError) {
        // If user already exists in Supabase
        if (
          linkError.message?.toLowerCase().includes('already registered') ||
          linkError.message?.toLowerCase().includes('already exists')
        ) {
          const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
          const existing = usersData?.users?.find((u) => u.email?.toLowerCase() === normalizedEmail);

          if (existing && existing.email_confirmed_at) {
            return NextResponse.json(
              { error: 'An account with this email already exists. Please log in.' },
              { status: 409 }
            );
          }

          // Existing unconfirmed user: generate magic link
          const { data: magicLink } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email: normalizedEmail,
            options: {
              redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login?verified=true`,
            },
          });

          return NextResponse.json({
            success: true,
            message: 'Account exists but was unverified. Verification link generated!',
            requiresVerification: true,
            verificationLink: magicLink?.properties?.action_link,
            email: normalizedEmail,
          });
        }

        // Direct create fallback
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: normalizedEmail,
          password,
          email_confirm: true,
        });

        if (createError) {
          return NextResponse.json({ error: createError.message }, { status: 400 });
        }

        return NextResponse.json({
          success: true,
          message: 'Account created successfully! You can now log in.',
          requiresVerification: false,
          user: newUser.user,
          email: normalizedEmail,
        });
      }

      return NextResponse.json({
        success: true,
        message: 'Account created! Please check your email or use the verification link below.',
        requiresVerification: true,
        verificationLink: linkData?.properties?.action_link,
        user: linkData?.user,
        email: normalizedEmail,
      });
    } catch (fallbackError: any) {
      console.error('Supabase fallback error:', fallbackError);
      return NextResponse.json(
        { error: fallbackError?.message || 'Authentication service temporarily unavailable. Please try again shortly.' },
        { status: 502 }
      );
    }
  } catch (error: any) {
    console.error('Registration API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
