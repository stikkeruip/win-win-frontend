'use client'

import React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { usePathname } from "next/navigation"
import { languages } from "@/components/language-selector"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  
  // Extract language code from URL
  const langSegment = pathname.split('/')[1]
  const isValidLang = languages.some(lang => lang.code === langSegment)
  const currentLang = isValidLang ? langSegment : 'en'
  
  // Set direction based on language
  const direction = currentLang === 'ar' ? 'rtl' : 'ltr'

  return (
    <html lang={currentLang} dir={direction}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
