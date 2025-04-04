'use client'

import AdminContentForm from '@/components/admin/content-form'
import { useParams } from 'next/navigation'

export default function EditContentPage() {
    const params = useParams()
    const contentId = params.id ? parseInt(params.id as string, 10) : undefined

    return <AdminContentForm contentId={contentId} />
}