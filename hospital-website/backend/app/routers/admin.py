from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, models, schemas
from ..database import get_db
from ..auth_utils import get_current_admin
from datetime import datetime

router = APIRouter(
    prefix="/api/admin",
    tags=["admin"]
)

# Admin Authentication
@router.post("/login", response_model=schemas.AdminToken)
async def admin_login(
    form_data: schemas.AdminLogin,
    db: Session = Depends(get_db)
):
    admin = crud.authenticate_admin(db, form_data.username, form_data.password)
    if not admin:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password"
        )
    
    access_token = crud.create_admin_access_token(admin.id)
    return {"access_token": access_token, "token_type": "bearer"}

# News Articles Management
@router.get("/news", response_model=schemas.PaginatedNewsArticles)
async def get_all_news(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    total = crud.get_news_articles_count(db)
    articles = crud.get_news_articles(db, skip=skip, limit=limit)
    return {
        "total": total,
        "items": articles,
        "skip": skip,
        "limit": limit
    }

@router.post("/news", response_model=schemas.NewsArticle)
async def create_news_article(
    article: schemas.NewsArticleCreate,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    return crud.create_news_article(db, article, current_admin.id)

@router.put("/news/{article_id}", response_model=schemas.NewsArticle)
async def update_news_article(
    article_id: int,
    article: schemas.NewsArticleUpdate,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    db_article = crud.get_news_article(db, article_id)
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    return crud.update_news_article(db, article_id, article)

@router.delete("/news/{article_id}")
async def delete_news_article(
    article_id: int,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    crud.delete_news_article(db, article_id)
    return {"message": "Article deleted successfully"}

# Admin Profile Management
@router.get("/profile", response_model=schemas.Admin)
async def get_admin_profile(
    current_admin: models.Admin = Depends(get_current_admin)
):
    return current_admin

@router.put("/profile", response_model=schemas.Admin)
async def update_admin_profile(
    profile: schemas.AdminUpdate,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    return crud.update_admin(db, current_admin.id, profile)

# Categories
@router.get("/categories", response_model=List[str])
async def get_categories(
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    return crud.get_news_categories(db)

# Statistics
@router.get("/statistics", response_model=schemas.AdminStatistics)
async def get_statistics(
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    return crud.get_admin_statistics(db) 