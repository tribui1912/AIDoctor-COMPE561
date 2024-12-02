'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Users, 
  NewspaperIcon, 
  LayoutDashboard,
  LogOut 
} from 'lucide-react'

interface AdminSidebarProps {
  onLogout: () => void;
}

const AdminSidebar = ({ onLogout }: AdminSidebarProps) => {
  const pathname = usePathname()

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log('Logout clicked')
    onLogout()
  }

  const menuItems = [
    {
      title: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard
    },
    {
      title: 'Articles',
      href: '/admin/articles',
      icon: NewspaperIcon
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: Users
    }
  ]

  return (
    <div className="w-64 bg-white shadow-lg h-full flex flex-col">
      <div className="p-6 border-b">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>
      <nav className="flex-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
              pathname === item.href ? 'bg-gray-100' : ''
            }`}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.title}
          </Link>
        ))}
      </nav>
      <button
        onClick={handleLogoutClick}
        className="flex items-center px-6 py-4 text-gray-700 hover:bg-gray-100 w-full border-t"
      >
        <LogOut className="w-5 h-5 mr-3" />
        Logout
      </button>
    </div>
  )
}

export default AdminSidebar
