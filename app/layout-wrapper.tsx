'use client'
// app/layout-wrapper.tsx

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { LanguageProvider } from "./language-provider"

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    return (
        <LanguageProvider>
            <Navbar />
            <main>{children}</main>
            <Footer />
        </LanguageProvider>
    )
}