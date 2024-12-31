  import { type NextRequest } from "next/server";
  import { cookies } from "next/headers";
  import { getIronSession } from "iron-session";
  import { SessionData, sessionOptions } from "@/lib/type";

  // This function handles the middleware authentication check
  export async function middleware(request: NextRequest) {
    const session = await getIronSession<SessionData>(await cookies(), sessionOptions);

    
    const publicPaths = ['/login', '/register'];
    const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

    if (!session.isLoggedIn && !isPublicPath) {
    
      return Response.redirect(new URL('/login', request.url));
    }

    if (session.isLoggedIn && isPublicPath) {
      
      return Response.redirect(new URL('/', request.url));
    }
  }


  export const config = {
    matcher: [
    
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
  };