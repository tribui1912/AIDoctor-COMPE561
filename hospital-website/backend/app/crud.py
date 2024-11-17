from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime
from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
import bcrypt

def get_news_articles(db: Session, skip: int = 0, limit: int = 100):
    try:
        return db.query(models.NewsArticle).offset(skip).limit(limit).all()
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

def get_news_article(db: Session, article_id: int):
    try:
        article = db.query(models.NewsArticle).filter(
            models.NewsArticle.id == article_id,
            models.NewsArticle.status == "published"  # Only show published articles
        ).first()
        
        if article:
            # Increment views count
            article.views_count += 1
            db.commit()
            
        return article
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

def create_news_article(db: Session, article: schemas.NewsArticleCreate, admin_id: int):
    try:
        db_article = models.NewsArticle(**article.dict(), admin_id=admin_id)
        db.add(db_article)
        db.commit()
        db.refresh(db_article)
        return db_article
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create article: {str(e)}"
        )

def update_news_article(db: Session, article_id: int, article: schemas.NewsArticleCreate):
    db_article = get_news_article(db, article_id)
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    for key, value in article.dict().items():
        setattr(db_article, key, value)
    
    db_article.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_article)
    return db_article

def delete_news_article(db: Session, article_id: int):
    db_article = get_news_article(db, article_id)
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    db.delete(db_article)
    db.commit()
    return True

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    db_user = models.User(
        email=user.email,
        name=user.name,
        password_hash=hashed_password.decode('utf-8')
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_admin_by_username(db: Session, username: str):
    return db.query(models.Admin).filter(models.Admin.username == username).first()

def create_admin(db: Session, admin: schemas.AdminCreate):
    hashed_password = bcrypt.hashpw(admin.password.encode('utf-8'), bcrypt.gensalt())
    db_admin = models.Admin(
        username=admin.username,
        email=admin.email,
        password_hash=hashed_password.decode('utf-8'),
        role=admin.role,
        permissions=admin.permissions
    )
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin
