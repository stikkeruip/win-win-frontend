import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define supported languages
const supportedLanguages = ['en', 'fr', 'ar', 'pt']

// Regular expressions to match exclusions
const publicFileRegex = /\.(jpg|jpeg|png|gif|svg|ico|webp|js|css|woff|woff2)$/
const apiRouteRegex = /^\/api\/.*$/
const nextJsRoutesRegex = /^\/_next\/.*$/

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname

    // Skip static files, API routes, and Next.js internal routes
    if (
        publicFileRegex.test(pathname) ||
        apiRouteRegex.test(pathname) ||
        nextJsRoutesRegex.test(pathname)
    ) {
        return NextResponse.next()
    }

    // Add the pathname to response headers for server components to access
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-pathname', pathname)

    // Check if pathname already has a valid language prefix
    const firstSegment = pathname.split('/')[1]
    const hasLanguagePrefix = supportedLanguages.includes(firstSegment)

    if (hasLanguagePrefix) {
        // Return with the pathname header added
        return NextResponse.next({
            request: {
                headers: requestHeaders
            }
        })
    }

    // Determine the preferred language from the Accept-Language header
    // Default to 'en' if no preference or not supported
    let preferredLanguage = 'en'

    const acceptLanguage = request.headers.get('Accept-Language')
    if (acceptLanguage) {
        // Parse the Accept-Language header
        const preferredLanguages = acceptLanguage
            .split(',')
            .map(lang => {
                const [language, priority] = lang.trim().split(';q=')
                return {
                    language: language.split('-')[0], // Get just the language code
                    priority: priority ? parseFloat(priority) : 1.0
                }
            })
            .sort((a, b) => b.priority - a.priority)

        // Find the first supported language
        const matchedLanguage = preferredLanguages.find(lang =>
            supportedLanguages.includes(lang.language)
        )

        if (matchedLanguage) {
            preferredLanguage = matchedLanguage.language
        }
    }

    // If the preferred language is English, no redirect needed for root
    if (preferredLanguage === 'en' && pathname === '/') {
        return NextResponse.next({
            request: {
                headers: requestHeaders
            }
        })
    }

    // If the preferred language is English but not on root, don't redirect
    if (preferredLanguage === 'en' && pathname !== '/') {
        return NextResponse.next({
            request: {
                headers: requestHeaders
            }
        })
    }

    // For all other supported languages, redirect to the localized URL
    const url = new URL(`/${preferredLanguage}${pathname}`, request.url)

    return NextResponse.redirect(url)
}

export const config = {
    matcher: [
        // Match all paths except static files, API routes, and Next.js internal routes
        '/((?!api|_next|.*\\..*).*)',
    ],
}