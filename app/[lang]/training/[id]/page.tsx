// app/[lang]/training/[id]/page.tsx
'use client'

import CourseDetail from '@/app/training/course-detail'

export default function LanguageCourseDetailPage() {
    // This page just renders the shared CourseDetail component
    // The component will handle language selection based on the route
    return <CourseDetail />
}