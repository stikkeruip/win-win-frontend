'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Language } from '@/lib/types'
import {
    getLanguages,
    createContent,
    getContentWithTranslations,
    updateContent,
    uploadFile
} from '@/lib/admin-api'
import {
    X,
    Save,
    ArrowLeft,
    Globe,
    UploadCloud,
    Plus
} from 'lucide-react'
import { useAdminTranslation } from './admin-translation-provider'
import AdminTranslationHandler from './admin-translation-handler'

interface ContentFormProps {
    contentId?: number
}

interface TranslationForm {
    id?: number
    title: string
    description: string
    file?: File
    file_link?: string
    language_id: number
}

interface ContentForm {
    title: string
    description: string
    file?: File
    file_link?: string
    language_id: number
    type: string
    translations: TranslationForm[]
}

export default function AdminContentForm({ contentId }: ContentFormProps) {
    const router = useRouter()
    const { t } = useAdminTranslation()
    const [languages, setLanguages] = useState<Language[]>([])
    const [formData, setFormData] = useState<ContentForm>({
        title: '',
        description: '',
        language_id: 0,
        type: 'module',
        translations: []
    })
    const [isLoading, setIsLoading] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [isUploading, setIsUploading] = useState<{ [key: string]: boolean }>({})
    const isEditMode = !!contentId
    const [isTranslationDropdownOpen, setIsTranslationDropdownOpen] = useState(false)

    // Track the currently active language tab
    const [activeLanguageId, setActiveLanguageId] = useState<number | null>(null)

    // Load languages
    useEffect(() => {
        const fetchLanguages = async () => {
            try {
                const data = await getLanguages()
                setLanguages(data)

                // Set default language if creating new content
                if (!isEditMode && data.length > 0) {
                    // Default to English if available
                    const englishLang = data.find(lang => lang.code === 'en')
                    if (englishLang) {
                        setFormData(prev => ({
                            ...prev,
                            language_id: englishLang.id
                        }))
                        setActiveLanguageId(englishLang.id)
                    } else {
                        // Otherwise use the first language
                        setFormData(prev => ({
                            ...prev,
                            language_id: data[0].id
                        }))
                        setActiveLanguageId(data[0].id)
                    }
                }
            } catch (err: any) {
                console.error('Error fetching languages:', err)
                setError('Failed to load languages. Please try again.')
            }
        }

        fetchLanguages()
    }, [isEditMode])

    // Load existing content data if in edit mode
    useEffect(() => {
        if (!isEditMode || !contentId) return

        const fetchContent = async () => {
            setIsLoading(true)
            try {
                const data = await getContentWithTranslations(contentId)

                setFormData({
                    title: data.original.title,
                    description: data.original.description || '',
                    file_link: data.original.file_link,
                    language_id: data.original.language.id,
                    type: data.original.type || 'module',
                    translations: data.translations ? data.translations.map(t => ({
                        id: t.id,
                        title: t.title,
                        description: t.description || '',
                        file_link: t.file_link,
                        language_id: t.language.id
                    })) : []
                })

                // Set active language to the original content's language
                setActiveLanguageId(data.original.language.id)
            } catch (err: any) {
                console.error('Error fetching content:', err)
                setError('Failed to load content. Please try again.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchContent()
    }, [contentId, isEditMode])

    // Get active content based on selected language tab
    const getActiveContent = () => {
        if (!activeLanguageId) return null

        // If it's the original content
        if (activeLanguageId === formData.language_id) {
            return {
                title: formData.title,
                description: formData.description,
                file_link: formData.file_link,
                language_id: formData.language_id,
                isOriginal: true,
                index: -1
            }
        }

        // If it's a translation
        const translationIndex = formData.translations ? formData.translations.findIndex(t => t.language_id === activeLanguageId) : -1
        if (translationIndex >= 0) {
            return {
                ...formData.translations[translationIndex],
                isOriginal: false,
                index: translationIndex
            }
        }

        return null
    }

    const activeContent = getActiveContent()

    // Add a new translation for a specific language
    const addTranslation = (languageId: number) => {
        if ((formData.translations && formData.translations.some(t => t.language_id === languageId)) || formData.language_id === languageId) {
            // Already exists
            return
        }

        setFormData(prev => ({
            ...prev,
            translations: [
                ...prev.translations,
                {
                    title: '',
                    description: '',
                    language_id: languageId
                }
            ]
        }))

        // Switch to the new translation
        setActiveLanguageId(languageId)
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (isTranslationDropdownOpen && !(event.target as Element).closest('.translation-dropdown-container')) {
                setIsTranslationDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isTranslationDropdownOpen]);

    // Handle title and description changes for active content
    const handleActiveContentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target

        if (activeContent?.isOriginal) {
            // Update original content
            setFormData(prev => ({
                ...prev,
                [name]: value
            }))
        } else if (activeContent && activeContent.index >= 0) {
            // Update translation
            setFormData(prev => ({
                ...prev,
                translations: prev.translations ? prev.translations.map((t, idx) =>
                    idx === activeContent.index ? { ...t, [name]: value } : t
                ) : []
            }))
        }
    }

    // Handle file selection for active content
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0 || !activeContent) return

        const file = e.target.files[0]

        if (activeContent.isOriginal) {
            // Update original content file
            setFormData(prev => ({
                ...prev,
                file
            }))

            // Upload the file immediately
            await handleFileUpload(file, 'main')
        } else if (activeContent.index >= 0) {
            // Update translation file
            setFormData(prev => ({
                ...prev,
                translations: prev.translations ? prev.translations.map((t, idx) =>
                    idx === activeContent.index ? { ...t, file } : t
                ) : []
            }))

            // Upload the file immediately
            await handleFileUpload(file, activeContent.index)
        }
    }

    // Handle file upload
    const handleFileUpload = async (file: File, id: string | number) => {
        setIsUploading(prev => ({ ...prev, [id]: true }))

        try {
            const result = await uploadFile(file)

            if (id === 'main') {
                // Update main content file_link
                setFormData(prev => ({
                    ...prev,
                    file_link: result.file_url
                }))
            } else {
                // Update translation file_link
                setFormData(prev => ({
                    ...prev,
                    translations: prev.translations ? prev.translations.map((t, idx) =>
                        idx === id
                            ? { ...t, file_link: result.file_url }
                            : t
                    ) : []
                }))
            }
        } catch (err: any) {
            console.error('Error uploading file:', err)
            alert(`Failed to upload file: ${err.message}`)
        } finally {
            setIsUploading(prev => ({ ...prev, [id]: false }))
        }
    }

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)
        setError(null)

        try {
            // Prepare data for API
            const payload = {
                title: formData.title,
                description: formData.description,
                file_link: formData.file_link || '',
                language_id: formData.language_id,
                type: formData.type,
                is_original: true,
                translations: formData.translations ? formData.translations.map(t => ({
                    id: t.id,
                    title: t.title,
                    description: t.description,
                    file_link: t.file_link || '',
                    language_id: t.language_id
                })) : []
            }

            if (isEditMode && contentId) {
                // Update existing content
                await updateContent(contentId, payload)
            } else {
                // Create new content
                await createContent(payload)
            }

            // Redirect to content list
            router.push('/admin/content')
        } catch (err: any) {
            console.error('Error saving content:', err)
            setError(err.message || 'Failed to save content. Please try again.')
            window.scrollTo(0, 0)
        } finally {
            setIsSaving(false)
        }
    }

    // Get language name by ID
    const getLanguageName = (id: number) => {
        const language = languages.find(lang => lang.id === id)
        return language ? language.name : 'Unknown'
    }

    // Get language flag emoji by ID
    const getLanguageFlag = (id: number) => {
        const language = languages.find(lang => lang.id === id)
        if (!language) return '🌐'

        const flagMap: Record<string, string> = {
            'en': '🇺🇸',
            'fr': '🇫🇷',
            'ar': '🇦🇪',
            'pt': '🇧🇷',
        }

        return flagMap[language.code] || '🌐'
    }

    // Clear file for active content
    const clearActiveFile = () => {
        if (activeContent?.isOriginal) {
            setFormData(prev => ({ ...prev, file_link: '' }))
        } else if (activeContent && activeContent.index >= 0) {
            setFormData(prev => ({
                ...prev,
                translations: prev.translations ? prev.translations.map((t, idx) =>
                    idx === activeContent.index ? { ...t, file_link: '' } : t
                ) : []
            }))
        }
    }

    if (isLoading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#FFA94D] border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Include the translation handler to ensure language changes are detected */}
            <AdminTranslationHandler />

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    {isEditMode ? t('editContent') : t('createContent')}
                </h1>
                <button
                    type="button"
                    onClick={() => router.push('/admin/content')}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    {t('back')}
                </button>
            </div>

            {error && (
                <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <X className="h-5 w-5 text-red-400" />
                        </div>
                        <div className="ml-3">
                            <h3 className="text-sm font-medium text-red-800">{t('error')}</h3>
                            <div className="mt-2 text-sm text-red-700">
                                <p>{error}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="rounded-lg bg-white p-6 shadow">
                    {/* Language Tabs */}
                    <div className="mb-6">
                        <label className="block mb-2 text-sm font-medium text-gray-700">
                            {t('language')}:
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {/* Original language tab */}
                            <button
                                type="button"
                                onClick={() => setActiveLanguageId(formData.language_id)}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                    ${activeLanguageId === formData.language_id
                                    ? 'bg-[#FFA94D] text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                            >
                                <span>{getLanguageFlag(formData.language_id)}</span>
                                <span>{getLanguageName(formData.language_id)}</span>
                                <span className="ml-1 text-xs bg-white/20 rounded-full px-2 py-0.5">
                                    {t('original')}
                                </span>
                            </button>

                            {/* Translation tabs */}
                            {formData.translations ? formData.translations.map((translation) => (
                                <div key={translation.language_id} className="relative group">
                                    <button
                                        type="button"
                                        onClick={() => setActiveLanguageId(translation.language_id)}
                                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                                            ${activeLanguageId === translation.language_id
                                            ? 'bg-[#74C0FC] text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                                    >
                                        <span>{getLanguageFlag(translation.language_id)}</span>
                                        <span>{getLanguageName(translation.language_id)}</span>
                                        <button
                                            type="button"
                                            className="opacity-0 group-hover:opacity-100 ml-1 hover:bg-red-100 rounded-full p-1 transition-opacity"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                // Open confirmation dialog for removing translation
                                                if (confirm(`${t('confirmRemoveTranslation')} ${getLanguageName(translation.language_id)}?`)) {
                                                    // Remove translation
                                                    setFormData(prev => ({
                                                        ...prev,
                                                        translations: prev.translations.filter(t => t.language_id !== translation.language_id)
                                                    }));
                                                    // Switch to original language if removing active translation
                                                    if (activeLanguageId === translation.language_id) {
                                                        setActiveLanguageId(formData.language_id);
                                                    }
                                                }
                                            }}
                                            title={t('removeTranslation')}
                                        >
                                            <X className="h-3 w-3 text-red-500" />
                                        </button>
                                    </button>
                                </div>
                            )) : null}

                            {/* Add Translation Button */}
                            <div className="relative translation-dropdown-container">
                                <button
                                    type="button"
                                    className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                                    onClick={() => setIsTranslationDropdownOpen(!isTranslationDropdownOpen)}
                                >
                                    <Plus className="h-4 w-4" />
                                    <span>{t('addTranslation')}</span>
                                </button>

                                {/* Dropdown menu for available languages */}
                                {isTranslationDropdownOpen && (
                                    <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md border border-gray-100 overflow-hidden z-10">
                                        <div className="py-1">
                                            {languages
                                                .filter(lang =>
                                                    lang.id !== formData.language_id &&
                                                    !(formData.translations && formData.translations.some(t => t.language_id === lang.id))
                                                )
                                                .map(lang => (
                                                    <button
                                                        key={lang.id}
                                                        type="button"
                                                        onClick={() => {
                                                            addTranslation(lang.id);
                                                            setIsTranslationDropdownOpen(false);
                                                        }}
                                                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                    >
                                                        <span className="mr-2">{getLanguageFlag(lang.id)}</span>
                                                        <span>{lang.name}</span>
                                                    </button>
                                                ))}

                                            {languages.filter(lang =>
                                                lang.id !== formData.language_id &&
                                                !(formData.translations && formData.translations.some(t => t.language_id === lang.id))
                                            ).length === 0 && (
                                                <div className="px-4 py-2 text-sm text-gray-500">
                                                    {t('noAvailableLanguages')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Active Content Form */}
                    {activeContent && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-1">
                                    {activeContent.isOriginal
                                        ? `${t('mainContent')} (${getLanguageName(activeContent.language_id)})`
                                        : `${t('translation')} - ${getLanguageName(activeContent.language_id)}`
                                    }
                                </h3>
                                <p className="text-sm text-gray-500">
                                    {activeContent.isOriginal
                                        ? t('originalContentDescription')
                                        : t('translationDescription')
                                    }
                                </p>
                            </div>

                            <div className="space-y-6">
                                {/* Title Field */}
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('title')}
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        required
                                        value={activeContent.isOriginal ? formData.title : activeContent.title}
                                        onChange={handleActiveContentChange}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FFA94D] focus:ring-[#FFA94D] text-base px-4 py-3"
                                        placeholder={`${t('title')}...`}
                                    />
                                </div>

                                {/* Description Field */}
                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                        {t('description')}
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        rows={6}
                                        value={activeContent.isOriginal ? formData.description : activeContent.description}
                                        onChange={handleActiveContentChange}
                                        className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-[#FFA94D] focus:ring-[#FFA94D] text-base px-4 py-3"
                                        placeholder={`${t('description')}...`}
                                    />
                                </div>

                                {/* File Upload Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('file')}</label>
                                    <div className="mt-1">
                                        {(activeContent.isOriginal ? formData.file_link : activeContent.file_link) ? (
                                            <div className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm">
                                                <a
                                                    href={activeContent.isOriginal ? formData.file_link : activeContent.file_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:text-blue-800 truncate flex-1"
                                                >
                                                    {(activeContent.isOriginal ? formData.file_link : activeContent.file_link)?.split('/').pop()}
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={clearActiveFile}
                                                    className="ml-2 rounded-full p-1 text-red-600 hover:bg-red-50"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="w-full">
                                                <label
                                                    htmlFor={`file-upload-${activeContent.language_id}`}
                                                    className={`flex cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-gray-300 px-6 py-8 ${
                                                        isUploading[activeContent.isOriginal ? 'main' : activeContent.index]
                                                            ? 'bg-gray-50'
                                                            : 'hover:bg-gray-50'
                                                    }`}
                                                >
                                                    {isUploading[activeContent.isOriginal ? 'main' : activeContent.index] ? (
                                                        <div className="flex flex-col items-center">
                                                            <div className="mb-3 h-6 w-6 animate-spin rounded-full border-2 border-[#FFA94D] border-t-transparent"></div>
                                                            <span className="text-base text-gray-500">{t('uploading')}</span>
                                                        </div>
                                                    ) : (
                                                        <div className="text-center">
                                                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                                            <div className="mt-3 flex flex-col">
                                                                <span className="text-base font-medium text-[#FFA94D]">{t('uploadAFile')}</span>
                                                                <span className="mt-1 text-sm text-gray-500">{t('supportedFileFormats')}</span>
                                                                <input
                                                                    id={`file-upload-${activeContent.language_id}`}
                                                                    name="file"
                                                                    type="file"
                                                                    className="sr-only"
                                                                    onChange={handleFileChange}
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                </label>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Form Actions */}
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => router.push('/admin/content')}
                        className="rounded-lg border border-gray-300 bg-white px-5 py-3 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    >
                        {t('cancel')}
                    </button>
                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center rounded-lg border border-transparent bg-gradient-to-r from-[#FFA94D] to-[#FF8A3D] px-5 py-3 text-base font-medium text-white shadow-sm hover:from-[#FF8A3D] hover:to-[#FF7A2D] focus:outline-none focus:ring-2 focus:ring-[#FFA94D] focus:ring-offset-2 disabled:opacity-50"
                    >
                        {isSaving ? (
                            <>
                                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                {t('saving')}
                            </>
                        ) : (
                            <>
                                <Save className="mr-2 h-5 w-5" />
                                {isEditMode ? t('updateContent') : t('createContent')}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    )
}
