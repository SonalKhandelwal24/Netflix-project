import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import cookie from 'cookie';

export function middleware(req: NextRequest) {
  // Parse cookies from the request
  const cookies = cookie.parse(req.headers.get('cookie') || '');
  const isLoggedIn = cookies?.authToken; // Adjust the key based on your setup

  // Redirect to login if not logged in and not on login page
  if (!isLoggedIn && !req.url.includes('/login')) {
    const response = NextResponse.redirect(new URL('/login', req.url));
    response.cookies.delete("authToken");
    return response;
  }

  // Optional: Check if the token exists in the request cookies
  const token = cookies?.authToken; // Access token from parsed cookies

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

// Optional: Apply this middleware only on specific routes
export const config = {
  matcher: ['/', '/profiles', '/forgot-password', '/reset-password', '/send-email-link'], // Add your restricted routes here
};
