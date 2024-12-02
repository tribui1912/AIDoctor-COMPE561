import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getCookie } from 'cookies-next'

export function EditUserDialog({ 
  user, 
  open, 
  onOpenChange, 
  onSuccess,
  isAddingAdmin = false 
}: { 
  user: any, 
  open: boolean, 
  onOpenChange: (open: boolean) => void, 
  onSuccess: () => void,
  isAddingAdmin?: boolean
}) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });

  // Determine if we're dealing with an admin
  const isAdmin = user ? Boolean(user?.username) : isAddingAdmin;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = getCookie('adminToken');
      if (!token) {
        throw new Error('No admin token found');
      }

      let submitData;
      
      if (user) {
        // Updating existing user/admin
        submitData = isAdmin ? {
          ...(formData.name && { username: formData.name }),
          ...(formData.email && { email: formData.email }),
          ...(formData.password && { password: formData.password })
        } : {
          ...(formData.name && { name: formData.name }),
          ...(formData.email && { email: formData.email }),
          ...(formData.password && { password: formData.password })
        };
      } else {
        // Creating new user/admin
        if (!formData.name || !formData.email || !formData.password) {
          throw new Error('Please fill in all required fields');
        }
        
        submitData = isAdmin ? {
          username: formData.name,
          email: formData.email,
          password: formData.password,
          permissions: {
            news: ['create', 'read', 'update', 'delete'],
            appointments: ['create', 'read', 'update', 'delete'],
            users: ['read', 'update', 'delete']
          }
        } : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'user',
          status: 'active'
        };
      }

      // Don't send empty update
      if (Object.keys(submitData).length === 0) {
        throw new Error('No changes to update');
      }

      const baseEndpoint = `http://localhost:8000/api/admin/${isAdmin ? 'admins' : 'users'}`;
      const endpoint = user ? `${baseEndpoint}/${user.id}` : baseEndpoint;
      const method = user ? 'PATCH' : 'POST';

      console.log('Sending request:', {
        endpoint,
        method,
        data: submitData
      });

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Operation failed');
      }

      console.log('Operation successful:', data);
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error('Error:', error);
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {user ? `Edit ${isAdmin ? 'Admin' : 'User'}` : `Add New ${isAdmin ? 'Admin' : 'User'}`}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{isAdmin ? 'Username' : 'Name'}</Label>
              <Input
                id="name"
                placeholder={isAdmin ? user?.username : user?.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder={user?.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                {user ? 'New Password (leave empty to keep current)' : 'Password'}
              </Label>
              <Input
                id="password"
                type="password"
                placeholder={user ? '••••••••' : 'Enter password'}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {user ? 'Save Changes' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}