import Link from 'next/link'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'City General Hospital',
  description: 'Providing quality healthcare for our community',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <header className="bg-blue-200 text-black sticky top-0 z-50">
          <nav className="container mx-auto px-4 py-4">
            <ul className="flex flex-wrap justify-between items-center">
              <li><Link href="/" className="text-2xl font-bold">City General Hospital</Link></li>
              <li><Link href="/about">About</Link></li>
              <li><Link href="/doctors-services">Doctors & Services</Link></li>
              <li><Link href="/patients-visitors">Patients & Visitors</Link></li>
              <li><Link href="/location">Locations</Link></li>
              <li><Link href="/news">News</Link></li>
              <li><Link href="/contact">Contact</Link></li>
              <li><Link href="/ask" className="bg-white text-black px-4 py-2 rounded">Ask</Link></li>
            </ul>
          </nav>
        </header>
        <main className="container mx-auto px-4 py-8 flex-grow">
          {children}
        </main>
        <footer className="bg-gray-200 text-black text-center py-4">
          <p>&copy; 2024 City General Hospital. All rights reserved.</p>
        </footer>
      </body>
    </html>
  )
}