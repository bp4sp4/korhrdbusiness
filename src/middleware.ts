import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(_request: NextRequest) {
  // 점검 모드 활성화 여부 (환경변수로 제어)
  // const isMaintenanceMode = process.env.MAINTENANCE_MODE === "true";

  // 점검 모드가 활성화되어 있고, 관리자 페이지가 아닌 경우
  // if (isMaintenanceMode && !request.nextUrl.pathname.startsWith("/admin")) {
  //   // 완전한 차단 - 503 Service Unavailable 응답
  //   return new NextResponse("Service Unavailable", {
  //     status: 503,
  //     headers: {
  //       "X-Frame-Options": "DENY",
  //       "X-Content-Type-Options": "nosniff",
  //       "Cache-Control": "no-cache, no-store, must-revalidate",
  //       Pragma: "no-cache",
  //       Expires: "0",
  //       "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet",
  //       "Retry-After": "3600", // 1시간 후 재시도
  //     },
  //   });
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - maintenance (점검 페이지 자체)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|maintenance).*)",
  ],
};
