'use client'

import { usePathname } from 'next/navigation'
import { getTranslations, type TranslationKey } from '@/lib/translations'
import { languages } from '@/components/language-selector'

export function useTranslations() {
    const pathname = usePathname()

    // Extract language code from the URL path
    const langSegment = pathname.split('/')[1]

    // Check if this is a valid language code
    const isValidLang = languages.some(lang => lang.code === langSegment)

    // Use the language from URL, or default to English
    const currentLang = isValidLang ? langSegment : 'en'

    // Get translations for the current language
    const translations = getTranslations(currentLang)

    // Helper function to translate a key
    const t = (key: TranslationKey) => translations[key] || key

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