'use client'

import Image from "next/image"
import Link from "next/link"
import type { Course } from "@/lib/types"
import { useLanguage } from "@/app/language-provider"

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  const { t, localizedPath } = useLanguage()

  if (!course) {
    console.error('Received null or undefined course in CourseCard');
    return null;
  }

  console.log('Rendering course card:', course);

  // Translate level - with safeguards
  const levelKey = course.level?.toLowerCase() as any || 'beginner';
  const translatedLevel = t(levelKey) || course.level || 'Beginner';

  // Format duration with translation and safeguards
  const durationParts = course.duration?.split(' ') || ['4'];
  const weeks = durationParts[0] || '4';
  const translatedDuration = `${weeks} ${t('weeks')}`

  return (
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md">
        <div className="relative h-48 w-full overflow-hidden">
          <Image
              src={course.image || "/placeholder.svg?height=200&width=400"}
              alt={course.title}
              fill
              className="object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <div className="flex gap-1">
              {course.languages.map((lang) => (
                  <span
                      key={lang}
                      className="inline-flex items-center rounded-full bg-white/90 px-2 py-1 text-xs font-medium"
                  >
                {lang}
              </span>
              ))}
            </div>
          </div>
        </div>
        <div className="p-5">
          <h3 className="mb-2 text-xl font-bold">{course.title}</h3>
          <p className="mb-4 text-gray-600">{course.description}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-sm text-gray-500">{translatedLevel}</div>
              <div className="mx-2 h-1 w-1 rounded-full bg-gray-300"></div>
              <div className="text-sm text-gray-500">{translatedDuration}</div>
            </div>
            <Link
                href={localizedPath(`/training/${course.id}`)}
                className="rounded-lg bg-gradient-to-r from-[#FFA94D] to-[#FF8A3D] px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
            >
              Explore
            </Link>
          </div>
        </div>
      </div>
  )
}