"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/app/language-provider"

// Define available languages with their display names
export const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "fr", name: "Français", flag: "🇫🇷" },
    { code: "ar", name: "العربية", flag: "🇦🇪" },
    { code: "pt", name: "Português", flag: "🇧🇷" },
]

// Helper function to get language codes (can be imported by server components)
export const getSupportedLanguageCodes = () => languages.map(lang => lang.code)

export default function LanguageSelector() {
    const pathname = usePathname()
    const { currentLang, pathWithoutLang, localizedPath } = useLanguage()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    // Get current language object
    const currentLanguage = languages.find(lang => lang.code === currentLang) || languages[0]

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Force a hard navigation for language change to ensure full page reload
    const handleLanguageChange = (path: string) => {
        console.log("Changing language to path:", path)
        window.location.href = path
        setIsOpen(false)
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="flex items-center space-x-1 rounded-md px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-haspopup="true"
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
                <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                    {languages.map((language) => {
                        // Generate the correct path for this language
                        const path = language.code === 'en'
                            ? pathWithoutLang === '/' ? '/' : pathWithoutLang
                            : `/${language.code}${pathWithoutLang === '/' ? '' : pathWithoutLang}`

                        return (
                            <Link
                                key={language.code}
                                href={path}
                                className={`flex items-center space-x-2 px-4 py-2 text-sm ${
                                    currentLang === language.code
                                        ? "bg-gray-100 text-gray-900"
                                        : "text-gray-700 hover:bg-gray-50"
                                }`}
                                onClick={() => handleLanguageChange(path)}
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