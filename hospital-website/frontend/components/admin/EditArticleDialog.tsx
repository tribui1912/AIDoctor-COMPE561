import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from '@/components/ui/dialog'
  import { Button } from '@/components/ui/button'
  import { Input } from '@/components/ui/input'
  import { Label } from '@/components/ui/label'
  import { useState, useEffect } from 'react'
  import { Textarea } from '@/components/ui/textarea'
  import { getCookie } from 'cookies-next'
  
  interface Article {
    id?: number;
    title: string;
    summary: string;
    content: string;
    category: string;
    status: string;
    image_url: string;
  }
  
  interface EditArticleDialogProps {
    article: Article | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
  }
  
  export function EditArticleDialog({ article, open, onOpenChange, onSuccess }: EditArticleDialogProps) {
    const [formData, setFormData] = useState<Partial<Article>>({
      title: article?.title || '',
      summary: article?.summary || '',
      content: article?.content || '',
      category: article?.category || '',
      status: article?.status || 'draft',
      image_url: article?.image_url || ''
    })
  
    useEffect(() => {
      setFormData({
        title: article?.title || '',
        summary: article?.summary || '',
        content: article?.content || '',
        category: article?.category || '',
        status: article?.status || 'draft',
        image_url: article?.image_url || ''
      })
    }, [article])
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      try {
        const token = getCookie('adminToken');
        if (!token) {
          throw new Error('No admin token found');
        }

        const endpoint = `http://localhost:8000/api/admin/news/${article?.id}`;
        
        const response = await fetch(endpoint, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Failed to update article');
        }

        onSuccess();
        onOpenChange(false);
      } catch (error) {
        console.error('Error updating article:', error);
        alert(error instanceof Error ? error.message : 'An error occurred');
      }
    };
  
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {article ? 'Edit Article' : 'Create New Article'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>
  
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              />
            </div>
  
            <div>
              <Label htmlFor="summary">Summary</Label>
              <Textarea
                id="summary"
                value={formData.summary}
                onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                required
              />
            </div>
  
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="h-32"
                required
              />
            </div>
  
            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                required
              />
            </div>
  
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
  
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {article ? 'Save Changes' : 'Create Article'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    )
  }