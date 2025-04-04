'use client'

import React, { createContext, useContext } from 'react'
import { useLanguage } from '@/app/language-provider'

// Create a context for admin translations to be consistent
export const AdminTranslationContext = createContext<{
    t: (key: string) => string;
    currentLang: string;
    localizedPath: (path: string, lang?: string) => string;
}>({
    t: (key) => key,
    currentLang: 'en',
    localizedPath: (path) => path,
})

export function AdminTranslationProvider({ children }: { children: React.ReactNode }) {
    // Use the main language provider for translations
    const { t, currentLang, localizedPath } = useLanguage()

    // Create a specialized admin translator function that prefixes admin keys
    const adminT = (key: string) => {
        // If the key already starts with 'admin_', use it as is
        if (key.startsWith('admin_')) {
            return t(key as any)
        }

        // Special case for 'language' - use it directly without prefix
        if (key === 'language') {
            return t(key as any)
        }

        // Otherwise, prefix with 'admin_' to access admin translations
        return t(`admin_${key}` as any)
    }

    return (
        <AdminTranslationContext.Provider value={{
            t: adminT,
            currentLang,
            localizedPath
        }}>
            {children}
        </AdminTranslationContext.Provider>
    )
}

// Custom hook to use the admin translation context
export function useAdminTranslation() {
    return useContext(AdminTranslationContext)
}
