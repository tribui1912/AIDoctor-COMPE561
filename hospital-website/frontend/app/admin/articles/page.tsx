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
import { EditArticleDialog } from '@/components/admin/EditArticleDialog'
import { DeleteArticleDialog } from '@/components/admin/DeleteArticleDialog'
import { getCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'

interface Article {
  id: number
  title: string
  category: string
  status: string
  date: string
  summary: string
  content: string
  image_url: string
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const adminToken = getCookie('adminToken')
      if (!adminToken) {
        router.push('/admin/login')
        return
      }

      try {
        const response = await fetch('http://localhost:8000/api/admin/news', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${adminToken}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include'
        })

        if (response.status === 401) {
          router.push('/admin/login')
          return
        }

        if (!response.ok) {
          const errorData = await response.text()
          throw new Error(`Server error: ${response.status} ${errorData}`)
        }

        const data = await response.json()
        console.log('Articles response:', data)
        
        if (data && Array.isArray(data.items)) {
          setArticles(data.items)
        } else {
          throw new Error('Invalid response format')
        }
      } catch (fetchError) {
        if (fetchError instanceof TypeError && fetchError.message === 'Failed to fetch') {
          throw new Error('Unable to connect to the server. Please check if the server is running.')
        }
        throw fetchError
      }
    } catch (error) {
      console.error('Error fetching articles:', error)
      setError(error instanceof Error ? error.message : 'Failed to fetch articles')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="text-xl">Loading articles...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
        <Button onClick={fetchArticles}>Retry</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Articles Management</h1>
        <Button onClick={() => {
          setSelectedArticle(null)
          setIsEditOpen(true)
        }}>
          Create New Article
        </Button>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No articles found
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {articles.map((article) => (
              <TableRow key={article.id}>
                <TableCell>{article.title}</TableCell>
                <TableCell>{article.category}</TableCell>
                <TableCell>{article.status}</TableCell>
                <TableCell>{new Date(article.date).toLocaleDateString()}</TableCell>
                <TableCell className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedArticle(article)
                      setIsEditOpen(true)
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedArticle(article)
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
      )}

      <EditArticleDialog
        article={selectedArticle}
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        onSuccess={fetchArticles}
      />

      <DeleteArticleDialog
        article={selectedArticle}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onSuccess={fetchArticles}
      />
    </div>
  )
}