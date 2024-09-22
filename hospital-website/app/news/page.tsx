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

const categories = ['Health Tips', 'Hospital Updates', 'Medical Research', 'Community Outreach', 'Staff Spotlight']

function generateRandomArticle(id: number): NewsArticle {
  const titles = [
    'New Cancer Treatment Shows Promise',
    'Hospital Expands Emergency Department',
    'Local Doctor Receives National Award',
    'Breakthrough in Alzheimer\'s Research',
    'Community Health Fair Announced',
    'Hospital Implements New Patient Care System',
    'Study Reveals Benefits of Mediterranean Diet',
    'New Pediatric Wing Opens Next Month',
    'Hospital Launches Telemedicine Program',
    'Volunteer Program Reaches Milestone'
  ]

  const summaries = [
    'A groundbreaking study reveals a new treatment method for various types of cancer, showing significant improvements in patient outcomes.',
    'The hospital\'s emergency department expansion project is complete, increasing capacity and reducing wait times for patients.',
    'Dr. Jane Smith has been recognized nationally for her contributions to cardiovascular research and patient care.',
    'Researchers at our hospital have made a significant discovery that could lead to early detection of Alzheimer\'s disease.',
    'Join us for our annual Community Health Fair, featuring free health screenings, educational workshops, and family-friendly activities.',
    'Our hospital has implemented a state-of-the-art patient care system to improve efficiency and enhance the quality of care.',
    'A recent study conducted by our nutrition department highlights the numerous health benefits of following a Mediterranean diet.',
    'The new pediatric wing, featuring state-of-the-art facilities and a child-friendly environment, will open its doors next month.',
    'Our new telemedicine program allows patients to consult with specialists remotely, improving access to care for rural communities.',
    'The hospital\'s volunteer program has reached a milestone of 100,000 hours of service, making a significant impact on patient care and community support.'
  ]

  const randomDate = new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)

  return {
    id,
    title: titles[Math.floor(Math.random() * titles.length)],
    date: randomDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    summary: summaries[Math.floor(Math.random() * summaries.length)],
    category: categories[Math.floor(Math.random() * categories.length)]
  }
}

export default function News() {
  const [articles, setArticles] = useState<NewsArticle[]>([])

  useEffect(() => {
    const generatedArticles = Array.from({ length: 6 }, (_, i) => generateRandomArticle(i + 1))
    setArticles(generatedArticles)
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