import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/auth/supabaseAdmin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password, email } = body;

    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    if (email) {
      const normalizedEmail = email.trim().toLowerCase();
      const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
      if (listError) {
        return NextResponse.json({ error: listError.message }, { status: 500 });
      }

      const targetUser = usersData?.users?.find(
        (u) => u.email?.toLowerCase() === normalizedEmail
      );

      if (!targetUser) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 });
      }

      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        targetUser.id,
        { password }
      );

      if (updateError) {
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: 'Password updated successfully! You can now log in.',
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully! You can now log in.',
    });
  } catch (error: any) {
    console.error('Update password route error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to update password' },
      { status: 500 }
    );
  }
}
