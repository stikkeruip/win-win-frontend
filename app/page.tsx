'use client'

import Link from "next/link"
import Image from "next/image"
import { useLanguage } from './language-provider'
import { useEffect } from 'react'

export default function Home() {
  const { t, localizedPath, currentLang } = useLanguage()

  // Debug logging
  useEffect(() => {
    console.log('Home page - Current language:', currentLang)
    console.log('Home page - welcomeTitle translation:', t('welcomeTitle'))
  }, [currentLang, t])

  return (
      <div className="relative overflow-hidden bg-white">
        {/* Background decoration */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-orange-100 opacity-50"></div>
          <div className="absolute top-1/2 -left-24 h-64 w-64 rounded-full bg-blue-100 opacity-50"></div>
          <div className="absolute bottom-12 right-1/3 h-48 w-48 rounded-full bg-orange-50 opacity-30"></div>
        </div>

        <div className="relative z-10">
          {/* Hero Section */}
          <section className="px-6 py-16 md:py-24 lg:py-32">
            <div className="mx-auto max-w-7xl">
              <div className="grid items-center gap-12 lg:grid-cols-2">
                <div className="flex flex-col space-y-8">
                  <div className="space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                      {t('welcomeTitle')}
                    </h1>
                    <p className="text-lg text-gray-600 md:text-xl">
                      {t('welcomeSubtitle')}
                    </p>
                    <p className="text-lg text-gray-600 md:text-xl">
                      {t('welcomeDescription')}
                    </p>
                  </div>

                  <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <Link
                        href={localizedPath('/training')}
                        className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#FFA94D] to-[#FF8A3D] px-6 py-3 text-lg font-medium text-white shadow-md transition-all hover:from-[#FF8A3D] hover:to-[#FF7A2D] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2"
                    >
                      {t('startTraining')}
                    </Link>
                    <Link
                        href={localizedPath('/about')}
                        className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-6 py-3 text-lg font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-50 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                    >
                      {t('learnMore')}
                    </Link>
                  </div>

                  {/* Callouts */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-orange-50 p-4">
                      <div className="font-bold text-orange-600">{t('resources')}</div>
                      <div className="text-sm text-gray-600">{t('comprehensive')}</div>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-4">
                      <div className="font-bold text-blue-600">{t('culturallyInclusive')}</div>
                      <div className="text-sm text-gray-600">{t('globalLearners')}</div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Image
                      src="/placeholder.svg?height=400&width=400"
                      alt="Students learning together"
                      width={400}
                      height={400}
                      className="rounded-lg"
                      priority
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="bg-gray-50 px-6 py-16">
            <div className="mx-auto max-w-7xl">
              <div className="mb-12 text-center">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t('whyChooseWinWin')}</h2>
                <p className="mt-4 text-lg text-gray-600">{t('platformDesigned')}</p>
              </div>

              <div className="grid gap-8 md:grid-cols-3">
                <div className="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
                  <div className="mb-4 inline-block rounded-full bg-orange-100 p-3 text-orange-600">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{t('multilingualContent')}</h3>
                  <p className="text-gray-600">{t('multilingualDescription')}</p>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
                  <div className="mb-4 inline-block rounded-full bg-blue-100 p-3 text-blue-600">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{t('structuredLearning')}</h3>
                  <p className="text-gray-600">{t('structuredDescription')}</p>
                </div>

                <div className="rounded-lg bg-white p-6 shadow-md transition-all hover:shadow-lg">
                  <div className="mb-4 inline-block rounded-full bg-orange-100 p-3 text-orange-600">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                      <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">{t('communitySupport')}</h3>
                  <p className="text-gray-600">{t('communityDescription')}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
  )
}