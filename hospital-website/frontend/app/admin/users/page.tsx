'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { EditUserDialog } from '@/components/admin/EditUserDialog'
import { DeleteUserDialog } from '@/components/admin/DeleteUserDialog'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'

interface AdminUser {
  id: number | string
  username: string
  email: string
  role: 'admin'
  status: string
  is_active: boolean
  permissions?: Record<string, string[]>
}

interface RegularUser {
  id: number | string
  name: string
  email: string
  role: 'user'
  status: string
  is_active: boolean
}

type User = AdminUser | RegularUser

export default function UsersPage() {
  const router = useRouter()
  const [admins, setAdmins] = useState<AdminUser[]>([])
  const [users, setUsers] = useState<RegularUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const adminToken = getCookie('adminToken')
      if (!adminToken) {
        router.push('/admin/login')
        return
      }

      const [usersResponse, adminsResponse] = await Promise.all([
        fetch('http://localhost:8000/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('http://localhost:8000/api/admin/admins', {
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          }
        })
      ])

      if (!usersResponse.ok || !adminsResponse.ok) {
        throw new Error('Failed to fetch users')
      }

      const usersData = await usersResponse.json()
      const adminsData = await adminsResponse.json()

      setUsers(usersData.filter((u: any) => u.role === 'user'))
      setAdmins(adminsData.filter((a: any) => a.role === 'admin'))
    } catch (error) {
      console.error('Error fetching users:', error)
      setError(error instanceof Error ? error.message : 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  if (loading) {
    return <div className="flex justify-center items-center h-48">Loading users... Please wait</div>
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        <p>Error: {error}</p>
        <button 
          onClick={fetchUsers}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <Button onClick={() => {
          setSelectedUser(null)
          setIsEditOpen(true)
        }}>
          Create New User
        </Button>
      </div>

      <div className="space-y-8">
        {/* Admins Table */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Administrators</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell>{admin.username}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.status}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(admin)
                        setIsEditOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(admin)
                        setIsDeleteOpen(true)
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Regular Users Table */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Regular Users</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell className="space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user)
                        setIsEditOpen(true)
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        setSelectedUser(user)
                        setIsDeleteOpen(true)
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <EditUserDialog
        user={selectedUser}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={fetchUsers}
      />

      <DeleteUserDialog
        user={selectedUser}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onSuccess={fetchUsers}
      />
    </div>
  )
}