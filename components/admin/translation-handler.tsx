'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/app/language-provider'
import { usePathname } from 'next/navigation'

/**
 * AdminTranslationHandler is a utility component that ensures
 * admin page translations work correctly by forcing a re-render
 * when the language changes in the URL.
 */
export default function AdminTranslationHandler() {
    const { currentLang } = useLanguage()
    const pathname = usePathname()

    // Log current language and pathname for debugging
    useEffect(() => {
        console.log('AdminTranslationHandler - Current language:', currentLang)
        console.log('AdminTranslationHandler - Current pathname:', pathname)

        // Check if we're in an admin page
        const isAdminPage = pathname.includes('/admin/')
        if (isAdminPage) {
            console.log('AdminTranslationHandler - Admin page detected')
        }
    }, [currentLang, pathname])

    // This component doesn't render anything visible
    // It just ensures translations are applied correctly
    return null
}