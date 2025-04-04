'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import AdminSidebar from './sidebar'
import { useLanguage } from '@/app/language-provider'
import { AdminTranslationProvider } from './admin-translation-provider'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const router = useRouter()
    const pathname = usePathname()
    const { t, localizedPath } = useLanguage()

    useEffect(() => {
        // Check for authentication token
        const checkAuth = () => {
            const token = localStorage.getItem('adminToken')
            const isAuth = !!token

            setIsAuthenticated(isAuth)

            // If on login page and already authenticated, redirect to dashboard
            if (isAuth && pathname.includes('/admin/login')) {
                router.push(localizedPath('/admin/dashboard'))
            }

            // If not on login page and not authenticated, redirect to login
            if (!isAuth && pathname.includes('/admin') && !pathname.includes('/admin/login')) {
                router.push(localizedPath('/admin/login'))
            }
        }

        checkAuth()

        // Add event listener for storage changes (in case of logout in another tab)
        window.addEventListener('storage', checkAuth)
        return () => window.removeEventListener('storage', checkAuth)
    }, [pathname, router, localizedPath])

    // Show nothing during initial check to prevent flashing
    if (isAuthenticated === null) {
        return null
    }

    // On login page, just show the login component wrapped in translation provider
    if (pathname.includes('/admin/login')) {
        return (
            <AdminTranslationProvider>
                {children}
            </AdminTranslationProvider>
        )
    }

    // If authenticated and not on login page, show admin layout
    if (isAuthenticated) {
        return (
            <AdminTranslationProvider>
                <div className="flex h-screen bg-gray-100">
                    <AdminSidebar />
                    <div className="flex-1 overflow-auto">
                        <main className="p-6">{children}</main>
                    </div>
                </div>
            </AdminTranslationProvider>
        )
    }

    // While redirecting to login
    return null
}