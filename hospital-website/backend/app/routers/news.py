from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, schemas, database

router = APIRouter(
    prefix="/api/news",
    tags=["news"]
)

@router.get("/", response_model=List[schemas.NewsArticle])
def read_news(skip: int = 0, limit: int = 6, db: Session = Depends(database.get_db)):
    articles = crud.get_news_articles(db, skip=skip, limit=limit)
    return articles

@router.get("/{article_id}", response_model=schemas.NewsArticle)
def read_news_article(article_id: int, db: Session = Depends(database.get_db)):
    article = crud.get_news_article(db, article_id)
    if article is None:
        raise HTTPException(status_code=404, detail="Article not found")
    return article

@router.post("/", response_model=schemas.NewsArticle)
def create_news_article(
    article: schemas.NewsArticleCreate,
    db: Session = Depends(database.get_db),
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

@router.put("/{article_id}", response_model=schemas.NewsArticle)
def update_news_article(
    article_id: int,
    article: schemas.NewsArticleCreate,
    db: Session = Depends(database.get_db)
):
    return crud.update_news_article(db, article_id, article)

@router.delete("/{article_id}")
def delete_news_article(article_id: int, db: Session = Depends(database.get_db)):
    crud.delete_news_article(db, article_id)
    return {"success": True}