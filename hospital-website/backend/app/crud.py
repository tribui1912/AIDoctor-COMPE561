from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
import bcrypt
import secrets
from typing import Optional
from sqlalchemy.sql import func

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

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(
        plain_password.encode('utf-8'),
        hashed_password.encode('utf-8')
    )

def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def update_user_last_login(db: Session, user: models.User):
    user.last_login = datetime.utcnow()
    db.commit()
    return user

def create_refresh_token(db: Session, user_id: int) -> models.RefreshToken:
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(days=30)
    
    db_token = models.RefreshToken(
        token=token,
        user_id=user_id,
        expires_at=expires_at
    )
    db.add(db_token)
    db.commit()
    db.refresh(db_token)
    return db_token

def get_refresh_token(db: Session, token: str):
    return db.query(models.RefreshToken).filter(
        models.RefreshToken.token == token
    ).first()

def revoke_refresh_token(db: Session, token: str):
    db_token = get_refresh_token(db, token)
    if db_token:
        db_token.is_revoked = True
        db_token.revoked_at = datetime.utcnow()
        db.commit()
    return db_token

def create_appointment(db: Session, appointment: schemas.AppointmentCreate):
    db_appointment = models.Appointment(**appointment.dict())
    db.add(db_appointment)
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

def get_appointments(db: Session, skip: int = 0, limit: int = 100, status: Optional[str] = None):
    query = db.query(models.Appointment)
    if status:
        query = query.filter(models.Appointment.status == status)
    return query.offset(skip).limit(limit).all()

def get_appointment(db: Session, appointment_id: int):
    return db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()

def update_appointment(db: Session, appointment_id: int, appointment: schemas.AppointmentUpdate):
    db_appointment = get_appointment(db, appointment_id)
    if not db_appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    for key, value in appointment.dict(exclude_unset=True).items():
        setattr(db_appointment, key, value)
    
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

def delete_appointment(db: Session, appointment_id: int):
    db_appointment = get_appointment(db, appointment_id)
    if not db_appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    db.delete(db_appointment)
    db.commit()
    return True

def assign_doctor_to_appointment(db: Session, appointment_id: int, doctor_id: int):
    appointment = get_appointment(db, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    appointment.doctor_id = doctor_id
    appointment.status = "assigned"
    db.commit()
    db.refresh(appointment)
    return appointment

def authenticate_admin(db: Session, username: str, password: str):
    admin = db.query(models.Admin).filter(models.Admin.username == username).first()
    if not admin or not verify_password(password, admin.password_hash):
        return None
    return admin

def create_admin_access_token(admin_id: int):
    expires_delta = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": str(admin_id), "type": "admin"}
    return create_access_token(to_encode, expires_delta)

def get_news_articles_count(db: Session):
    return db.query(models.NewsArticle).count()

def update_admin(db: Session, admin_id: int, admin_update: schemas.AdminUpdate):
    db_admin = db.query(models.Admin).filter(models.Admin.id == admin_id).first()
    if not db_admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    
    update_data = admin_update.dict(exclude_unset=True)
    if "password" in update_data:
        update_data["password_hash"] = bcrypt.hashpw(
            update_data.pop("password").encode('utf-8'),
            bcrypt.gensalt()
        ).decode('utf-8')
    
    for key, value in update_data.items():
        setattr(db_admin, key, value)
    
    db.commit()
    db.refresh(db_admin)
    return db_admin

def get_news_categories(db: Session):
    return db.query(models.NewsArticle.category).distinct().all()

def get_admin_statistics(db: Session):
    total = db.query(models.NewsArticle).count()
    published = db.query(models.NewsArticle).filter(
        models.NewsArticle.status == "published"
    ).count()
    draft = db.query(models.NewsArticle).filter(
        models.NewsArticle.status == "draft"
    ).count()
    
    total_views = db.query(func.sum(models.NewsArticle.views_count)).scalar() or 0
    
    categories = db.query(
        models.NewsArticle.category,
        func.count(models.NewsArticle.id)
    ).group_by(models.NewsArticle.category).all()
    
    recent = db.query(models.NewsArticle).order_by(
        models.NewsArticle.created_at.desc()
    ).limit(5).all()
    
    return {
        "total_articles": total,
        "published_articles": published,
        "draft_articles": draft,
        "total_views": total_views,
        "articles_by_category": dict(categories),
        "recent_articles": recent
    }

def get_admin_by_id(db: Session, admin_id: int):
    return db.query(models.Admin).filter(models.Admin.id == admin_id).first()
