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
    Plus,
    Upload,
    Save,
    ArrowLeft,
    Trash2,
    Globe,
    UploadCloud
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
                    } else {
                        // Otherwise use the first language
                        setFormData(prev => ({
                            ...prev,
                            language_id: data[0].id
                        }))
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
                    translations: data.translations.map(t => ({
                        id: t.id,
                        title: t.title,
                        description: t.description || '',
                        file_link: t.file_link,
                        language_id: t.language.id
                    }))
                })
            } catch (err: any) {
                console.error('Error fetching content:', err)
                setError('Failed to load content. Please try again.')
            } finally {
                setIsLoading(false)
            }
        }

        fetchContent()
    }, [contentId, isEditMode])

    // Handle form field changes for main content
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: name === 'language_id' ? parseInt(value, 10) : value
        }))
    }

    // Handle file selection for main content
    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return

        const file = e.target.files[0]
        setFormData(prev => ({
            ...prev,
            file
        }))

        // Upload the file immediately
        await handleFileUpload(file, 'main')
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
                    translations: prev.translations.map((t, idx) =>
                        idx === id
                            ? { ...t, file_link: result.file_url }
                            : t
                    )
                }))
            }
        } catch (err: any) {
            console.error('Error uploading file:', err)
            alert(`Failed to upload file: ${err.message}`)
        } finally {
            setIsUploading(prev => ({ ...prev, [id]: false }))
        }
    }

    // Add a new translation field
    const addTranslation = () => {
        // Get unused languages (languages that are not used in translations and main content)
        const usedLanguageIds = [
            formData.language_id,
            ...formData.translations.map(t => t.language_id)
        ]

        const availableLanguages = languages.filter(
            lang => !usedLanguageIds.includes(lang.id)
        )

        if (availableLanguages.length === 0) {
            alert('All languages are already used')
            return
        }

        setFormData(prev => ({
            ...prev,
            translations: [
                ...prev.translations,
                {
                    title: '',
                    description: '',
                    language_id: availableLanguages[0].id
                }
            ]
        }))
    }

    // Handle form field changes for translations
    const handleTranslationChange = (
        index: number,
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            translations: prev.translations.map((t, idx) =>
                idx === index ? { 
                    ...t, 
                    [name]: name === 'language_id' ? parseInt(value, 10) : value 
                } : t
            )
        }))
    }

    // Handle file selection for translations
    const handleTranslationFileChange = async (
        index: number,
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (!e.target.files || e.target.files.length === 0) return

        const file = e.target.files[0]
        setFormData(prev => ({
            ...prev,
            translations: prev.translations.map((t, idx) =>
                idx === index ? { ...t, file } : t
            )
        }))

        // Upload the file immediately
        await handleFileUpload(file, index)
    }

    // Remove a translation
    const removeTranslation = (index: number) => {
        setFormData(prev => ({
            ...prev,
            translations: prev.translations.filter((_, idx) => idx !== index)
        }))
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
                translations: formData.translations.map(t => ({
                    id: t.id,
                    title: t.title,
                    description: t.description,
                    file_link: t.file_link || '',
                    language_id: t.language_id
                }))
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
                <div className="space-y-8 divide-y divide-gray-200">
                    {/* Main Content Form */}
                    <div className="space-y-6 rounded-lg bg-white p-6 shadow">
                        <div>
                            <h3 className="text-lg font-medium leading-6 text-gray-900">
                                {t('mainContent')} ({getLanguageName(formData.language_id)})
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                {t('originalContentDescription')}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                    {t('title')}
                                </label>
                                <div className="mt-1">
                                    <input
                                        type="text"
                                        name="title"
                                        id="title"
                                        required
                                        value={formData.title}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="language_id" className="block text-sm font-medium text-gray-700">
                                    {t('language')}
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="language_id"
                                        name="language_id"
                                        required
                                        value={formData.language_id}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                    >
                                        <option value="">{t('admin_selectLanguage')}</option>
                                        {languages.map(language => (
                                            <option key={language.id} value={language.id}>
                                                {language.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-3">
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                    {t('contentType')}
                                </label>
                                <div className="mt-1">
                                    <select
                                        id="type"
                                        name="type"
                                        required
                                        value={formData.type}
                                        onChange={handleInputChange}
                                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                    >
                                        <option value="module">Module</option>
                                        <option value="resource">Resource</option>
                                        <option value="document">Document</option>
                                        <option value="video">Video</option>
                                        <option value="beginner">{t('beginner')}</option>
                                        <option value="intermediate">{t('intermediate')}</option>
                                        <option value="advanced">{t('advanced')}</option>
                                    </select>
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                    {t('description')}
                                </label>
                                <div className="mt-1">
                  <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={formData.description}
                      onChange={handleInputChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                  />
                                </div>
                            </div>

                            <div className="sm:col-span-6">
                                <label className="block text-sm font-medium text-gray-700">{t('file')}</label>
                                <div className="mt-1 flex items-center">
                                    {formData.file_link ? (
                                        <div className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm">
                                            <a
                                                href={formData.file_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                {formData.file_link.split('/').pop()}
                                            </a>
                                            <button
                                                type="button"
                                                onClick={() => setFormData(prev => ({ ...prev, file_link: '' }))}
                                                className="ml-2 text-red-600 hover:text-red-800"
                                            >
                                                <X className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="w-full">
                                            <label
                                                htmlFor="main-file-upload"
                                                className={`flex cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 py-4 ${
                                                    isUploading['main'] ? 'bg-gray-50' : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                {isUploading['main'] ? (
                                                    <div className="flex items-center">
                                                        <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
                                                        <span className="text-sm text-gray-500">{t('uploading')}</span>
                                                    </div>
                                                ) : (
                                                    <div className="text-center">
                                                        <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                                        <div className="mt-2 flex text-sm text-gray-600">
                                                            <span>{t('uploadAFile')}</span>
                                                            <input
                                                                id="main-file-upload"
                                                                name="file"
                                                                type="file"
                                                                className="sr-only"
                                                                onChange={handleFileChange}
                                                            />
                                                        </div>
                                                        <p className="text-xs text-gray-500">
                                                            {t('supportedFileFormats')}
                                                        </p>
                                                    </div>
                                                )}
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Translations Section */}
                    <div className="pt-6">
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-medium leading-6 text-gray-900">{t('translations')}</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {t('translationsDescription')}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={addTranslation}
                                    className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                                >
                                    <Plus className="mr-2 h-4 w-4" />
                                    {t('addTranslationButton')}
                                </button>
                            </div>

                            {formData.translations.length === 0 ? (
                                <div className="rounded-md bg-gray-50 p-6 text-center">
                                    <Globe className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">{t('noTranslations')}</h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {t('noTranslationsDescription')}
                                    </p>
                                    <div className="mt-6">
                                        <button
                                            type="button"
                                            onClick={addTranslation}
                                            className="inline-flex items-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            {t('addTranslationButton')}
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-8">
                                    {formData.translations.map((translation, index) => (
                                        <div
                                            key={index}
                                            className="relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
                                        >
                                            <div className="absolute right-4 top-4">
                                                <button
                                                    type="button"
                                                    onClick={() => removeTranslation(index)}
                                                    className="rounded-full bg-white p-1 text-gray-400 shadow-sm hover:bg-gray-100 hover:text-gray-500"
                                                >
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>

                                            <h4 className="text-lg font-medium text-gray-900">
                                                {t('translationTitle')} ({getLanguageName(translation.language_id)})
                                                {translation.id && <span className="ml-2 text-sm text-gray-500">(ID: {translation.id})</span>}
                                            </h4>

                                            <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-6">
                                                <div className="sm:col-span-4">
                                                    <label
                                                        htmlFor={`translation-${index}-title`}
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        {t('admin_title')}
                                                    </label>
                                                    <div className="mt-1">
                                                        <input
                                                            type="text"
                                                            name="title"
                                                            id={`translation-${index}-title`}
                                                            required
                                                            value={translation.title}
                                                            onChange={(e) => handleTranslationChange(index, e)}
                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-3">
                                                    <label
                                                        htmlFor={`translation-${index}-language_id`}
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        {t('language')}
                                                    </label>
                                                    <div className="mt-1">
                                                        <select
                                                            id={`translation-${index}-language_id`}
                                                            name="language_id"
                                                            required
                                                            value={translation.language_id}
                                                            onChange={(e) => handleTranslationChange(index, e)}
                                                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                                        >
                                                            <option value="">{t('admin_selectLanguage')}</option>
                                                            {languages
                                                                .filter(lang =>
                                                                    // Show current selection or unused languages
                                                                    lang.id === translation.language_id ||
                                                                    ![
                                                                        formData.language_id,
                                                                        ...formData.translations
                                                                            .filter((_, i) => i !== index)
                                                                            .map(t => t.language_id)
                                                                    ].includes(lang.id)
                                                                )
                                                                .map(language => (
                                                                    <option key={language.id} value={language.id}>
                                                                        {language.name}
                                                                    </option>
                                                                ))
                                                            }
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-6">
                                                    <label
                                                        htmlFor={`translation-${index}-description`}
                                                        className="block text-sm font-medium text-gray-700"
                                                    >
                                                        {t('admin_description')}
                                                    </label>
                                                    <div className="mt-1">
                            <textarea
                                id={`translation-${index}-description`}
                                name="description"
                                rows={4}
                                value={translation.description}
                                onChange={(e) => handleTranslationChange(index, e)}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                            />
                                                    </div>
                                                </div>

                                                <div className="sm:col-span-6">
                                                    <label className="block text-sm font-medium text-gray-700">{t('admin_file')}</label>
                                                    <div className="mt-1 flex items-center">
                                                        {translation.file_link ? (
                                                            <div className="flex w-full items-center justify-between rounded-md border border-gray-300 bg-white px-4 py-2 text-sm">
                                                                <a
                                                                    href={translation.file_link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-blue-600 hover:text-blue-800"
                                                                >
                                                                    {translation.file_link.split('/').pop()}
                                                                </a>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setFormData(prev => ({
                                                                            ...prev,
                                                                            translations: prev.translations.map((t, i) =>
                                                                                i === index ? { ...t, file_link: '' } : t
                                                                            )
                                                                        }))
                                                                    }}
                                                                    className="ml-2 text-red-600 hover:text-red-800"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="w-full">
                                                                <label
                                                                    htmlFor={`translation-${index}-file-upload`}
                                                                    className={`flex cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 px-6 py-4 ${
                                                                        isUploading[index] ? 'bg-gray-50' : 'hover:bg-gray-50'
                                                                    }`}
                                                                >
                                                                    {isUploading[index] ? (
                                                                        <div className="flex items-center">
                                                                            <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                                                                            <span className="text-sm text-gray-500">{t('admin_uploading')}</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="text-center">
                                                                            <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                                                            <div className="mt-2 flex text-sm text-gray-600">
                                                                                <span>{t('admin_uploadAFile')}</span>
                                                                                <input
                                                                                    id={`translation-${index}-file-upload`}
                                                                                    name="file"
                                                                                    type="file"
                                                                                    className="sr-only"
                                                                                    onChange={(e) => handleTranslationFileChange(index, e)}
                                                                                />
                                                                            </div>
                                                                            <p className="text-xs text-gray-500">
                                                                                {t('admin_supportedFileFormats')}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </label>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="pt-6">
                        <div className="flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => router.push('/admin/content')}
                                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={isSaving}
                                className="inline-flex items-center rounded-md border border-transparent bg-gradient-to-r from-[#FFA94D] to-[#FF8A3D] px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-[#FF8A3D] hover:to-[#FF7A2D] focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <>
                                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                        {t('saving')}
                                    </>
                                ) : (
                                    <>
                                        <Save className="mr-2 h-4 w-4" />
                                        {isEditMode ? t('updateContent') : t('createContent')}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}
