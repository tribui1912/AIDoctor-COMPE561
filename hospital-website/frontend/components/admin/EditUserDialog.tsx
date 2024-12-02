import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getCookie } from 'cookies-next'

export function EditUserDialog({ user, open, onOpenChange, onSuccess }: { user: any, open: boolean, onOpenChange: (open: boolean) => void, onSuccess: () => void }) {
  const [formData, setFormData] = useState(user || {
    name: '',
    email: '',
    password: '',
    is_active: true
  })

  const handleSubmit = async (isAdmin: boolean) => {
    try {
      const token = getCookie('adminToken');
      if (!token) {
        throw new Error('No admin token found');
      }

      // Base data that's common for both types
      const baseData = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      // For admin users, transform the data to match AdminCreate schema
      const submitData = isAdmin ? {
        username: formData.name,  // Admin uses username instead of name
        email: formData.email,
        password: formData.password,
        permissions: {
          news: ['create', 'read', 'update', 'delete'],
          appointments: ['create', 'read', 'update', 'delete'],
          users: ['read', 'update', 'delete']
        }
      } : baseData;  // For regular users, just use the base data

      // Use different endpoints for admin and user creation
      const endpoint = isAdmin 
        ? 'http://localhost:8000/api/admin/admins'
        : 'http://localhost:8000/api/admin/users';

      console.log('Submitting data:', submitData);

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.message || errorData.detail || 'Failed to save user');
      }

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving user:', error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {user ? 'Edit User' : 'Create New User'}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {!user && (
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {!user && (
              <>
                <Button onClick={() => handleSubmit(false)} variant="secondary">
                  Create User
                </Button>
                <Button onClick={() => handleSubmit(true)} variant="default">
                  Create Admin
                </Button>
              </>
            )}
            {user && (
              <Button onClick={() => handleSubmit(false)}>
                Update
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}