import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only protect /admin routes (pages and API)
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const adminKey = process.env.ADMIN_ACCESS_KEY

    // Check for key in query parameter
    const queryKey = request.nextUrl.searchParams.get('key')
    
    // Check for key in header
    const headerKey = request.headers.get('x-admin-key')

    // Validate key from either source
    const providedKey = queryKey || headerKey

    // Block access if:
    // 1. No admin key is configured in environment, OR
    // 2. No key is provided in request, OR
    // 3. Provided key doesn't match
    if (!adminKey || !providedKey || providedKey !== adminKey) {
      return new NextResponse('Access Forbidden', { status: 403 })
    }

    // Key is valid, allow request
    return NextResponse.next()
  }

  // For all other routes, allow access
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
}

