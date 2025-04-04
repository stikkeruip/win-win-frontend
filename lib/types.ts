// lib/types.ts
export interface Course {
  id: string
  title: string
  description: string
  image?: string
  languages: string[]
  level: string
  duration: string
}

// Types to match the backend API
export interface Language {
  id: number
  code: string
  name: string
}

export type CourseType = 'beginner' | 'intermediate' | 'advanced'

// Additional translation keys for course detail page
export type CourseDetailTranslationKey =
    | 'availableLanguages'
    | 'downloadMaterials'
    | 'startCourse'
    | 'browseOtherCourses'
    | 'courseDetails'
    | 'language'
    | 'level'
    | 'lastUpdated'

export interface ContentLanguage {
  id: number
  code: string
  name: string
}

export interface Content {
  id: number
  title: string
  description: string
  file_link: string
  language: ContentLanguage
  created_at: string
  updated_at: string
  course_id?: number
  is_original: boolean
  type?: string
}

export interface ContentWithTranslations {
  original: Content
  translations: Content[]
}

// Helper function to map API content to Course type
export function mapContentToCourse(content: Content): Course {
  if (!content) {
    console.error('Received null or undefined content object');
    // Return a placeholder course object
    return {
      id: 'error',
      title: 'Error loading course',
      description: 'Could not load course details',
      languages: ['English'],
      level: 'Beginner',
      duration: '0 weeks'
    };
  }

  console.log('Mapping content object:', JSON.stringify(content, null, 2));

  // Validate language object
  if (!content.language || typeof content.language !== 'object') {
    console.error('Invalid language object in content:', content.language);
    content.language = { id: 0, code: 'en', name: 'English' };
  }

  // Determine the course level based on the type field
  let level = 'Beginner';
  if (content.type) {
    if (content.type.toLowerCase().includes('intermediate')) {
      level = 'Intermediate';
    } else if (content.type.toLowerCase().includes('advanced')) {
      level = 'Advanced';
    }
  }

  return {
    id: content.id?.toString() || 'unknown',
    title: content.title || 'Untitled Course',
    description: content.description || 'No description available',
    image: content.file_link && content.file_link !== 'no-file' ? content.file_link : undefined,
    languages: [content.language.name || 'Unknown'], // We'll enhance this with translations where available
    level, // Use mapped level from content type
    duration: "4 weeks" // Default duration since it's not in the API
  };
}