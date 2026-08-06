import { NextResponse, NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/f/public/', '/captcha/blocked', '/captcha-preview', '/_next', '/favicon'];

// Public fill pages: /a/{publicId} (admin-created) and /f/{publicId}
// (user-created). publicId is either 12 lowercase hex chars or a full UUID
// (36 chars with dashes). UUID owner routes with extra segments
// (/f/{id}/edit, /f/{id}/responses, ...) stay protected.
const PUBLIC_FILL = /^\/(?:a|f)\/(?:[0-9a-f]{12}|[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_FILL.test(pathname) || PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // First-party apps share the .tirbeo.app cookie set by Accounts at login,
  // so a present session cookie is sufficient — no handoff token needed.
  if (request.cookies.has('__session')) {
    return NextResponse.next();
  }

  const host = request.headers.get('host') || '';
  const isLocalhost = host.startsWith('localhost') || host.startsWith('127.0.0.1');
  const accountsHost = isLocalhost ? 'localhost:3002' : 'accounts.tirbeo.app';
  const protocol = isLocalhost ? 'http' : 'https';
  const formUrl = `${protocol}://${host}${request.nextUrl.pathname}${request.nextUrl.search}`;
  const loginUrl = new URL(`${protocol}://${accountsHost}/login`);
  loginUrl.searchParams.set('redirect_to', formUrl);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
