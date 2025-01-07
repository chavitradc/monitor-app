import { getIronSession } from "iron-session";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SessionData, sessionOptions } from "@/lib/type";

export async function middleware(request: NextRequest) {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

  const publicPaths = ['/login', '/register'];
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  if (!session.isLoggedIn && !isPublicPath) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  }

  if (session.isLoggedIn && isPublicPath) {
    const response = NextResponse.redirect(new URL('/', request.url));
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    return response;
  }

  // Allow the request to continue with cache control headers
  const response = NextResponse.next();
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
