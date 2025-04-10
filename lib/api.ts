// lib/api.ts
import { Language } from './types';

const API_BASE_URL =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:8080'
        : '';
// Function to handle API errors
const handleApiError = (error: any) => {
    console.error('API Error:', error);
    return Promise.reject(error);
};

// Fetch content with optional language filter and content ID
export async function getContent(lang?: string, contentType?: string, contentId?: string) {
    try {
        let url = `${API_BASE_URL}/api/content`;

        // Add query parameters if provided
        const params = new URLSearchParams();
        if (lang) params.append('lang', lang);
        if (contentType) params.append('type', contentType);
        if (contentId) params.append('id', contentId); // Add content ID filter

        if (params.toString()) {
            url = `${url}?${params.toString()}`;
        }

        console.log(`Fetching content from: ${url}`);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();
        console.log('API response:', data);

        // Check if the data property exists and is an array
        if (data && data.data && Array.isArray(data.data)) {
            return data.data;
        } else if (data && Array.isArray(data)) {
            // Some APIs might return the array directly
            return data;
        } else {
            // Return empty array for null data
            console.warn('API returned null or invalid data, using empty array');
            return [];
        }
    } catch (error) {
        console.error('Error fetching content:', error);
        // Return empty array instead of rejecting to avoid UI crashes
        return [];
    }
}

// Get content details with translations
export async function getContentWithTranslations(id: string | number) {
    try {
        // First try to use the admin endpoint which returns translations
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/content/${id}`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const data = await response.json();
                return data;
            }
        } catch (adminError) {
            console.log('Admin endpoint not available, falling back to public endpoint');
        }

        // Fallback to the public endpoint which doesn't include translations
        const allContent = await getContent(undefined, undefined, id.toString());

        if (!allContent || allContent.length === 0) {
            throw new Error('Content not found');
        }

        // Create a ContentWithTranslations object with just the original content
        return {
            original: allContent[0],
            translations: [] // Empty translations array since we don't have admin access
        };
    } catch (error) {
        console.error('Error in getContentWithTranslations:', error);
        return handleApiError(error);
    }
}

// Log download event
export async function logDownload(id: string | number) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/download/${id}`, {
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
        const response = await fetch(`${API_BASE_URL}/api/languages`);

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Check data structure
        if (data && data.data && Array.isArray(data.data)) {
            return data.data as Language[];
        } else if (data && Array.isArray(data)) {
            return data as Language[];
        }

        console.warn('Languages API returned invalid data structure');
        return [];
    } catch (error) {
        console.error('Error fetching languages:', error);
        return [];
    }
}

// Log visit to the site
export async function logVisit(contentId?: number) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/visit`, {
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
