'use client'

import { useEffect } from "react"
import CourseCard from "@/components/course-card"
import { useLanguage } from "@/app/language-provider"
import { useContent } from "@/hooks/use-content"

export default function Training() {
  const { t, currentLang } = useLanguage()
  const { courses, isLoading, error, refetch } = useContent()

  // Initial content load based on current language
  useEffect(() => {
    // Only fetch on initial load - the useContent hook already handles language changes
  }, [])

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
                <p className="mt-2 text-gray-500">Check back later for new content.</p>
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