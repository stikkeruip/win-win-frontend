'use client'

import Link from "next/link"
import { useLanguage } from "@/app/language-provider"
import FilePreview from "./file-preview"

// Define a simpler Course interface that matches what we actually have
interface Course {
  id: string
  title: string
  description: string
  image?: string
  file_link?: string
  languages: string[]
}

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const { t, localizedPath } = useLanguage()

  if (!course) {
    console.error('Received null or undefined course in CourseCard');
    return null;
  }

  // Helper function to ensure file URLs are correctly formed
  const getFullUrl = (url: string | undefined) => {
    if (!url) return undefined;
    if (url === 'no-file') return undefined;

    // Check if the URL is already absolute
    if (url.startsWith('http')) return url;

    // Add leading slash if needed
    if (!url.startsWith('/')) url = '/' + url;

    // Prefix with API base URL
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    return API_BASE_URL + url;
  }

  // Get file URL to display (prioritize file_link over image)
  const fileToDisplay = course.file_link || course.image;

  // Safely access properties with fallbacks
  const {
    id = 'unknown',
    title = 'Untitled Course',
    description = 'No description available',
  } = course;

  // Ensure we have languages array, even if empty
  const languages = Array.isArray(course.languages) ? course.languages : ['English'];

  return (
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
        <div className="relative h-48 w-full overflow-hidden">
          <FilePreview
              fileUrl={fileToDisplay}
              title={title}
              aspectRatio="video"
              showDownloadButton={false}
          />

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="flex flex-wrap gap-1">
              {languages.slice(0, 3).map((lang, index) => (
                  <span
                      key={`${id}-lang-${index}`}
                      className="inline-flex items-center rounded-full bg-white/90 px-2 py-1 text-xs font-medium"
                  >
                    {lang}
                  </span>
              ))}
              {languages.length > 3 && (
                  <span className="inline-flex items-center rounded-full bg-white/90 px-2 py-1 text-xs font-medium">
                  +{languages.length - 3}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="p-5">
          <h3 className="mb-2 text-xl font-bold">{title}</h3>
          <p className="mb-4 line-clamp-2 text-gray-600">{description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="mx-2 h-1 w-1 rounded-full bg-gray-300"></div>
            </div>
            <Link
                href={localizedPath(`/training/${id}`)}
                className="rounded-lg bg-gradient-to-r from-[#FFA94D] to-[#FF8A3D] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
            >
              {t('learnMore') || 'Explore'}
            </Link>
          </div>
        </div>
      </div>
  )
}