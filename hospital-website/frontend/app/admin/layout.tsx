'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/admin/AdminSideBar'
import { getCookie, deleteCookie } from 'cookies-next'
import { usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const adminToken = getCookie('adminToken')
    if (!adminToken && pathname !== '/admin/login') {
      console.log('No admin token found, redirecting to login')
      router.push('/admin/login')
    } else {
      setIsAuthenticated(true)
    }
  }, [router, pathname])

  const handleLogout = async () => {
    console.log('handleLogout called')
    try {
      const refreshToken = getCookie('adminRefreshToken')
      console.log('refreshToken:', refreshToken ? 'exists' : 'not found')
      
      if (refreshToken) {
        const response = await fetch('http://127.0.0.1:8000/api/admin/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('adminToken')}`
          },
          body: JSON.stringify({
            refresh_token: refreshToken
          })
        })
        
        if (!response.ok) {
          throw new Error(`Logout failed: ${await response.text()}`)
        }
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      console.log('Clearing cookies and redirecting')
      deleteCookie('adminToken')
      deleteCookie('adminRefreshToken')
      router.push('/admin/login')
    }
  }

  // If we're on the login page, just render children
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    )
  }

  // Show nothing if not authenticated (redirect will happen in useEffect)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar onLogout={handleLogout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold">Admin Dashboard</h1>
              </div>
            </div>
          </div>
        </nav>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}