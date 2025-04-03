"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

// Define available languages with their display names
export const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "ar", name: "العربية", flag: "🇦🇪" },
    { code: "pt", name: "Português", flag: "🇧🇷" },
]

export default function LanguageSelector() {
    const router = useRouter()
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    // Determine current language from URL
    const currentLanguageCode = pathname.split('/')[1] || 'en'
    const currentLanguage = languages.find(lang => lang.code === currentLanguageCode) || languages[0]

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setIsOpen(false)
        document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
    }, [])

    // Get the path without the language prefix
    const getPathWithoutLang = () => {
        const pathParts = pathname.split('/')
        // If the first segment is a valid language code, remove it
        if (languages.some(lang => lang.code === pathParts[1])) {
            return '/' + pathParts.slice(2).join('/')
        }
        // Otherwise return the current path (for the default language)
        return pathname
    }

    return (
        <div className="relative">
            <button
                className="flex items-center space-x-1 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                onClick={(e) => {
                    e.stopPropagation()
                    setIsOpen(!isOpen)
                }}
            >
                <span>{currentLanguage.flag}</span>
                <span className="hidden sm:inline">{currentLanguage.name}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {languages.map((language) => {
                        const path = language.code === "en"
                            ? getPathWithoutLang()
                            : `/${language.code}${getPathWithoutLang()}`

                        return (
                            <Link
                                key={language.code}
                                href={path}
                                className={`flex items-center space-x-2 px-4 py-2 text-sm ${
                                    currentLanguageCode === language.code
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700 hover:bg-gray-50"
                                }`}
                                onClick={() => setIsOpen(false)}
                            >
                                <span>{language.flag}</span>
                                <span>{language.name}</span>
                            </Link>
                        )
                    })}
                </div>
            )}
        </div>
    )
}