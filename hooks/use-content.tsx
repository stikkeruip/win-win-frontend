// hooks/use-content.tsx
'use client'

import { useState, useEffect } from 'react'
import { Content, Course, mapContentToCourse } from '@/lib/types'
import { getContent, logVisit } from '@/lib/api'
import { useLanguage } from '@/app/language-provider'

export function useContent() {
    const [courses, setCourses] = useState<Course[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { currentLang } = useLanguage()

    // Convert two-letter language code to the API's language code
    const getApiLanguageCode = (langCode: string) => {
        // Map the UI language codes to API language codes
        const langMap: Record<string, string> = {
            'en': 'en',
            'fr': 'fr',
            'ar': 'ar',
            'pt': 'pt'
        }
        return langMap[langCode] || 'en'
    }

    const fetchCourses = async (langCode?: string) => {
        setIsLoading(true)
        setError(null)

        try {
            const apiLangCode = langCode ? getApiLanguageCode(langCode) : undefined
            console.log(`Fetching courses with language: ${apiLangCode}, type: course`);
            const data = await getContent(apiLangCode, 'course')

            console.log('Content data received:', data);

            // The data should be an array at this point because getContent now handles the structure
            if (Array.isArray(data)) {
                console.log(`Received ${data.length} courses from API`);
                // Map backend content to frontend course objects
                const mappedCourses = data.map((content: Content) => {
                    console.log('Mapping content to course:', content);
                    return mapContentToCourse(content);
                });
                setCourses(mappedCourses);
            } else {
                console.error('Data is not an array after processing:', data);
                setCourses([]);
                setError('No courses available for this language');
            }
        } catch (err) {
            console.error('Error fetching courses:', err)
            setError('Failed to load courses. Please try again later.')
        } finally {
            setIsLoading(false)
        }
    }

    // Log a visit when the component mounts
    useEffect(() => {
        logVisit()
    }, [])

    // Fetch courses when language changes
    useEffect(() => {
        fetchCourses(currentLang)
    }, [currentLang])

    return {
        courses,
        isLoading,
        error,
        refetch: fetchCourses
    }
}