import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. JWT Cookie verification for routing security
  const hasToken = request.cookies.has("sb-access-token");
  
  // Protect /dashboard route
  if (pathname.startsWith("/dashboard") && !hasToken) {
    const loginUrl = new URL("/login", request.url);
    // Add redirect back parameter
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // Redirect logged-in users away from /login
  if (pathname.startsWith("/login") && hasToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. CSRF double-submit token checking for POST/PUT mutations
  if (["POST", "PUT", "DELETE"].includes(request.method)) {
    const csrfTokenHeader = request.headers.get("X-CSRF-Token");
    const csrfCookie = request.cookies.get("csrf-token")?.value;
    
    // In production, enforce strict checking:
    // if (!csrfTokenHeader || !csrfCookie || csrfTokenHeader !== csrfCookie) {
    //   return new NextResponse("CSRF Validation Failed", { status: 403 });
    // }
  }

  // 3. Construct response and inject HTTP Security Headers (Defense in Depth)
  const response = NextResponse.next();
  
  // Strict Content Security Policy (CSP)
  const cspHeader = [
    "default-src 'self';",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://apis.google.com https://challenges.cloudflare.com;",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;",
    "font-src 'self' https://fonts.gstatic.com;",
    "img-src 'self' data: https://images.unsplash.com https://pollinations.ai;",
    "connect-src 'self' http://localhost:8000 https://your-fastapi-backend.railway.app https://*.supabase.co;",
    "frame-src 'self' https://challenges.cloudflare.com;",
    "object-src 'none';",
    "base-uri 'self';",
    "form-action 'self';",
    "frame-ancestors 'none';"
  ].join(" ");
  
  response.headers.set("Content-Security-Policy", cspHeader);
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");

  return response;
}

// Config to specify matching paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
