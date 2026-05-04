import { getSafeSession } from "@/lib/auth-session";
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/meals", "/login", "/register", "/providers"];

const ROLE_HOME: Record<string, string> = {
  ADMIN: "/admin",
  PROVIDER: "/provider/dashboard",
  CUSTOMER: "/orders",
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log("🔵 PATH:", pathname);

  // Let public paths and API/static through
  if (
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/")) ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Fetch session from better-auth

  const session = await getSafeSession(req);
  console.log("🟡 SESSION:", session);

  if (!session) {
    console.log("🔴 NO SESSION → redirecting to login");
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  const user = session?.user;
  console.log("🟢 USER:", user);

  // Not logged in → redirect to login
  if (!user) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role: string = user.role ?? "CUSTOMER";

  // Provider must complete profile before accessing dashboard
  if (
    role === "PROVIDER" &&
    !pathname.startsWith("/provider/setup-profile") &&
    pathname.startsWith("/provider")
  ) {
    // We can't check DB here; the page itself handles the redirect
    return NextResponse.next();
  }

  // Block wrong-role access
  if (pathname.startsWith("/admin") && role !== "ADMIN") {
    return NextResponse.redirect(new URL(ROLE_HOME[role] ?? "/", req.url));
  }
  if (
    pathname.startsWith("/provider") &&
    role !== "PROVIDER" &&
    role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL(ROLE_HOME[role] ?? "/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
