import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { apiBaseUrl } from "@/lib/config";
import { SESSION_COOKIE } from "@/lib/constants";

const PROTECTED = ["/dashboard", "/doctors", "/patients"];

function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });
  return response;
}

async function sessionIsActive(token: string) {
  if (!apiBaseUrl) return true;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000);
  try {
    const response = await fetch(`${apiBaseUrl}/auth/me`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
      signal: controller.signal,
    });
    return response.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(SESSION_COOKIE)?.value;
  const isProtected = PROTECTED.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
  const isAuthPage = pathname === "/" || pathname === "/signup";
  const active = session ? await sessionIsActive(session) : false;

  if (isProtected && !active) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.search = "";
    url.searchParams.set("next", pathname);
    const response = NextResponse.redirect(url);
    if (session) clearSessionCookie(response);
    return response;
  }

  if (isAuthPage && active) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isAuthPage && session && !active) {
    return clearSessionCookie(NextResponse.next());
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/signup",
    "/dashboard",
    "/dashboard/:path*",
    "/doctors",
    "/doctors/:path*",
    "/patients",
    "/patients/:path*",
  ],
};
