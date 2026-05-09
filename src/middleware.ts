import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/meals", "/login", "/register", "/providers"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes
  if (
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // SAFE COOKIE CHECK (NO CRASH POSSIBLE)
  const cookies = req.cookies;

  const sessionToken =
    cookies.get("better-auth.session_token")?.value ||
    cookies.get("session")?.value ||
    cookies.get("auth_token")?.value;

  if (!sessionToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
