import { NextResponse } from 'next/server'

const PROTECTED_ROUTES = ['/admin-dashboard', '/booster-dashboard', '/admin']

export function middleware(request) {
  const { pathname } = request.nextUrl

  const isProtected = PROTECTED_ROUTES.some(route => pathname.startsWith(route))

  if (!isProtected) {
    return NextResponse.next()
  }

  if (pathname === '/booster-login' || pathname === '/admin/login') {
    return NextResponse.next()
  }

  const adminSession = request.cookies.get('admin_session')?.value

  if (!adminSession) {
    const loginUrl = new URL('/booster-login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  try {
    const decoded = decodeURIComponent(adminSession)
    const sessionData = JSON.parse(Buffer.from(decoded, 'base64').toString())
    const now = Date.now()

    if (!sessionData.id || !sessionData.exp || sessionData.exp < now) {
      const loginUrl = new URL('/booster-login', request.url)
      const response = NextResponse.redirect(loginUrl)
      response.cookies.delete('admin_session')
      return response
    }

    if (pathname.startsWith('/admin-dashboard') && !sessionData.isAdmin) {
      return NextResponse.redirect(new URL('/booster-dashboard', request.url))
    }

  } catch (e) {
    console.log('[MIDDLEWARE] Erro ao parsear sessao:', e.message)
    const loginUrl = new URL('/booster-login', request.url)
    const response = NextResponse.redirect(loginUrl)
    response.cookies.delete('admin_session')
    return response
  }

  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate')
  return response
}

export const config = {
  matcher: [
    '/admin-dashboard/:path*',
    '/booster-dashboard/:path*',
    '/admin/:path*',
  ]
}
