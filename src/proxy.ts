import { NextRequest, NextResponse } from "next/server";
import { authCookieScope, isTokenLive } from "@/lib/api/cookieScope";

const PUBLIC_ROUTES = ["/", "/login", "/register", "/forgot-password", "/signature-test"];
const AUTH_ROUTES = ["/login", "/register"];
const AUTH_COOKIE = "accessToken";

const EXPIRED_PARAM = "session";

function clearAuthCookie(response: NextResponse, request: NextRequest) {
  const scope = authCookieScope(request.headers.get("host") ?? request.nextUrl.hostname);

  response.cookies.set({
    name: AUTH_COOKIE,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    ...scope,
  });

  return response;
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const { pathname, searchParams } = request.nextUrl;

  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
  const isAuthRoute = AUTH_ROUTES.includes(pathname);

  const authenticated = token != null && isTokenLive(token);

  if (!authenticated && !isPublicRoute) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    return token ? clearAuthCookie(response, request) : response;
  }

  if (isAuthRoute && searchParams.get(EXPIRED_PARAM) === "expired") {
    return clearAuthCookie(NextResponse.next(), request);
  }

  if (authenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
