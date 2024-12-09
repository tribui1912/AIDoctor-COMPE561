import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { getCookie } from 'cookies-next'
  
  interface Article {
    id: number;
    title: string;
  }
  
  interface DeleteArticleDialogProps {
    article: Article | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
  }
  
  export function DeleteArticleDialog({ article, open, onOpenChange, onSuccess }: DeleteArticleDialogProps) {
    const handleDelete = async () => {
      try {
        const adminToken = getCookie('adminToken')
        if (!adminToken) {
          console.error('No admin token found')
          return
        }

        const response = await fetch(`http://localhost:8000/api/admin/news/${article?.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        })
  
        if (response.ok) {
          onSuccess()
          onOpenChange(false)
        } else {
          const errorData = await response.text()
          console.error('Failed to delete article:', response.status, errorData)
          
          if (response.status === 404) {
            alert('Article not found. It may have been already deleted.')
            onSuccess() // Refresh the list anyway
            onOpenChange(false)
          } else if (response.status === 403) {
            alert('You do not have permission to delete this article.')
          } else {
            alert('Failed to delete article. Please try again.')
          }
        }
      } catch (error) {
        console.error('Error deleting article:', error)
        alert('An error occurred while deleting the article.')
      }
    }
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Delete Article</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{article?.title}"? This action cannot be undone.
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