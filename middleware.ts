// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getSupportedLanguageCodes } from './components/language-selector';

// Get the supported languages
const supportedLanguages = getSupportedLanguageCodes();

export const config = {
    // Skip static assets to avoid unnecessary middleware execution
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)'],
};

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Get language from URL path
    const pathnameLanguage = pathname.split('/')[1];
    const isLanguageInPath = supportedLanguages.includes(pathnameLanguage);

    // If language already in path, no need to redirect
    if (isLanguageInPath) {
        return NextResponse.next();
    }

    // Get language from cookie or Accept-Language header
    let language;

    // Check cookie first
    const localeCookie = request.cookies.get('NEXT_LOCALE');
    if (localeCookie && supportedLanguages.includes(localeCookie.value)) {
        language = localeCookie.value;
    } else {
        // Fall back to Accept-Language header
        const acceptLanguageHeader = request.headers.get('Accept-Language') || '';
        // Parse the Accept-Language header to get preferred languages
        const acceptedLanguages = acceptLanguageHeader
            .split(',')
            .map(item => {
                const [lang, priority = '1'] = item.trim().split(';q=');
                return {
                    lang: lang.split('-')[0], // Just get the language code (en-US -> en)
                    priority: parseFloat(priority)
                };
            })
            .sort((a, b) => b.priority - a.priority); // Sort by priority

        // Find the first supported language
        const matchedLang = acceptedLanguages.find(item =>
            supportedLanguages.includes(item.lang)
        );

        language = matchedLang ? matchedLang.lang : 'en';
    }

    // If language is English (default), no need to redirect
    if (language === 'en') {
        return NextResponse.next();
    }

    // For non-English languages, add the language prefix to the URL
    // and redirect (except for root path which has special handling)
    const url = request.nextUrl.clone();
    url.pathname = pathname === '/' ? `/${language}` : `/${language}${pathname}`;

    // Create a response that redirects to the new URL with the language prefix
    const response = NextResponse.redirect(url);

    // Store language preference in cookie for future visits
    response.cookies.set({
        name: 'NEXT_LOCALE',
        value: language,
        path: '/',
        maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return response;
}