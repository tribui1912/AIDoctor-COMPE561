'use client'

import { useState, useEffect, useCallback } from 'react'
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
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const itemsPerPage = 10

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const adminToken = getCookie('adminToken')
      if (!adminToken) {
        router.push('/admin/login')
        return
      }

      const skip = (currentPage - 1) * itemsPerPage
      const response = await fetch(`http://34.220.228.30:30000/api/admin/news?skip=${skip}&limit=${itemsPerPage}`, {
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
      
      if (data && Array.isArray(data.items)) {
        setArticles(data.items)
        setTotalItems(data.total)
      } else {
        throw new Error('Invalid response format')
      }
    } catch (fetchError) {
      if (fetchError instanceof TypeError && fetchError.message === 'Failed to fetch') {
        setError('Unable to connect to the server. Please check if the server is running.')
      } else {
        setError(fetchError instanceof Error ? fetchError.message : String(fetchError))
      }
    } finally {
      setLoading(false)
    }
  }, [router, currentPage])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  useEffect(() => {
    const maxValidPage = Math.max(1, Math.ceil(totalItems / itemsPerPage))
    if (currentPage > maxValidPage) {
      setCurrentPage(1)
    }
  }, [totalItems, currentPage, itemsPerPage])

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

  const totalPages = Math.ceil(totalItems / itemsPerPage)

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

      {articles.length > 0 && (
        <div className="flex justify-center items-center space-x-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}