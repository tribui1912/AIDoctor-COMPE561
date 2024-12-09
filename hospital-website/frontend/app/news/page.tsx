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

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export default function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch('http://108.215.168.9:30000/api/news', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          credentials: 'include'
        })

        if (!response.ok) {
          const errorData = await response.text()
          throw new Error(`Failed to fetch news: ${response.status} ${errorData}`)
        }

        const data = await response.json()
        setArticles(data)
      } catch (error) {
        console.error('Error fetching news:', error)
        setArticles([])
      }
    }

    fetchNews()
  }, [])

  const handleReadMore = async (id: number) => {
    try {
      const response = await fetch(`http://108.215.168.9:30000/api/news/${id}`)
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
          <Card 
            key={article.id} 
            className="bg-blue-600/10 border-blue-600/20 hover:bg-blue-600/20 
              transition-all duration-300 ease-in-out
              hover:border-blue-600/30 
              hover:shadow-lg hover:-translate-y-0.5
              hover:scale-[1.02]
              overflow-hidden rounded-lg"
          >
            <Image 
              src={article.image_url} 
              alt={article.title} 
              width={400} 
              height={200} 
              className="w-full h-48 object-cover" 
            />
            <CardHeader>
              <CardTitle className="text-blue-600 dark:text-blue-400">{article.title}</CardTitle>
              <CardDescription className="italic text-muted-foreground">
                {formatDate(article.date)} - {article.category}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-muted-foreground">{article.summary}</p>
              <Button 
                className="bg-blue-600/20 text-blue-600 dark:text-blue-400 hover:bg-blue-600/30 border border-blue-600/20" 
                onClick={() => handleReadMore(article.id)}
              >
                Read More
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent 
          className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto 
            fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]
            w-[90vw]
            bg-white dark:bg-slate-950 border border-blue-600/20
            shadow-lg"
        >
          <DialogHeader>
            <DialogTitle className="text-blue-600 dark:text-blue-400">
              {selectedArticle?.title}
            </DialogTitle>
            <DialogDescription className="italic text-muted-foreground">
              {formatDate(selectedArticle?.date || '')} - {selectedArticle?.category}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Image 
              src={selectedArticle?.image_url || ''} 
              alt={selectedArticle?.title || ''} 
              width={600} 
              height={300} 
              className="w-full h-64 object-cover mb-4 rounded-lg" 
            />
            <h3 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400">
              Full Article
            </h3>
            <p className="whitespace-pre-wrap text-foreground">
              {selectedArticle?.content}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
