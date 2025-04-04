'use client'

import { useParams } from 'next/navigation'
import { useEffect } from 'react'
import { getSupportedLanguageCodes } from '@/components/language-selector'

export default function LanguageLayout({
                                           children,
                                       }: {
    children: React.ReactNode
}) {
    const params = useParams()
    const lang = params.lang as string
    const supportedLanguages = getSupportedLanguageCodes()

    // Set HTML direction based on language
    useEffect(() => {
        if (lang === 'ar') {
            document.documentElement.dir = 'rtl'
        } else {
            document.documentElement.dir = 'ltr'
        }

        // Set language attribute
        if (supportedLanguages.includes(lang)) {
            document.documentElement.lang = lang
        }
    }, [lang, supportedLanguages])

    return <>{children}</>
}