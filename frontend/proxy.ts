import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedPrefixes = ["/dashboard", "/admin/dashboard", "/doctor/dashboard", "/patient/dashboard", "/patient/appointments"];

export function proxy(request: NextRequest) {
  const token = request.cookies.get("hms_access_token")?.value;
  const role = request.cookies.get("hms_user_role")?.value;
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin/dashboard")) {
    return NextResponse.redirect(new URL(pathname.replace("/admin/dashboard", "/dashboard/admin"), request.url));
  }
  if (pathname.startsWith("/doctor/dashboard")) {
    return NextResponse.redirect(new URL(pathname.replace("/doctor/dashboard", "/dashboard/doctor"), request.url));
  }
  if (pathname.startsWith("/patient/dashboard")) {
    return NextResponse.redirect(new URL(pathname.replace("/patient/dashboard", "/dashboard/patient"), request.url));
  }

  if (pathname === "/dashboard") {
    if (role === "admin") return NextResponse.redirect(new URL("/dashboard/admin", request.url));
    if (role === "doctor") return NextResponse.redirect(new URL("/dashboard/doctor", request.url));
    if (role === "patient") return NextResponse.redirect(new URL("/dashboard/patient", request.url));
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isAdminPath = pathname.startsWith("/dashboard/admin");
  const isDoctorPath = pathname.startsWith("/dashboard/doctor");
  const isPatientPath = pathname.startsWith("/dashboard/patient");
  const isPatientBookingPath = pathname.startsWith("/patient/appointments");
  const redirectTarget = `${pathname}${request.nextUrl.search || ""}`;

  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", redirectTarget);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminPath && role && role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isDoctorPath && role && role !== "doctor") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isPatientPath && role && role !== "patient") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isPatientBookingPath && role && role !== "patient") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/dashboard/:path*",
    "/doctor/dashboard/:path*",
    "/patient/dashboard/:path*",
    "/patient/appointments/:path*",
  ],
};
