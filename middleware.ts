import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Vérifier l'authentification pour les routes protégées
  const protectedRoutes = ["/dashboard", "/pv", "/opj", "/juges", "/parametres"]
  const isProtectedRoute = protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute) {
    // En production, vous devriez vérifier un token JWT ou une session
    // Ici, nous simulons avec localStorage côté client
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}
