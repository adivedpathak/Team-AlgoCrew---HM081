import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'secret')

export async function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const { pathname } = request.nextUrl

    // Public paths
    const publicPaths = ['/login', '/register', '/']

    if (
        publicPaths.includes(pathname) ||
        pathname.startsWith('/api/auth') ||
        pathname.startsWith('/_next') ||
        pathname.startsWith('/static') ||
        pathname.includes('.') // file extension
    ) {
        return NextResponse.next()
    }

    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET)

        // Role based access control (basic)
        const role = (payload as any).role

        if (pathname.startsWith('/pharmacist') && role !== 'PHARMACIST') {
            return NextResponse.redirect(new URL('/dashboard', request.url)) // or unauthorized
        }
        if (pathname.startsWith('/delivery') && role !== 'DELIVERY') {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
        // Customer typically can't access pharmacist/delivery but keeping it open or explicit

    } catch (error) {
        // Token invalid
        return NextResponse.redirect(new URL('/login', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
