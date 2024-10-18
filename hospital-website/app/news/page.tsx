'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import Image from 'next/image'

type NewsArticle = {
  id: number;
  title: string;
  date: string;
  summary: string;
  category: string;
  content: string;
  image_url: string;  // New field
}

export default function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/news')
        if (!response.ok) {
          throw new Error('Failed to fetch news')
        }
        const data = await response.json()
        setArticles(data)
      } catch (error) {
        console.error('Error fetching news:', error)
      }
    }

    fetchNews()
  }, [])

  const handleReadMore = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/news/${id}`)
      if (!response.ok) {
        throw new Error('Failed to fetch article details')
      }
      const data = await response.json()
      setSelectedArticle(data)
      setIsModalOpen(true)
    } catch (error) {
      console.error('Error fetching article details:', error)
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Hospital News</h1>
      <p className="text-xl">Stay updated with the latest news and events from City General Hospital.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card key={article.id} className="shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden rounded-t-lg">
            <Image src={article.image_url} alt={article.title} width={400} height={200} className="w-full h-48 object-cover" />
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
              <CardDescription className="italic">{article.date} - {article.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{article.summary}</p>
              <Button className="bg-blue-200 text-black hover:bg-blue-300" onClick={() => handleReadMore(article.id)}>Read More</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedArticle?.title}</DialogTitle>
            <DialogDescription className="italic">
              {selectedArticle?.date} - {selectedArticle?.category}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Image src={selectedArticle?.image_url || ''} alt={selectedArticle?.title || ''} width={600} height={300} className="w-full h-64 object-cover mb-4" />
            <h3 className="text-lg font-semibold mb-2">Full Article</h3>
            <p className="whitespace-pre-wrap">{selectedArticle?.content}</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
