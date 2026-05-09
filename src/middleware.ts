import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/meals", "/login", "/register", "/providers"];

const ROLE_HOME: Record<string, string> = {
  ADMIN: "/admin",
  PROVIDER: "/provider/dashboard",
  CUSTOMER: "/orders",
};

export async function middleware(req: NextRequest) {
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

  // ✅ EDGE SAFE SESSION CHECK (NO IMPORT)
  const sessionToken =
    req.cookies.get("better-auth.session_token")?.value ||
    req.cookies.get("session")?.value;

  // If no cookie → redirect login
  if (!sessionToken) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ⚠️ IMPORTANT:
  // We CANNOT get role in middleware (Edge limitation)
  // So we only allow access, role check stays in backend/pages

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
