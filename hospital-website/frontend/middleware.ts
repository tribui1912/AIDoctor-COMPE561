import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname

  // Get the token from cookies
  const token = request.cookies.get('token')?.value

  // Public paths that don't require authentication
  const publicPaths = ['/', '/login', '/signup', '/about', '/contact', '/news']
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(pp => path.startsWith(pp))

  // Protected routes logic
  if (!isPublicPath && !token) {
    // Redirect to login if trying to access protected route without token
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Admin routes protection
  if (path.startsWith('/admin') && !isAdminUser(token)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

// Configure which routes use this middleware
export const config = {
  matcher: [
    // Protected routes that need authentication
    '/patients-visitors/:path*',
    '/appointments/:path*',
    '/admin/:path*',
    '/dashboard/:path*',
    
    // API routes that need protection
    '/api/appointments/:path*',
    '/api/admin/:path*',
    
    // Exclude auth-related paths and public pages
    '/((?!_next/static|_next/image|favicon.ico|public|login|signup|about|contact|news).*)'
  ]
}

function isAdminUser(token: string | undefined): boolean {
  if (!token) return false
  try {
    // Decode JWT token and check role
    const decoded = JSON.parse(atob(token.split('.')[1]))
    return decoded.role === 'admin'
  } catch {
    return false
  }
}