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

    // 1. Try Express backend
    try {
      const res = await fetch(`${backendUrl}/api/auth/resend-verification`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: normalizedEmail }),
      });

      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
      }

      console.warn(`Backend resend-verification returned non-JSON (${res.status}), attempting fallback`);
    } catch (backendError) {
      console.warn('Backend resend unreachable, attempting direct fallback:', backendError);
    }

    // 2. Direct Supabase Admin fallback
    try {
      const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
        type: 'magiclink',
        email: normalizedEmail,
        options: {
          redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login?verified=true`,
        },
      });

      if (linkError) {
        return NextResponse.json({ error: linkError.message }, { status: 400 });
      }

      const verificationLink = linkData?.properties?.action_link;

      return NextResponse.json({
        success: true,
        message: 'A fresh verification link has been generated.',
        verificationLink,
      });
    } catch (fallbackError: any) {
      return NextResponse.json(
        { error: fallbackError?.message || 'Failed to resend verification email' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Resend verification route error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to resend verification email' },
      { status: 500 }
    );
  }
}
