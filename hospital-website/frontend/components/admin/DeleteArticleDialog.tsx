import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
  } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  
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
        const response = await fetch(`http://localhost:8000/api/admin/news/${article?.id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        })
  
        if (response.ok) {
          onSuccess()
          onOpenChange(false)
        }
      } catch (error) {
        console.error('Error deleting article:', error)
      }
    }
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
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