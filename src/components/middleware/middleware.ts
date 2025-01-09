// import { NextRequest, NextResponse } from 'next/server';

// export function middleware(req: NextRequest) {
//   const url = req.nextUrl.clone();

//   // Define public routes
//   const publicRoutes = ['/', '/help', '/settings'];

//   // Allow access to public routes
//   if (publicRoutes.includes(url.pathname)) {
//     return NextResponse.next();
//   }

//   // Check authentication cookie
//   const isAuthenticated = req.cookies.get('auth0.is.authenticated');
//   if (!isAuthenticated) {
//     console.log('Redirecting unauthenticated user');
//     url.pathname = '/api/auth/login';
//     return NextResponse.redirect(url);
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/profile', '/dashboard'], // Protect only specific routes
// };
