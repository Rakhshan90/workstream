import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'


export async function middleware(request: NextRequest) {

    const authToken = request.cookies.get('next-auth.session-token')?.value;
    if (!authToken) {
        return NextResponse.redirect(new URL('/signin', request.url))
    }
}

// See "Matching Paths" below to learn more
export const config = {
    matcher: ['/board-list', '/create-project-board', '/board/:path*'],
}