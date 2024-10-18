'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

type NewsArticle = {
  id: number;
  title: string;
  date: string;
  summary: string;
  category: string;
}

export default function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([])

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

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Hospital News</h1>
      <p className="text-xl">Stay updated with the latest news and events from City General Hospital.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <Card key={article.id}>
            <CardHeader>
              <CardTitle>{article.title}</CardTitle>
              <CardDescription>{article.date} - {article.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{article.summary}</p>
              <Button className="mt-4">Read More</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
