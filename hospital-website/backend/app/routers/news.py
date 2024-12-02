from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional  # Add this import
from .. import crud, schemas
from ..database import get_db
from ..models import NewsArticle

router = APIRouter(prefix="/api/news")

@router.get("/", response_model=List[schemas.PublicNewsArticle])
def read_news(skip: int = 0, limit: int = 6, db: Session = Depends(get_db)):
    # Get only published articles, sorted by date in descending order
    articles = db.query(NewsArticle)\
        .filter(NewsArticle.status == "published")\
        .order_by(NewsArticle.date.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    # Convert SQLAlchemy models to dictionaries
    articles_list = [
        {
            "id": article.id,
            "title": article.title,
            "summary": article.summary,
            "content": article.content,
            "category": article.category,
            "image_url": article.image_url,
            "date": article.date
        }
        for article in articles
    ]
    
    return articles_list

@router.get("/{article_id}", response_model=schemas.PublicNewsArticle)
async def read_article(article_id: int, db: Session = Depends(get_db)):
    article = crud.get_news_article(db, article_id, increment_views=True)
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    
    return {
        "id": article.id,
        "title": article.title,
        "summary": article.summary,
        "content": article.content,
        "category": article.category,
        "image_url": article.image_url,
        "date": article.date
    }

@router.post("/", response_model=schemas.NewsArticle)
def create_news_article(
    article: schemas.NewsArticleCreate,
    db: Session = Depends(get_db),
    admin_id: Optional[int] = None
):
    if not admin_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin authentication required"
        )
    try:
        return crud.create_news_article(db, article, admin_id)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create article: {str(e)}"
        )