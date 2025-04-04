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
                    const matchingTranslation = data.translations.find(
                        (t: Content) => t.language.code === currentLang
                    )

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
        const translation = course.translations.find(
            (t: Content) => t.language.code === selectedTranslation
        )

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
                window.open(activeContent.file_link, '_blank')
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
        ...course.translations
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
                            <Image
                                src={activeContent.file_link && activeContent.file_link !== 'no-file'
                                    ? activeContent.file_link
                                    : "/placeholder.svg?height=400&width=600"}
                                alt={activeContent.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        <div className="mt-6 rounded-lg bg-gray-50 p-6">
                            <h3 className="mb-4 text-lg font-medium">{t('courseDetails')}</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">{t('language')}:</span>
                                    <span className="font-medium">{activeContent.language.name}</span>
                                </div>

                                <div className="flex justify-between">
                                    <span className="text-gray-600">{t('level')}:</span>
                                    <span className="font-medium">{activeContent.type || t('beginner')}</span>
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