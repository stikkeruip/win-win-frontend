'use client'

import { useState, useEffect } from 'react'
import {
    BarChart as BarChartIcon,
    TrendingUp,
    Eye,
    Download,
    RefreshCw
} from 'lucide-react'
import { makeAuthenticatedRequest, getVisitStats } from '@/lib/admin-api'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts'
import { useAdminTranslation } from './admin-translation-provider'

interface ContentVisit {
    id: number
    title: string
    count: number
}

interface VisitStats {
    total_visits: number
    content_visits: ContentVisit[]
}

export default function AdminStats() {
    const { t } = useAdminTranslation()
    const [visitStats, setVisitStats] = useState<VisitStats | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchStats = async () => {
        setIsLoading(true)
        setError(null)

        try {
            const data = await getVisitStats()
            setVisitStats(data)
        } catch (err: any) {
            console.error('Error fetching visit stats:', err)
            setError(err.message || t('failedLoadStats'))
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchStats()
    }, [])

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">{t('statistics')}</h1>
                <button
                    onClick={fetchStats}
                    disabled={isLoading}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
                >
                    <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {t('refresh')}
                </button>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4 text-red-800">{error}</div>
            )}

            {/* Stats Summary */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <div className="rounded-lg bg-white p-6 shadow">
                    <div className="flex items-center">
                        <div className="rounded-full bg-blue-100 p-3">
                            <Eye className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">{t('totalVisits')}</h3>
                            {isLoading ? (
                                <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
                            ) : (
                                <p className="text-3xl font-bold text-gray-900">
                                    {visitStats?.total_visits.toLocaleString() || 0}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow">
                    <div className="flex items-center">
                        <div className="rounded-full bg-green-100 p-3">
                            <BarChartIcon className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">{t('contentCount')}</h3>
                            {isLoading ? (
                                <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
                            ) : (
                                <p className="text-3xl font-bold text-gray-900">
                                    {visitStats?.content_visits.length.toLocaleString() || 0}
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                <div className="rounded-lg bg-white p-6 shadow">
                    <div className="flex items-center">
                        <div className="rounded-full bg-purple-100 p-3">
                            <TrendingUp className="h-6 w-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">{t('avgVisitsPerContent')}</h3>
                            {isLoading ? (
                                <div className="h-8 w-16 animate-pulse rounded bg-gray-200"></div>
                            ) : (
                                <p className="text-3xl font-bold text-gray-900">
                                    {visitStats?.content_visits.length
                                        ? Math.round(visitStats.total_visits / visitStats.content_visits.length)
                                        : 0}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Visits Chart */}
            <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-lg font-medium text-gray-900">{t('contentVisitDistribution')}</h2>
                {isLoading ? (
                    <div className="flex h-80 items-center justify-center">
                        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
                    </div>
                ) : visitStats?.content_visits && visitStats.content_visits.length > 0 ? (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={visitStats.content_visits}
                            margin={{
                                top: 20,
                                right: 30,
                                left: 20,
                                bottom: 60,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="title"
                                angle={-45}
                                textAnchor="end"
                                height={70}
                                interval={0}
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" name={t('visits')} fill="#4f46e5" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex h-80 items-center justify-center">
                        <p className="text-gray-500">{t('noVisitData')}</p>
                    </div>
                )}
            </div>
        </div>
    );
}