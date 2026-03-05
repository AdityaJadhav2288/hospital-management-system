import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefixes = ["/dashboard", "/admin/dashboard", "/doctor/dashboard", "/patient/dashboard"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("hms_access_token")?.value;
  const role = request.cookies.get("hms_user_role")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard/admin")) {
    return NextResponse.redirect(new URL(pathname.replace("/dashboard/admin", "/admin/dashboard"), request.url));
  }
  if (pathname.startsWith("/dashboard/doctor")) {
    return NextResponse.redirect(new URL(pathname.replace("/dashboard/doctor", "/doctor/dashboard"), request.url));
  }
  if (pathname.startsWith("/dashboard/patient")) {
    return NextResponse.redirect(new URL(pathname.replace("/dashboard/patient", "/patient/dashboard"), request.url));
  }
  if (pathname === "/dashboard") {
    if (role === "admin") return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    if (role === "doctor") return NextResponse.redirect(new URL("/doctor/dashboard", request.url));
    if (role === "patient") return NextResponse.redirect(new URL("/patient/dashboard", request.url));
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isAdminPath = pathname.startsWith("/admin/dashboard");
  const isDoctorPath = pathname.startsWith("/doctor/dashboard");
  const isPatientPath = pathname.startsWith("/patient/dashboard");

  if (isProtected && !token) {
    if (isAdminPath) {
      return NextResponse.redirect(new URL("/login/admin", request.url));
    }
    if (isDoctorPath) {
      return NextResponse.redirect(new URL("/login/doctor", request.url));
    }
    if (isPatientPath) {
      return NextResponse.redirect(new URL("/login/patient", request.url));
    }

    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAdminPath && role && role !== "admin") {
    return NextResponse.redirect(new URL("/login/admin", request.url));
  }

  if (isDoctorPath && role && role !== "doctor") {
    return NextResponse.redirect(new URL("/login/doctor", request.url));
  }

  if (isPatientPath && role && role !== "patient") {
    return NextResponse.redirect(new URL("/login/patient", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/dashboard/:path*", "/doctor/dashboard/:path*", "/patient/dashboard/:path*"],
};
