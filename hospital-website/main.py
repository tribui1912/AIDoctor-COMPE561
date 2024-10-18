from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import sqlite3
from datetime import datetime

app = FastAPI()

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Add your frontend URL here
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database setup
conn = sqlite3.connect('news.db')
cursor = conn.cursor()
cursor.execute('''
    CREATE TABLE IF NOT EXISTS news_articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        date TEXT NOT NULL,
        summary TEXT NOT NULL,
        category TEXT NOT NULL
    )
''')
conn.commit()

class NewsArticle(BaseModel):
    id: int
    title: str
    date: str
    summary: str
    category: str

@app.get("/api/news", response_model=List[NewsArticle])
async def get_news():
    cursor.execute("SELECT * FROM news_articles ORDER BY date DESC LIMIT 6")
    articles = cursor.fetchall()
    return [
        NewsArticle(id=row[0], title=row[1], date=row[2], summary=row[3], category=row[4])
        for row in articles
    ]

# Add some sample data (you can remove this later)
sample_articles = [
    ("New Cancer Treatment Shows Promise", "2023-05-01", "A groundbreaking study reveals a new treatment method for various types of cancer, showing significant improvements in patient outcomes.", "Medical Research"),
    ("Hospital Expands Emergency Department", "2023-04-28", "The hospital's emergency department expansion project is complete, increasing capacity and reducing wait times for patients.", "Hospital Updates"),
    ("Local Doctor Receives National Award", "2023-04-25", "Dr. Jane Smith has been recognized nationally for her contributions to cardiovascular research and patient care.", "Staff Spotlight"),
]

for article in sample_articles:
    cursor.execute("INSERT INTO news_articles (title, date, summary, category) VALUES (?, ?, ?, ?)", article)
conn.commit()
