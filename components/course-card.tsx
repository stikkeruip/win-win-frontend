'use client'

import Image from "next/image"
import Link from "next/link"
import { useLanguage } from "@/app/language-provider"

// Define a simpler Course interface that matches what we actually have
interface Course {
  id: string
  title: string
  description: string
  image?: string
  languages: string[]
  level: string
  duration: string
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

  // Safely access properties with fallbacks
  const {
    id = 'unknown',
    title = 'Untitled Course',
    description = 'No description available',
    level = 'beginner',
    duration = '4 weeks',
  } = course;

  // Ensure we have languages array, even if empty
  const languages = Array.isArray(course.languages) ? course.languages : ['English'];

  // Map level to translation key
  let levelKey = 'beginner';
  if (level && typeof level === 'string') {
    const lowerLevel = level.toLowerCase();
    if (lowerLevel.includes('inter')) levelKey = 'intermediate';
    else if (lowerLevel.includes('advan')) levelKey = 'advanced';
  }

  // Get translated text
  const translatedLevel = t(levelKey as any);

  // Format duration with translation
  const durationParts = duration?.split(' ') || ['4'];
  const weeks = durationParts[0] || '4';
  const translatedDuration = `${weeks} ${t('weeks')}`

  return (
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
              src={course.image || "/placeholder.svg"}
              alt={title}
              fill
              className="object-cover"
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
              <div className="text-sm text-gray-500">{translatedLevel}</div>
              <div className="mx-2 h-1 w-1 rounded-full bg-gray-300"></div>
              <div className="text-sm text-gray-500">{translatedDuration}</div>
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