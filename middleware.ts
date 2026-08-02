import { NextResponse, NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/f/public/', '/_next', '/favicon'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // First-party apps share the .tirbeo.app cookie set by Accounts at login,
  // so a present session cookie is sufficient — no handoff token needed.
  if (request.cookies.has('__session')) {
    return NextResponse.next();
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
