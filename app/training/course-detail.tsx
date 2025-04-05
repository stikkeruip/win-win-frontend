'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useLanguage } from '@/app/language-provider'
import { getContentWithTranslations, logDownload, getContent } from '@/lib/api'
import { ContentWithTranslations, Content, TranslationKey } from '@/lib/types'

export default function CourseDetail() {
    const { id } = useParams()
    const { t, currentLang, localizedPath } = useLanguage()
    const [course, setCourse] = useState<ContentWithTranslations | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [selectedTranslation, setSelectedTranslation] = useState<string | null>(null)

    // Fetch course details
    useEffect(() => {
        const fetchCourse = async () => {
            setIsLoading(true)
            setError(null)

            try {
                // First try to get the course in the current language
                console.log(`Fetching course ${id} with language filter: ${currentLang}`)
                const contentList = await getContent(currentLang, undefined, id as string)

                if (contentList && contentList.length > 0) {
                    // If we found content in the current language, use it
                    const contentItem = contentList[0]
                    console.log('Found course in current language:', contentItem)

                    // Create a ContentWithTranslations object with just this content
                    const contentWithTranslations: ContentWithTranslations = {
                        original: contentItem,
                        translations: []
                    }

                    setCourse(contentWithTranslations)
                    setSelectedTranslation(contentItem.language.code)
                } else {
                    // If not found in current language, try to get it with translations
                    console.log('Course not found in current language, fetching with translations')
                    const data = await getContentWithTranslations(id as string)
                    setCourse(data)

                    // Try to find a translation matching the current UI language
                    const matchingTranslation = data.translations ? data.translations.find(
                        (t: Content) => t.language.code === currentLang
                    ) : null

                    if (matchingTranslation) {
                        // If we have a translation in the current language, use it as the active content
                        console.log('Found matching translation for', currentLang)
                        setSelectedTranslation(currentLang)
                    } else {
                        // Otherwise use the original content
                        setSelectedTranslation(data.original.language.code)
                    }
                }
            } catch (err) {
                console.error('Error fetching course:', err)
                setError('Failed to load course details. Please try again later.')
            } finally {
                setIsLoading(false)
            }
        }

        if (id) {
            fetchCourse()
        }
    }, [id, currentLang])

    // Get the active content based on the selected language
    const getActiveContent = () => {
        if (!course || !course.original) return null

        // If selected translation is the original language, return original
        if (selectedTranslation === course.original.language.code) {
            return course.original
        }

        // Otherwise find the matching translation
        const translation = course.translations ? course.translations.find(
            (t: Content) => t.language.code === selectedTranslation
        ) : null

        // Return the translation if found, otherwise the original
        return translation || course.original
    }

    const activeContent = getActiveContent()

    // Handle download click
    const handleDownload = async () => {
        if (!activeContent) return

        try {
            await logDownload(activeContent.id)

            // If there's a file link, open it
            if (activeContent.file_link && activeContent.file_link !== 'no-file') {
                // Check if the file_link is a relative path and prefix it with API_BASE_URL if needed
                let fileUrl = activeContent.file_link;
                if (!fileUrl.startsWith('http') && !fileUrl.startsWith('/')) {
                    // It's a relative path without leading slash, add a slash
                    fileUrl = '/' + fileUrl;
                }
                if (!fileUrl.startsWith('http')) {
                    // It's a relative path, prefix with API_BASE_URL
                    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
                    fileUrl = API_BASE_URL + fileUrl;
                }
                window.open(fileUrl, '_blank')
            }
        } catch (err) {
            console.error('Error logging download:', err)
        }
    }

    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#FFA94D] border-t-transparent"></div>
            </div>
        )
    }

    if (error || !course || !activeContent) {
        return (
            <div className="mx-auto max-w-3xl px-6 py-16">
                <div className="rounded-lg bg-red-50 p-6 text-center">
                    <h2 className="text-xl font-bold text-red-700">Error Loading Course</h2>
                    <p className="mt-2 text-red-600">{error || 'Course not found'}</p>
                    <Link
                        href={localizedPath('/training')}
                        className="mt-4 inline-block rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-200"
                    >
                        Return to Courses
                    </Link>
                </div>
            </div>
        )
    }

    // Combine original and translations for the language selector
    const allLanguageVersions = [
        course.original,
        ...(course.translations || [])
    ]

    return (
        <div className="bg-white">
            <div className="mx-auto max-w-6xl px-6 py-12">
                {/* Breadcrumb */}
                <nav className="mb-6 text-sm">
                    <Link href={localizedPath('/training')} className="text-gray-500 hover:text-gray-700">
                        {t('training')}
                    </Link>
                    <span className="mx-2 text-gray-400">/</span>
                    <span className="text-gray-900">{activeContent.title}</span>
                </nav>

                {/* Language selector - only show if we have multiple language versions */}
                {allLanguageVersions.length > 1 && (
                    <div className="mb-8">
                        <div className="text-sm font-medium text-gray-500">{t('availableLanguages')}:</div>
                        <div className="mt-2 flex flex-wrap gap-2">
                            {allLanguageVersions.map(version => (
                                <button
                                    key={version.language.code}
                                    className={`rounded-full px-3 py-1 text-sm ${
                                        selectedTranslation === version.language.code
                                            ? 'bg-[#FFA94D] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                    onClick={() => setSelectedTranslation(version.language.code)}
                                >
                                    {version.language.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Course content */}
                <div className="grid gap-12 md:grid-cols-2">
                    <div>
                        <h1 className="mb-4 text-3xl font-bold">{activeContent.title}</h1>

                        <div className="mb-6 flex flex-wrap gap-3">
                            {activeContent.type && (
                                <span className="rounded-full bg-orange-100 px-3 py-1 text-sm font-medium text-orange-800">
                                    {activeContent.type}
                                </span>
                            )}
                            <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                                {activeContent.language.name}
                            </span>
                        </div>

                        <div className="mb-8 text-gray-700">
                            <p className="whitespace-pre-line">{activeContent.description}</p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleDownload}
                                className="rounded-lg bg-gradient-to-r from-[#FFA94D] to-[#FF8A3D] px-6 py-3 text-white shadow-md hover:shadow-lg"
                            >
                                {activeContent.file_link && activeContent.file_link !== 'no-file'
                                    ? t('downloadMaterials')
                                    : t('startCourse')}
                            </button>

                            <Link
                                href={localizedPath('/training')}
                                className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                                {t('browseOtherCourses')}
                            </Link>
                        </div>
                    </div>

                    <div>
                        <div className="relative aspect-video overflow-hidden rounded-lg">
                            {activeContent.file_link && activeContent.file_link !== 'no-file' ? (
                                (() => {
                                    // Helper function to ensure file URLs are correctly formed
                                    const getFullUrl = (url: string) => {
                                        if (!url) return undefined;
                                        if (url === 'no-file') return undefined;

                                        // Check if the URL is already absolute
                                        if (url.startsWith('http')) return url;

                                        // Add leading slash if needed
                                        if (!url.startsWith('/')) url = '/' + url;

                                        // Prefix with API base URL
                                        const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
                                        return API_BASE_URL + url;
                                    };

                                    const fileUrl = getFullUrl(activeContent.file_link);

                                    // Check if the file is an image by extension
                                    if (fileUrl && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileUrl)) {
                                        // If it's an image, display it using the Image component
                                        return (
                                            <Image
                                                src={fileUrl}
                                                alt={activeContent.title}
                                                fill
                                                className="object-cover"
                                                priority
                                            />
                                        );
                                    } else {
                                        // If it's not an image, display a document icon with download button
                                        return (
                                            <div className="flex flex-col items-center justify-center h-full bg-gray-100 p-4">
                                                <div className="w-20 h-20 mb-4 text-gray-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                    </svg>
                                                </div>
                                                <p className="text-center text-gray-600 mb-2">{t('fileAvailable')}</p>
                                                <button 
                                                    onClick={handleDownload}
                                                    className="mt-2 px-4 py-2 bg-[#FFA94D] text-white rounded-md hover:bg-[#FF8A3D]"
                                                >
                                                    {t('downloadMaterials')}
                                                </button>
                                            </div>
                                        );
                                    }
                                })()
                            ) : (
                                // If no file, show placeholder
                                <Image
                                    src="/placeholder.svg?height=400&width=600"
                                    alt={activeContent.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            )}
                        </div>

                        <div className="mt-6 rounded-lg bg-gray-50 p-6">
                            <h3 className="mb-4 text-lg font-medium">{t('courseDetails')}</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">{t('language')}:</span>
                                    <span className="font-medium">{activeContent.language.name}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">{t('lastUpdated')}:</span>
                                    <span className="font-medium">
                                        {new Date(activeContent.updated_at).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
