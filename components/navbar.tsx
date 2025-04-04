"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Logo from "./logo"
import LanguageSelector from "./language-selector"
import { useLanguage } from "@/app/language-provider"

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const { t, currentLang, localizedPath } = useLanguage()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Log current language for debugging
  useEffect(() => {
    console.log('Navbar - Current language:', currentLang)
  }, [currentLang])

  const navLinks = [
    { name: t('home'), href: localizedPath('/') },
    { name: t('training'), href: localizedPath('/training') },
    { name: t('media'), href: localizedPath('/media') },
    { name: t('partnership'), href: localizedPath('/partnership') },
    { name: t('support'), href: localizedPath('/support') },
  ]

  return (
      <nav
          className={`sticky top-0 z-50 w-full transition-all duration-300 ${
              isScrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-sm"
          }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link href={localizedPath('/')} className="flex items-center">
                <Logo />
              </Link>
            </div>

            {/* Desktop navigation */}
            <div className="hidden md:flex md:items-center">
              <div className="flex items-center space-x-4">
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                            pathname === link.href
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                    >
                      {link.name}
                    </Link>
                ))}
                <div className="ml-2 border-l border-gray-200 pl-4">
                  <LanguageSelector />
                </div>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center md:hidden">
              <LanguageSelector />
              <button
                  type="button"
                  className="ml-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                    <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                ) : (
                    <svg
                        className="h-6 w-6"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
            <div className="md:hidden" id="mobile-menu">
              <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={`block rounded-md px-3 py-2 text-base font-medium ${
                            pathname === link.href
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                ))}
              </div>
            </div>
        )}
      </nav>
  )
}