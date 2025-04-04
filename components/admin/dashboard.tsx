'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FileText, Upload, Languages, Clock } from 'lucide-react'
import { makeAuthenticatedRequest } from '@/lib/admin-api'
import { useLanguage } from '@/app/language-provider'

interface StatsSummary {
    totalContent: number
    totalLanguages: number
    totalVisits: number
    recentContent: {
        id: number
        title: string
        language: string
        date: string
    }[]
}

export default function AdminDashboard() {
    const { t, localizedPath } = useLanguage()
    const [stats, setStats] = useState<StatsSummary | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Get total content count
                const contentResponse = await makeAuthenticatedRequest('/api/admin/content')
                const content = contentResponse.data || []

                // Get languages
                const languagesResponse = await makeAuthenticatedRequest('/api/languages')
                const languages = languagesResponse.data || []

                // Get visit stats
                const visitsResponse = await makeAuthenticatedRequest('/api/admin/stats/visits')

                // Build stats summary
                const summary: StatsSummary = {
                    totalContent: content.length,
                    totalLanguages: languages.length,
                    totalVisits: visitsResponse.total_visits || 0,
                    recentContent: content
                        .slice(0, 5)
                        .map((item: any) => ({
                            id: item.id,
                            title: item.title,
                            language: item.language?.name || 'Unknown',
                            date: new Date(item.created_at).toLocaleDateString(),
                        })),
                }

                setStats(summary)
            } catch (err: any) {
                console.error('Error fetching dashboard stats:', err)
                setError('Failed to load dashboard data. Please try again.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchStats()
    }, [])

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FFA94D] border-t-transparent"></div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="rounded-lg bg-red-50 p-4">
                <div className="text-red-800">{error}</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">{t('admin_dashboard')}</h1>

            {/* Stats Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg bg-white p-6 shadow">
                    <div className="flex items-center">
                        <div className="rounded-full bg-orange-100 p-3">
                            <FileText className="h-6 w-6 text-orange-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">{t('admin_totalContent')}</h3>
                            <p className="text-3xl font-bold text-gray-900">{stats?.totalContent || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow">
                    <div className="flex items-center">
                        <div className="rounded-full bg-blue-100 p-3">
                            <Languages className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">{t('admin_totalLanguages')}</h3>
                            <p className="text-3xl font-bold text-gray-900">{stats?.totalLanguages || 0}</p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow">
                    <div className="flex items-center">
                        <div className="rounded-full bg-green-100 p-3">
                            <Clock className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">{t('admin_totalVisits')}</h3>
                            <p className="text-3xl font-bold text-gray-900">{stats?.totalVisits || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-lg font-medium text-gray-900">{t('admin_quickActions')}</h2>
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                    <Link
                        href={localizedPath('/admin/content/create')}
                        className="flex items-center rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                    >
                        <FileText className="mr-3 h-5 w-5 text-gray-600" />
                        <span>{t('admin_createNewContent')}</span>
                    </Link>
                    <Link
                        href={localizedPath('/admin/upload')}
                        className="flex items-center rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                    >
                        <Upload className="mr-3 h-5 w-5 text-gray-600" />
                        <span>{t('admin_uploadFiles')}</span>
                    </Link>
                    <Link
                        href={localizedPath('/admin/content')}
                        className="flex items-center rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                    >
                        <FileText className="mr-3 h-5 w-5 text-gray-600" />
                        <span>{t('admin_manageContent')}</span>
                    </Link>
                </div>
            </div>

            {/* Recent Content */}
            <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-lg font-medium text-gray-900">{t('admin_recentContent')}</h2>
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                            >
                                {t('admin_title')}
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
                                {t('admin_date')}
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">{t('admin_edit')}</span>
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                        {stats?.recentContent.map((content) => (
                            <tr key={content.id}>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{content.title}</div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="text-sm text-gray-500">{content.language}</div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4">
                                    <div className="text-sm text-gray-500">{content.date}</div>
                                </td>
                                <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                                    <Link
                                        href={localizedPath(`/admin/content/edit/${content.id}`)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        {t('admin_edit')}
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        {(!stats?.recentContent || stats.recentContent.length === 0) && (
                            <tr>
                                <td className="px-6 py-4 text-center text-sm text-gray-500" colSpan={4}>
                                    {t('admin_noContent')}
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
                {stats?.totalContent && stats.totalContent > 5 ? (
                    <div className="mt-4 text-center">
                        <Link
                            href={localizedPath('/admin/content')}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                            {t('admin_viewAllContent')}
                        </Link>
                    </div>
                ) : null}
            </div>
        </div>
    )
}