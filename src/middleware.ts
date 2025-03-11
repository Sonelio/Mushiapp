import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = url;

  // Specifically handle the problematic routes
  if (pathname === '/auth/login/page') {
    url.pathname = '/auth/login';
    return NextResponse.redirect(url);
  }

  if (pathname === '/main/membership/page') {
    url.pathname = '/main/membership';
    return NextResponse.redirect(url);
  }

  // General case for any route ending with '/page'
  if (pathname.endsWith('/page')) {
    const correctedPath = pathname.replace(/\/page$/, '');
    url.pathname = correctedPath;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/auth/login/page',
    '/main/membership/page',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}; 