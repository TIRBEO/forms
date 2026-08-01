import { NextResponse, NextRequest } from 'next/server';

const API_URL = 'https://api.tirbeo.app';

const PUBLIC_PATHS = ['/f/public/', '/_next', '/favicon'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const session = request.cookies.get('__session');
  if (session?.value) {
    return NextResponse.next();
  }

  const authHeader = request.headers.get('authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (token) {
    try {
      const res = await fetch(`${API_URL}/api/admin/authorize`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      if (res.ok) {
        const cookieDomain = process.env.NODE_ENV !== 'development' ? process.env.NEXT_PUBLIC_COOKIE_DOMAIN || '.tirbeo.app' : undefined;
        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV !== 'development',
          sameSite: 'lax' as const,
          path: '/',
          maxAge: 60 * 60 * 24 * 7,
        } as any;
        if (cookieDomain) {
          cookieOptions.domain = cookieDomain;
        }
        const response = NextResponse.next();
        response.cookies.set('__session', token, cookieOptions);
        return response;
      }
    } catch {
      // Fall through to redirect
    }
  }

  const host = request.headers.get('host') || '';
  const isLocalhost = host.startsWith('localhost') || host.startsWith('127.0.0.1');
  const accountsHost = isLocalhost ? 'localhost:3001' : 'accounts.tirbeo.app';
  const protocol = isLocalhost ? 'http' : 'https';
  const formUrl = `${protocol}://${host}${request.nextUrl.pathname}${request.nextUrl.search}`;
  const loginUrl = new URL(`${protocol}://${accountsHost}/login`);
  loginUrl.searchParams.set('redirect_to', formUrl);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};