import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // Public route (allow without redirection)
  if (url.pathname === '/') {
    return NextResponse.next();
  }

  // Simulate authentication check (replace this with your actual logic)
  const isAuthenticated = req.cookies.get('auth0.is.authenticated');
  if (!isAuthenticated) {
    console.log('Redirecting unauthenticated user');
    url.pathname = '/api/auth/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/protected-route', '/profile', '/dashboard'], // Protect only specific routes
};
