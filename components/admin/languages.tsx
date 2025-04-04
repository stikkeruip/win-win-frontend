'use client'

import { useState, useEffect } from 'react'
import { getLanguages } from '@/lib/admin-api'
import { Language } from '@/lib/types'
import { Languages as LanguagesIcon, Globe } from 'lucide-react'

export default function AdminLanguages() {
    const [languages, setLanguages] = useState<Language[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const data = await getLanguages()
                setLanguages(data)
            } catch (err: any) {
                console.error('Error fetching languages:', err)
                setError(err.message || 'Failed to load languages. Please try again.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchLanguages()
    }, [])

    // Get flag emoji for language code
    const getLanguageFlag = (code: string) => {
        const flagMap: Record<string, string> = {
            'en': '🇺🇸',
            'fr': '🇫🇷',
            'ar': '🇦🇪',
            'pt': '🇧🇷',
        }

        return flagMap[code] || '🌐'
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Languages</h1>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4 text-red-800">{error}</div>
            )}

            <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-lg font-medium text-gray-900">Available Languages</h2>

                {isLoading ? (
                    <div className="flex h-20 items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FFA94D] border-t-transparent"></div>
                    </div>
                ) : languages.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {languages.map(language => (
                            <div
                                key={language.id}
                                className="flex items-center rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
                            >
                                <div className="mr-4 text-3xl">{getLanguageFlag(language.code)}</div>
                                <div>
                                    <h3 className="font-medium text-gray-900">{language.name}</h3>
                                    <p className="text-sm text-gray-500">{language.code.toUpperCase()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex h-32 flex-col items-center justify-center">
                        <Globe className="h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No languages found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            Available languages will appear here.
                        </p>
                    </div>
                )}
            </div>

            <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-lg font-medium text-gray-900">Multilingual Support</h2>
                <p className="text-gray-600">
                    WIN-WIN Training Hub supports multiple languages to reach a global audience. When creating
                    content, you can add translations for any available language.
                </p>

                <div className="mt-6">
                    <h3 className="text-md font-medium text-gray-900">Language Management</h3>
                    <ul className="mt-2 list-inside list-disc space-y-2 text-gray-600">
                        <li>
                            To add a new language to the system, the database administrator needs to add it to the
                            <code className="mx-1 rounded bg-gray-100 px-1 py-0.5 text-sm">languages</code>
                            table.
                        </li>
                        <li>
                            Each language has a unique code (e.g., "en" for English) that is used throughout the
                            system.
                        </li>
                        <li>
                            When creating content, you can provide translations for all available languages or add
                            them later.
                        </li>
                        <li>
                            The system automatically serves content in the user's preferred language when
                            available.
                        </li>
                    </ul>
                </div>

                <div className="mt-6">
                    <h3 className="text-md font-medium text-gray-900">Best Practices</h3>
                    <ul className="mt-2 list-inside list-disc space-y-2 text-gray-600">
                        <li>
                            Always create the original content in your primary language first.
                        </li>
                        <li>
                            When adding translations, ensure they accurately reflect the original content.
                        </li>
                        <li>
                            For documents and files, upload language-specific versions rather than mixing
                            languages.
                        </li>
                        <li>
                            Consider cultural differences when translating content, not just the language.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}