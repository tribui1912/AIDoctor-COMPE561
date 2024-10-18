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
        category TEXT NOT NULL,
        content TEXT NOT NULL,
        image_url TEXT NOT NULL
    )
''')
conn.commit()

class NewsArticle(BaseModel):
    id: int | None
    title: str
    date: str
    summary: str
    category: str
    content: str
    image_url: str  # New field

class NewsArticleCreate(BaseModel):
    title: str
    date: str
    summary: str
    category: str
    content: str
    image_url: str  # New field

# Sample data
# Remove """""" to insert sample data for the first run
"""
sample_articles = [
    {
        "title": "New Patient Rooms Unveiled in Hospital Expansion",
        "date": "2023-05-15",
        "summary": "City General Hospital opens state-of-the-art patient rooms as part of its recent expansion project.",
        "category": "Hospital Updates",
        "content": "City General Hospital has completed its ambitious expansion project, unveiling 50 new patient rooms equipped with the latest medical technology. The rooms feature adjustable smart beds, integrated vital sign monitors, and large windows for natural light. 'These new rooms will significantly improve patient comfort and recovery times,' said Dr. Emily Johnson, Chief of Medicine. The expansion also includes family areas and nurse stations designed for optimal patient care and family support.",
        "image_url": "https://www.hopkinsmedicine.org/-/media/patient-care/images/patient-rooms-1.jpg"
    },
    {
        "title": "Breakthrough in Alzheimer's Research",
        "date": "2023-05-10",
        "summary": "Local researchers make significant progress in understanding Alzheimer's disease mechanisms.",
        "category": "Medical Research",
        "content": "A team of researchers at City General Hospital has made a groundbreaking discovery in Alzheimer's research. Using advanced imaging techniques, they've identified a new protein interaction that appears to be key in the progression of the disease. Dr. Michael Lee, lead researcher, stated, 'This finding could open up new avenues for treatment and potentially lead to earlier diagnosis.' The study, published in the Journal of Neuroscience, is already generating excitement in the medical community and hope for millions affected by Alzheimer's worldwide.",
        "image_url": "https://th-thumbnailer.cdn-si-edu.com/F6MN7vfNd8zeHpNYi58PzoC_OAo=/1000x750/filters:no_upscale()/https://tf-cmsv2-smithsonianmag-media.s3.amazonaws.com/filer/b4/c6/b4c65fd0-01ba-4262-9b3d-f16b53bca617/istock-172463472.jpg"
    },
    {
        "title": "Hospital Implements New Emergency Response System",
        "date": "2023-05-05",
        "summary": "City General Hospital adopts cutting-edge technology to improve emergency response times.",
        "category": "Technology",
        "content": "City General Hospital has implemented a new state-of-the-art emergency response system, aimed at reducing response times and improving patient outcomes. The system uses AI-powered algorithms to optimize resource allocation and staff deployment during emergencies. 'In critical situations, every second counts,' explained Sarah Thompson, Head of Emergency Services. 'This new system will help us save more lives by ensuring the right resources reach patients faster.' Initial tests show a 20% reduction in response times, setting a new standard for emergency care in the region.",
        "image_url": "https://calhospital.org/wp-content/uploads/2022/08/Hospital-Council-Did-You-Know-August.jpg"
    },
    {
        "title": "Hospital Launches Innovative Patient Care Program",
        "date": "2023-04-30",
        "summary": "New holistic approach to patient care shows promising results in pilot program.",
        "category": "Patient Care",
        "content": "City General Hospital has launched an innovative patient care program that takes a holistic approach to healing. The program, named 'Whole Person Care', integrates traditional medical treatments with nutrition, physical therapy, and mental health support. Dr. Lisa Chen, program director, explained, 'We're treating not just the illness, but the whole person.' Early results from the pilot program show improved recovery times and higher patient satisfaction scores. The hospital plans to expand the program to all departments over the next year.",
        "image_url": "https://qmedcenter.com/wp-content/uploads/2023/02/Vector-doctor-examining-a-patient-at-the-clinic-portraying-20-qualities-that-make-a-good-doctor.webp"
    },
    {
        "title": "Hospital Celebrates Diversity in Medicine",
        "date": "2023-04-25",
        "summary": "City General Hospital hosts event to promote diversity and inclusion in healthcare professions.",
        "category": "Community",
        "content": "City General Hospital hosted its first 'Diversity in Medicine' event, celebrating the contributions of minority healthcare professionals and encouraging diversity in medical careers. The event featured talks from prominent minority doctors, nurses, and researchers, as well as interactive sessions for high school students interested in healthcare careers. Dr. James Wilson, Chief of Staff, stated, 'Diversity in healthcare is crucial for providing the best care to our diverse community. We're committed to fostering an inclusive environment and inspiring the next generation of healthcare professionals.'",
        "image_url": "https://hips.hearstapps.com/hmg-prod/images/types-of-doctors-1600114658.jpg"
    },
    {
        "title": "New Telemedicine Services Launched",
        "date": "2023-04-20",
        "summary": "City General Hospital expands access to healthcare with new telemedicine options.",
        "category": "Services",
        "content": "City General Hospital has launched a comprehensive telemedicine service, allowing patients to consult with doctors and specialists from the comfort of their homes. The service includes video consultations, remote monitoring for chronic conditions, and digital prescription services. 'This initiative will greatly improve access to healthcare, especially for those with mobility issues or in remote areas,' said Dr. Robert Brown, Head of Digital Health. The hospital has also provided training to staff and patients to ensure smooth adoption of the new technology. Initial feedback has been overwhelmingly positive, with patients appreciating the convenience and reduced wait times.",
        "image_url": "https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg"
    }
]

# Function to insert sample data
def insert_sample_data():
    for article in sample_articles:
        cursor.execute('''
            INSERT INTO news_articles (title, date, summary, category, content, image_url)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (article['title'], article['date'], article['summary'], article['category'], article['content'], article['image_url']))
    conn.commit()
    print("Sample data inserted successfully.")

# Call this function after creating the table
insert_sample_data()
"""


@app.get("/api/news", response_model=List[NewsArticle])
async def get_news():
    cursor.execute("""
        SELECT id, title, date, summary, category, image_url 
        FROM news_articles 
        ORDER BY date DESC, id DESC 
        LIMIT 6
    """)
    articles = cursor.fetchall()
    return [
        NewsArticle(id=row[0], title=row[1], date=row[2], summary=row[3], category=row[4], image_url=row[5], content="")
        for row in articles
    ]

@app.get("/api/news/{article_id}", response_model=NewsArticle)
async def get_news_article(article_id: int):
    cursor.execute("SELECT * FROM news_articles WHERE id = ?", (article_id,))
    article = cursor.fetchone()
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return NewsArticle(id=article[0], title=article[1], date=article[2], summary=article[3], 
                       category=article[4], content=article[5], image_url=article[6])

@app.post("/api/news", response_model=NewsArticle)
async def create_news_article(article: NewsArticleCreate):
    cursor.execute(
        "INSERT INTO news_articles (title, date, summary, category, content, image_url) VALUES (?, ?, ?, ?, ?, ?)",
        (article.title, article.date, article.summary, article.category, article.content, article.image_url)
    )
    conn.commit()
    new_id = cursor.lastrowid
    return NewsArticle(id=new_id, **article.dict())

@app.put("/api/news/{article_id}", response_model=NewsArticle)
async def update_news_article(article_id: int, article: NewsArticleCreate):
    cursor.execute(
        "UPDATE news_articles SET title = ?, date = ?, summary = ?, category = ?, content = ?, image_url = ? WHERE id = ?",
        (article.title, article.date, article.summary, article.category, article.content, article.image_url, article_id)
    )
    conn.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return NewsArticle(id=article_id, **article.dict())

@app.delete("/api/news/{article_id}")
async def delete_news_article(article_id: int):
    cursor.execute("DELETE FROM news_articles WHERE id = ?", (article_id,))
    conn.commit()
    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Article not found")
    return {"success": True}
