// lib/api.ts
import { Language } from './types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// Function to handle API errors
const handleApiError = (error: any) => {
    console.error('API Error:', error);
    return Promise.reject(error);
};

// Fetch all content with optional language filter
export async function getContent(lang?: string, contentType?: string) {
    try {
        let url = `${API_BASE_URL}/content`;

        // Add query parameters if provided
        const params = new URLSearchParams();
        if (lang) params.append('lang', lang);
        if (contentType) params.append('type', contentType);

        if (params.toString()) {
            url = `${url}?${params.toString()}`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data.data;
    } catch (error) {
        return handleApiError(error);
    }
}

// Get content details with translations
export async function getContentWithTranslations(id: string | number) {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/content/${id}`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        return handleApiError(error);
    }
}

// Log download event
export async function logDownload(id: string | number) {
    try {
        const response = await fetch(`${API_BASE_URL}/download/${id}`, {
            method: 'POST',
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        return handleApiError(error);
    }
}

// Get all available languages
export async function getLanguages() {
    try {
        const response = await fetch(`${API_BASE_URL}/languages`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        return data.data as Language[];
    } catch (error) {
        return handleApiError(error);
    }
}

// Log visit to the site
export async function logVisit(contentId?: number) {
    try {
        const response = await fetch(`${API_BASE_URL}/visit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content_id: contentId }),
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        // Just log the error but don't reject - visits shouldn't block the app
        console.error('Error logging visit:', error);
        return null;
    }
}