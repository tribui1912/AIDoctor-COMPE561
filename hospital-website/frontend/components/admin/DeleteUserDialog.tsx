import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { getCookie } from 'cookies-next';
  
  export function DeleteUserDialog({ user, open, onOpenChange, onSuccess }: { user: any, open: boolean, onOpenChange: (open: boolean) => void, onSuccess: () => void }  ) {
    const handleDelete = async () => {
      try {
        const token = getCookie('adminToken');
        if (!token) {
          console.error('No admin token found');
          return;
        }
  
        const endpoint = user.role === 'admin' 
          ? `http://localhost:8000/api/admin/admins/${user.id}`
          : `http://localhost:8000/api/admin/users/${user.id}`;
  
        const response = await fetch(endpoint, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (response.ok) {
          onSuccess();
          onOpenChange(false);
        } else {
          console.error('Failed to delete user:', await response.text());
        }
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {user?.name}? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }