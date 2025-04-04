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

            // If data is empty or null, show appropriate message
            if (!data || !Array.isArray(data) || data.length === 0) {
                console.log('No courses available');
                setCourses([]);
                setError(null); // No error, just empty
            } else {
                console.log(`Received ${data.length} courses from API`);

                // Map backend content to frontend course objects
                try {
                    const mappedCourses = data.map((content: any) => {
                        console.log('Mapping content to course:', content);
                        // Ensure the content object has required properties
                        if (!content || typeof content !== 'object') {
                            throw new Error('Invalid content object received from API');
                        }

                        return {
                            id: content.id?.toString() || 'unknown',
                            title: content.title || 'Untitled Course',
                            description: content.description || 'No description available',
                            image: content.file_link && content.file_link !== 'no-file'
                                ? content.file_link : '/placeholder.svg',
                            languages: content.language?.name ? [content.language.name] : ['English'],
                            level: content.type || 'Beginner',
                            duration: "4 weeks" // Default duration since it's not in the API
                        };
                    });
                    setCourses(mappedCourses);
                } catch (err) {
                    console.error('Error mapping courses:', err);
                    setError('Error processing course data');
                    setCourses([]);
                }
            }
        } catch (err) {
            console.error('Error fetching courses:', err)
            setError('Failed to load courses. Please try again later.')
            setCourses([]);
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