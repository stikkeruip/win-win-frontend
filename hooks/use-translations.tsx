'use client'

import { usePathname } from 'next/navigation'
import { getTranslations, type TranslationKey } from '@/lib/translations'

// Define supported languages directly here to avoid circular dependencies
const supportedLanguages = ['en', 'fr', 'ar', 'pt']

export function useTranslations() {
    const pathname = usePathname()

    // Extract language code from the URL path
    const langSegment = pathname.split('/')[1]

    // Check if this is a valid language code
    const isValidLang = supportedLanguages.includes(langSegment)

    // Use the language from URL, or default to English
    const currentLang = isValidLang ? langSegment : 'en'

    // Get translations for the current language
    const translations = getTranslations(currentLang)

    // Helper function to translate a key
    const t = (key: TranslationKey) => {
        // Debug logging (remove in production)
        console.log(`Translating key: ${key} for language: ${currentLang}`)
        console.log(`Translation result:`, translations[key])

        return translations[key] || key
    }

    return {
        t,
        currentLang,
        // Remove language prefix from URL path
        pathWithoutLang: isValidLang ? pathname.substring(langSegment.length + 1) || '/' : pathname,
        // Add language prefix to a path
        localizedPath: (path: string, lang = currentLang) => {
            // Handle root path specially
            if (path === '/') {
                return lang === 'en' ? '/' : `/${lang}`
            }

            // Otherwise, add language prefix unless it's for English (the default)
            return lang === 'en' ? path : `/${lang}${path}`
        }
    }
}