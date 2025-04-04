'use client'

import { useEffect, useState } from "react"
import CourseCard from "@/components/course-card"
import { useLanguage } from "@/app/language-provider"
import { useContent } from "@/hooks/use-content"
import { getLanguages } from "@/lib/api"
import { Language } from "@/lib/types"

export default function Training() {
  const { t, currentLang } = useLanguage()
  const { courses, isLoading, error, refetch } = useContent()
  const [languages, setLanguages] = useState<Language[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null)

  // Fetch available languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const languagesData = await getLanguages()
        setLanguages(languagesData)
      } catch (err) {
        console.error('Error fetching languages:', err)
      }
    }

    fetchLanguages()
  }, [])

  // Handle language filter change
  const handleLanguageFilter = (langCode: string | null) => {
    setSelectedLanguage(langCode)

    if (langCode) {
      refetch(langCode)
    } else {
      refetch(currentLang)
    }
  }

  return (
      <div className="bg-white py-12 md:py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              <span className="text-[#FFA94D]">{t('training')}</span> <span className="text-[#74C0FC]">{t('trainingCourses')}</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              {t('exploreOurCourses')}
            </p>
          </div>

          {/* Course filters */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-lg bg-gray-50 p-4">
            <div className="text-lg font-medium">{t('filterCourses')}</div>
            <div className="flex flex-wrap gap-2">
              <button
                  className={`rounded-full px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-100 ${
                      selectedLanguage === null ? 'bg-[#FFA94D] text-white' : 'bg-white'
                  }`}
                  onClick={() => handleLanguageFilter(null)}
              >
                {t('allCourses')}
              </button>

              {languages.map((language) => (
                  <button
                      key={language.code}
                      className={`rounded-full px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-100 ${
                          selectedLanguage === language.code ? 'bg-[#FFA94D] text-white' : 'bg-white'
                      }`}
                      onClick={() => handleLanguageFilter(language.code)}
                  >
                    {language.name}
                  </button>
              ))}
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
              <div className="flex justify-center py-12">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FFA94D] border-t-transparent"></div>
              </div>
          )}

          {/* Error state */}
          {error && !isLoading && (
              <div className="rounded-lg bg-red-50 p-6 text-center">
                <p className="text-red-600">{error}</p>
                <button
                    className="mt-4 rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-200"
                    onClick={() => refetch(currentLang)}
                >
                  Try Again
                </button>
              </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && courses.length === 0 && (
              <div className="rounded-lg bg-gray-50 p-12 text-center">
                <h3 className="text-xl font-medium text-gray-600">No courses found</h3>
                <p className="mt-2 text-gray-500">Try changing your filters or check back later for new content.</p>
              </div>
          )}

          {/* Course grid */}
          {!isLoading && !error && courses.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                ))}
              </div>
          )}
        </div>
      </div>
  )
}