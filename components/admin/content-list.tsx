'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react'
import { getAdminContent, deleteContent, getLanguages } from '@/lib/admin-api'
import { Content, Language } from '@/lib/types'
import { useAdminTranslation } from './admin-translation-provider'

export default function AdminContentList() {
    const { t, localizedPath } = useAdminTranslation()
    const [content, setContent] = useState<Content[]>([])
    const [languages, setLanguages] = useState<Language[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)
    const [selectedType, setSelectedType] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [isDeleting, setIsDeleting] = useState<number | null>(null)

    // Fetch content and languages on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch languages
                const languagesData = await getLanguages()
                setLanguages(languagesData)

                // Fetch content
                await fetchContent()
            } catch (err: any) {
                console.error('Error fetching content:', err)
                setError(err.message || 'Failed to load content. Please try again.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchData()
    }, [])

    // Fetch content with optional filters
    const fetchContent = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const data = await getAdminContent(
                selectedLanguage || undefined,
                selectedType || undefined
            )
            setContent(data)
        } catch (err: any) {
            console.error('Error fetching content:', err)
            setError(err.message || 'Failed to load content. Please try again.')
        } finally {
            setIsLoading(false)
        }
    }

    // Apply filters when they change
    useEffect(() => {
        fetchContent()
    }, [selectedLanguage, selectedType])

    // Handle content deletion
    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this content? This action cannot be undone.')) {
            return
        }

        setIsDeleting(id)

        try {
            await deleteContent(id)

            // Remove deleted content from state
            setContent(content.filter(item => item.id !== id))
        } catch (err: any) {
            console.error('Error deleting content:', err)
            alert(`Failed to delete content: ${err.message}`)
        } finally {
            setIsDeleting(null)
        }
    }

    // Filter content based on search term
    const filteredContent = content.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Get unique content types from the content list
    const contentTypes = Array.from(new Set(content.map(item => item.type || 'Unknown')))

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">{t('contentManagement')}</h1>
                <Link
                    href={localizedPath('/admin/content/create')}
                    className="inline-flex items-center rounded-md bg-gradient-to-r from-[#FFA94D] to-[#FF8A3D] px-4 py-2 text-sm font-medium text-white shadow hover:from-[#FF8A3D] hover:to-[#FF7A2D]"
                >
                    <Plus className="mr-2 h-5 w-5" />
                    {t('createNewContent')}
                </Link>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col space-y-4 rounded-lg bg-white p-4 shadow sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
                <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full rounded-md border-gray-300 pl-10 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                        placeholder={`${t('search')} ${t('content').toLowerCase()}...`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-2">
                    <div className="relative inline-block text-left">
                        <select
                            className="block w-full rounded-md border-gray-300 pr-10 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                            value={selectedLanguage || ''}
                            onChange={(e) => setSelectedLanguage(e.target.value || null)}
                        >
                            <option value="">{t('allLanguages')}</option>
                            {languages.map((language) => (
                                <option key={language.id} value={language.code}>
                                    {language.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="relative inline-block text-left">
                        <select
                            className="block w-full rounded-md border-gray-300 pr-10 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                            value={selectedType || ''}
                            onChange={(e) => setSelectedType(e.target.value || null)}
                        >
                            <option value="">{t('allTypes')}</option>
                            {contentTypes.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Error Message */}
            {error && (
                <div className="rounded-md bg-red-50 p-4 text-red-800">{error}</div>
            )}

            {/* Content Table */}
            <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FFA94D] border-t-transparent"></div>
                    </div>
                ) : filteredContent.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                >
                                    {t('title')}
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                >
                                    {t('language')}
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                >
                                    {t('contentType')}
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                                >
                                    {t('status')}
                                </th>
                                <th
                                    scope="col"
                                    className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
                                >
                                    {t('actions')}
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                            {filteredContent.map((item) => (
                                <tr key={item.id}>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                        {item.title}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {item.language?.name || 'Unknown'}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {item.type || 'Unknown'}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                                        {item.is_original ? (
                                            <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                                                {t('original')}
                                            </span>
                                        ) : (
                                            <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                                {t('translation')}
                                            </span>
                                        )}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                        <div className="flex justify-end space-x-2">
                                            <Link
                                                href={localizedPath(`/admin/content/edit/${item.id}`)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <Edit className="h-5 w-5" />
                                                <span className="sr-only">{t('edit')}</span>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                disabled={isDeleting === item.id}
                                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                                            >
                                                {isDeleting === item.id ? (
                                                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-red-600 border-t-transparent"></div>
                                                ) : (
                                                    <Trash2 className="h-5 w-5" />
                                                )}
                                                <span className="sr-only">{t('delete')}</span>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex h-64 flex-col items-center justify-center text-center">
                        <div className="mb-4 rounded-full bg-gray-100 p-3">
                            <Filter className="h-6 w-6 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">{t('noContent')}</h3>
                        <p className="mt-1 text-sm text-gray-500">
                            {searchTerm || selectedLanguage || selectedType
                                ? t('tryChangingSearch')
                                : t('getStarted')}
                        </p>
                        {!searchTerm && !selectedLanguage && !selectedType && (
                            <Link
                                href={localizedPath('/admin/content/create')}
                                className="mt-4 inline-flex items-center rounded-md bg-gradient-to-r from-[#FFA94D] to-[#FF8A3D] px-4 py-2 text-sm font-medium text-white shadow hover:from-[#FF8A3D] hover:to-[#FF7A2D]"
                            >
                                <Plus className="mr-2 h-5 w-5" />
                                {t('createNewContent')}
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}