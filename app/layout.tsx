import React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { headers } from "next/headers"

const inter = Inter({ subsets: ["latin"] })

// Define supported languages directly here
const supportedLanguages = ['en', 'fr', 'ar', 'pt']

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    // Get the current URL path from headers
    const headersList = headers()
    const pathname = headersList.get("x-pathname") || "/"

    // Extract language code from URL
    const langSegment = pathname.split('/')[1]
    const isValidLang = supportedLanguages.includes(langSegment)
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