'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
    LayoutDashboard,
    FileText,
    Upload,
    BarChart,
    Languages,
    LogOut,
    Menu,
    X
} from 'lucide-react'
import { useLanguage } from '@/app/language-provider'

export default function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const { t, localizedPath } = useLanguage()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleLogout = () => {
        // Remove admin token
        localStorage.removeItem('adminToken')

        // Redirect to login
        router.push(localizedPath('/admin/login'))
    }

    const navItems = [
        {
            name: t('admin_dashboard'),
            href: localizedPath('/admin/dashboard'),
            icon: <LayoutDashboard className="h-5 w-5" />,
        },
        {
            name: t('admin_content'),
            href: localizedPath('/admin/content'),
            icon: <FileText className="h-5 w-5" />,
        },
        {
            name: t('admin_upload'),
            href: localizedPath('/admin/upload'),
            icon: <Upload className="h-5 w-5" />,
        },
        {
            name: t('admin_stats'),
            href: localizedPath('/admin/stats'),
            icon: <BarChart className="h-5 w-5" />,
        },
        {
            name: t('admin_languages'),
            href: localizedPath('/admin/languages'),
            icon: <Languages className="h-5 w-5" />,
        },
    ]

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={toggleMobileMenu}
                className="fixed left-4 top-4 z-50 block rounded-md bg-white p-2 shadow-md lg:hidden"
            >
                {isMobileMenuOpen ? (
                    <X className="h-6 w-6 text-gray-600" />
                ) : (
                    <Menu className="h-6 w-6 text-gray-600" />
                )}
            </button>

            {/* Sidebar for desktop */}
            <div className="hidden w-64 flex-shrink-0 bg-white shadow-md lg:block">
                <div className="flex h-full flex-col">
                    <div className="flex h-16 items-center justify-center border-b">
                        <div className="text-xl font-bold">
                            <span className="text-[#FFA94D]">WIN</span>-<span className="text-[#74C0FC]">WIN</span>{' '}
                            <span className="text-gray-600">Admin</span>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-1 px-2 py-4">
                        {navItems.map((item) => {
                            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                                        isActive
                                            ? 'bg-orange-50 text-[#FFA94D]'
                                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                                >
                                    <div className="mr-3">{item.icon}</div>
                                    {item.name}
                                </Link>
                            )
                        })}
                    </nav>

                    <div className="border-t border-gray-200 p-4">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        >
                            <LogOut className="mr-3 h-5 w-5" />
                            {t('admin_logout')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile sidebar */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-40 lg:hidden">
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={toggleMobileMenu}></div>
                    <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white">
                        <div className="flex h-full flex-col">
                            <div className="flex h-16 items-center justify-center border-b">
                                <div className="text-xl font-bold">
                                    <span className="text-[#FFA94D]">WIN</span>-<span className="text-[#74C0FC]">WIN</span>{' '}
                                    <span className="text-gray-600">Admin</span>
                                </div>
                            </div>

                            <nav className="flex-1 space-y-1 px-2 py-4">
                                {navItems.map((item) => {
                                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`flex items-center rounded-md px-2 py-2 text-sm font-medium ${
                                                isActive
                                                    ? 'bg-orange-50 text-[#FFA94D]'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                            onClick={toggleMobileMenu}
                                        >
                                            <div className="mr-3">{item.icon}</div>
                                            {item.name}
                                        </Link>
                                    )
                                })}
                            </nav>

                            <div className="border-t border-gray-200 p-4">
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                >
                                    <LogOut className="mr-3 h-5 w-5" />
                                    {t('admin_logout')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}