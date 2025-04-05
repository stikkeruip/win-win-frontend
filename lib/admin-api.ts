// lib/admin-api.ts
import { Content, ContentWithTranslations, Language } from './types'

// Backend API base URL
const API_BASE_URL = 'http://localhost:8080';

// Function to make authenticated requests to the API
export async function makeAuthenticatedRequest(url: string, options: RequestInit = {}) {
    // Get the token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null

    if (!token) {
        throw new Error('Authentication token not found')
    }

    // Set up headers
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    }

    // Prepend API base URL to relative URLs
    const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`;

    // Make the request
    const response = await fetch(fullUrl, {
        ...options,
        headers,
    })

    if (response.status === 401) {
        // Token is invalid or expired
        if (typeof window !== 'undefined') {
            // Clear token and redirect to login
            localStorage.removeItem('adminToken')
            window.location.href = '/admin/login'
        }
        throw new Error('Your session has expired. Please log in again.')
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Request failed with status ${response.status}`)
    }

    return await response.json()
}

// Get all content
export async function getAdminContent(lang?: string, type?: string) {
    const params = new URLSearchParams()
    if (lang) params.append('lang', lang)
    if (type) params.append('type', type)

    const url = `/api/admin/content${params.toString() ? `?${params.toString()}` : ''}`
    const result = await makeAuthenticatedRequest(url)

    return result.data || []
}

// Get content by ID with translations
export async function getContentWithTranslations(id: number): Promise<ContentWithTranslations> {
    return await makeAuthenticatedRequest(`/api/admin/content/${id}`)
}

// Create new content
export async function createContent(data: any) {
    return await makeAuthenticatedRequest('/api/admin/content', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

// Update content
export async function updateContent(id: number, data: any) {
    if (!data.removed_translation_ids) {
        data.removed_translation_ids = [];
    }

    return await makeAuthenticatedRequest(`/api/admin/content/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}

// Delete content
export async function deleteContent(id: number) {
    return await makeAuthenticatedRequest(`/api/admin/content/${id}`, {
        method: 'DELETE',
    })
}

// Get all languages
export async function getLanguages(): Promise<Language[]> {
    const result = await fetch(`${API_BASE_URL}/api/languages`)
    const data = await result.json()
    return data.data || []
}

// Upload a file
export async function uploadFile(file: File) {
    const formData = new FormData()
    formData.append('file', file)

    // Get the token from localStorage
    const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null

    if (!token) {
        throw new Error('Authentication token not found')
    }

    const response = await fetch(`${API_BASE_URL}/api/admin/upload`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        body: formData,
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || `Upload failed with status ${response.status}`)
    }

    return await response.json()
}

// Create multilingual content
export async function createMultilingualContent(data: any) {
    return await makeAuthenticatedRequest('/api/admin/content/multilingual', {
        method: 'POST',
        body: JSON.stringify(data),
    })
}

// Get visit statistics
export async function getVisitStats() {
    return await makeAuthenticatedRequest('/api/admin/stats/visits')
}
