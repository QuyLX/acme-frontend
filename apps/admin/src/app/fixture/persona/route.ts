// Fixture mode only: sets the synthetic persona cookie for a browser demo. 404 in any other mode.
import { NextResponse, type NextRequest } from 'next/server';
import { FIXTURE_PERSONA_COOKIE, sessionMode } from '../../../server/access';

export function GET(request: NextRequest) {
  if (sessionMode() !== 'fixture') return new NextResponse(null, { status: 404 });
  const as = request.nextUrl.searchParams.get('as');
  const res = NextResponse.redirect(new URL('/tenants', request.url));
  if (as === 'staff' || as === 'no-access') res.cookies.set(FIXTURE_PERSONA_COOKIE, as, { httpOnly: true, sameSite: 'strict', path: '/' });
  else res.cookies.delete(FIXTURE_PERSONA_COOKIE);
  return res;
}
