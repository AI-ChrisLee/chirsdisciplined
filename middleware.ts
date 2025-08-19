import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  // Update session
  const response = await updateSession(request)

  // Protected routes
  const protectedPaths = [
    '/dashboard',
    '/account',
    '/settings',
    '/progress',
    '/morning-protocol',
    '/evening-review',
    '/affirmations',
    '/vision-board'
  ]

  const path = request.nextUrl.pathname
  const isProtectedPath = protectedPaths.some(protectedPath => 
    path.startsWith(protectedPath)
  )

  if (isProtectedPath) {
    // Check if user is authenticated by looking for session cookie
    const hasSession = request.cookies.has('sb-jnaklynwyuqmmsznbtet-auth-token')
    
    if (!hasSession) {
      // Redirect to sign in if trying to access protected route without session
      const redirectUrl = new URL('/signin', request.url)
      redirectUrl.searchParams.set('redirectTo', path)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}