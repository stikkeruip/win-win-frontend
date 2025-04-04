'use client'
// app/language-provider.tsx

import React, { createContext, useContext, useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { getTranslations, type TranslationKey } from '@/lib/translations'

// Import language codes from language-selector to avoid circular dependencies
import { getSupportedLanguageCodes } from '@/components/language-selector'

// Define the shape of our language context
type LanguageContextType = {
    currentLang: string
    t: (key: TranslationKey) => string
    pathWithoutLang: string
    localizedPath: (path: string, lang?: string) => string
}

// Create context with default values
const LanguageContext = createContext<LanguageContextType>({
    currentLang: 'en',
    t: (key) => key,
    pathWithoutLang: '/',
    localizedPath: (path) => path,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const supportedLanguages = getSupportedLanguageCodes()

    // Extract language code from URL
    const langSegment = pathname.split('/')[1]
    const isValidLang = supportedLanguages.includes(langSegment)
    const [currentLang, setCurrentLang] = useState<string>(isValidLang ? langSegment : 'en')

    // Get translations for current language
    const translationsObj = getTranslations(currentLang)

    // Update language when URL changes
    useEffect(() => {
        const langSegment = pathname.split('/')[1]
        if (supportedLanguages.includes(langSegment)) {
            setCurrentLang(langSegment)

            // Change document direction based on language
            document.documentElement.dir = langSegment === 'ar' ? 'rtl' : 'ltr'

            // Set language attribute on HTML element
            document.documentElement.lang = langSegment
        }
    }, [pathname, supportedLanguages])

    // Get path without language prefix
    const pathWithoutLang = isValidLang ? pathname.substring(langSegment.length + 1) || '/' : pathname

    // Helper function to translate a key
    const t = (key: TranslationKey): string => {
        const translation = translationsObj[key]
        return translation || key
    }

    // Helper function to add language prefix to a path
    const localizedPath = (path: string, lang = currentLang) => {
        // Handle root path specially
        if (path === '/') {
            return lang === 'en' ? '/' : `/${lang}`
        }

        // Otherwise, add language prefix unless it's for English (the default)
        return lang === 'en' ? path : `/${lang}${path.startsWith('/') ? path : `/${path}`}`
    }

    const contextValue = {
        currentLang,
        t,
        pathWithoutLang,
        localizedPath
    }

    return (
        <LanguageContext.Provider value={contextValue}>
            {children}
        </LanguageContext.Provider>
    )
}

// Custom hook to use the language context
export function useLanguage() {
    return useContext(LanguageContext)
}