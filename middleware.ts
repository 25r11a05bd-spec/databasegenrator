import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Session check is handled client-side via useAuth hook in DashboardLayout
  // because supabase-js stores auth tokens in localStorage rather than cookies.
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/register'],
};
