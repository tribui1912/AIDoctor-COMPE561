'use client'

import Link from 'next/link'
import { Inter } from 'next/font/google'
import { usePathname } from 'next/navigation'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { ThemeToggle } from '@/components/theme-toggle'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  if (isAdminRoute) {
    return (
      <html lang="en">
        <head>
          <title>Admin Dashboard - City General Hospital</title>
        </head>
        <body className={inter.className}>
          {children}
        </body>
      </html>
    )
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>City General Hospital</title>
      </head>
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <header className="sticky top-0 z-50 w-full border-b 
            bg-white/80 dark:bg-slate-950/80 backdrop-blur-md 
            shadow-sm">
            <nav className="container mx-auto px-6 py-4">
              <div className="flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400 hover:opacity-80 transition-opacity">
                  City General Hospital
                </Link>
                <div className="hidden md:flex items-center gap-6">
                  <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link>
                  <Link href="/doctors-services" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Doctors & Services</Link>
                  <Link href="/patients-visitors" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Patients & Visitors</Link>
                  <Link href="/location" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Locations</Link>
                  <Link href="/news" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">News</Link>
                  <Link href="/contact" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link>
                  <ThemeToggle />
                </div>
                <div className="md:hidden flex items-center gap-4">
                  <ThemeToggle />
                  <button
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-2 text-gray-600 dark:text-gray-300"
                  >
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
                        d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                      />
                    </svg>
                  </button>
                </div>
              </div>
              {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white dark:bg-slate-950 border-b shadow-lg py-4 px-6 space-y-4">
                  <Link href="/about" className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors">About</Link>
                  <Link href="/doctors-services" className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Doctors & Services</Link>
                  <Link href="/patients-visitors" className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Patients & Visitors</Link>
                  <Link href="/location" className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Locations</Link>
                  <Link href="/news" className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors">News</Link>
                  <Link href="/contact" className="block hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact</Link>
                </div>
              )}
            </nav>
          </header>
          <main className="flex-grow relative">
            <div className="absolute inset-0 z-0">
              <div className="absolute inset-0 bg-[linear-gradient(120deg,#e0f2fe,#f0f9ff)] dark:bg-[linear-gradient(120deg,#0f172a,#1e293b)] opacity-70"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,#ffffff,transparent)] dark:bg-[radial-gradient(ellipse_at_top,#334155,transparent)] opacity-40"></div>
              <div className="absolute inset-0 dark:bg-[radial-gradient(ellipse_at_bottom_right,#334155,transparent)] opacity-40"></div>
            </div>
            <div className="relative z-10 container mx-auto px-6 py-8">
              <div className="bg-background/80 backdrop-blur-sm rounded-lg border border-blue-600/20 shadow-sm p-6 min-h-[calc(100vh-16rem)]">
                {children}
              </div>
            </div>
          </main>
          <footer className="border-t bg-white/80 dark:bg-slate-950/80 backdrop-blur-md shadow-sm">
            <div className="container mx-auto px-6 py-4 text-center">
              <p className="text-muted-foreground">&copy; 2024 City General Hospital. All rights reserved.</p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}