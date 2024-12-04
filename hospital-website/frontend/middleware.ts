import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const adminToken = request.cookies.get('adminToken')?.value
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = request.nextUrl.pathname === '/admin/login'

  if (isAdminPage) {
    if (!adminToken && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    if (adminToken && isLoginPage) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*']
}
