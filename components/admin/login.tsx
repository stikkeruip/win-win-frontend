'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '@/app/language-provider'
import LanguageSelector from '@/components/language-selector'
import { login } from '@/lib/admin-api'

export default function AdminLogin() {
    const { t, localizedPath } = useLanguage()
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        try {
            // Use the login function from admin-api.ts
            const data = await login(username, password)

            // Store token in localStorage
            localStorage.setItem('adminToken', data.token)

            // Redirect to dashboard
            router.push(localizedPath('/admin/dashboard'))
        } catch (err: any) {
            setError(err.message || 'Failed to login. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col bg-gray-50">
            {/* Language selector */}
            <div className="absolute right-4 top-4 z-10">
                <LanguageSelector />
            </div>

            <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
                <div className="w-full max-w-md space-y-8">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                            <span className="text-[#FFA94D]">WIN</span>-<span className="text-[#74C0FC]">WIN</span> Admin
                        </h2>
                        <p className="mt-2 text-center text-sm text-gray-600">
                            {t('admin_loginDescription')}
                        </p>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="-space-y-px rounded-md shadow-sm">
                            <div>
                                <label htmlFor="username" className="sr-only">
                                    {t('admin_username')}
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="relative block w-full rounded-t-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#FFA94D] sm:text-sm sm:leading-6"
                                    placeholder={t('admin_username')}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                            <div>
                                <label htmlFor="password" className="sr-only">
                                    {t('admin_password')}
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="relative block w-full rounded-b-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-[#FFA94D] sm:text-sm sm:leading-6"
                                    placeholder={t('admin_password')}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-md bg-red-50 p-4">
                                <div className="flex">
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-red-800">{t('admin_loginError')}</h3>
                                        <div className="mt-2 text-sm text-red-700">
                                            <p>{error}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group relative flex w-full justify-center rounded-md bg-gradient-to-r from-[#FFA94D] to-[#FF8A3D] px-3 py-2 text-sm font-semibold text-white hover:from-[#FF8A3D] hover:to-[#FF7A2D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:opacity-70"
                            >
                                {isLoading ? t('admin_loggingIn') : t('admin_signIn')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
