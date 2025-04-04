'use client'

import { useEffect } from 'react'
import { useParams, redirect } from 'next/navigation'
import { getSupportedLanguageCodes } from '@/components/language-selector'
import Home from '../page' // Import the main homepage component

export default function LanguagePage() {
    const params = useParams()
    const lang = params.lang as string
    const supportedLanguages = getSupportedLanguageCodes()

    // Validate language
    useEffect(() => {
        if (!supportedLanguages.includes(lang)) {
            // Redirect to home if language is not supported
            window.location.href = '/'
        }
    }, [lang, supportedLanguages])

    // Render the same component as the main homepage
    return <Home />
}