import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/auth/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const backendUrl =
      process.env.NEXT_PUBLIC_BACKEND_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://databasegenrator.onrender.com'
        : 'http://localhost:3001');

    // 1. Try Express backend first (with Resend HTML email template)
    try {
      const res = await fetch(`${backendUrl}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
      }

      console.warn(`Backend forgot-password returned non-JSON (${res.status}), attempting direct Supabase fallback`);
    } catch (backendError) {
      console.warn('Backend forgot-password unreachable, attempting direct fallback:', backendError);
    }

    // 2. Direct Supabase Admin fallback
    try {
      const origin =
        request.headers.get('origin') ||
        process.env.NEXT_PUBLIC_APP_URL ||
        'http://localhost:3000';

      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'recovery',
        email: normalizedEmail,
        options: {
          redirectTo: `${origin}/reset-password`,
        },
      });

      if (linkError) {
        return NextResponse.json({ error: linkError.message }, { status: 400 });
      }

      const resetLink = linkData?.properties?.action_link;

      return NextResponse.json({
        success: true,
        message: 'Password reset link generated! Check your email or use the recovery link below.',
        resetLink,
      });
    } catch (fallbackError: any) {
      console.error('Password reset fallback error:', fallbackError);
      return NextResponse.json(
        { error: fallbackError?.message || 'Failed to process password reset request' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Forgot password route error:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
