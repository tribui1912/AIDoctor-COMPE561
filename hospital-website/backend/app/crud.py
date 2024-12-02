from sqlalchemy.orm import Session
from . import models, schemas
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from sqlalchemy.exc import SQLAlchemyError
import bcrypt
import secrets
from typing import Optional
from sqlalchemy.sql import func
from .password_utils import get_password_hash, verify_password
from .auth_utils import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token

def get_news_articles(db: Session, skip: int = 0, limit: int = 100):
    try:
        return db.query(models.NewsArticle).offset(skip).limit(limit).all()
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database error: {str(e)}"
        )

def get_news_article(db: Session, article_id: int, increment_views: bool = False):
    try:
        article = db.query(models.NewsArticle).filter(
            models.NewsArticle.id == article_id,
            models.NewsArticle.status == "published"  # Only show published articles
        ).first()
        
        if article and increment_views:
            # Increment views count only if explicitly requested
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

def update_news_article(db: Session, article_id: int, article: dict):
    db_article = get_news_article(db, article_id)
    if not db_article:
        raise HTTPException(status_code=404, detail="Article not found")
    
    for key, value in article.items():
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
    hashed_password = get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        name=user.name,
        phone=user.phone,
        hashed_password=hashed_password,
        role=user.role,
        status=user.status
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
    """Get refresh token from database"""
    return db.query(models.RefreshToken).filter(
        models.RefreshToken.token == token
    ).first()

def revoke_refresh_token(db: Session, token: str):
    """Revoke a refresh token"""
    db_token = get_refresh_token(db, token)
    if db_token:
        db_token.is_revoked = True
        db_token.revoked_at = datetime.utcnow()
        db.commit()
        db.refresh(db_token)
    return db_token

def create_appointment(db: Session, appointment: schemas.AppointmentCreate):
    """Create a new appointment"""
    db_appointment = models.Appointment(**appointment.model_dump())
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
    """Update an appointment"""
    db_appointment = get_appointment(db, appointment_id)
    if not db_appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    update_data = appointment.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_appointment, field, value)
    
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

def delete_appointment(db: Session, appointment_id: int):
    """Soft delete appointment by marking it as cancelled"""
    db_appointment = get_appointment(db, appointment_id)
    if not db_appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    
    db_appointment.status = "cancelled"
    db.commit()
    db.refresh(db_appointment)
    return db_appointment

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

def create_user_refresh_token(db: Session, user_id: int, token: str, expires_delta: timedelta = None):
    """Create a new user refresh token"""
    if expires_delta is None:
        expires_delta = timedelta(days=7)
    
    db_token = models.RefreshToken(
        token=token,
        user_id=user_id,
        expires_at=datetime.utcnow() + expires_delta
    )
    db.add(db_token)
    db.commit()
    db.refresh(db_token)
    return db_token

def create_admin_refresh_token(db: Session, admin_id: int, token: str, expires_delta: timedelta = None):
    """Create a new admin refresh token"""
    if expires_delta is None:
        expires_delta = timedelta(days=7)
    
    db_token = models.RefreshToken(
        token=token,
        admin_id=admin_id,
        expires_at=datetime.utcnow() + expires_delta
    )
    db.add(db_token)
    db.commit()
    db.refresh(db_token)
    return db_token

def verify_user_password(db: Session, email: str, password: str) -> bool:
    user = get_user_by_email(db, email)
    if not user:
        return False
    return verify_password(password, user.hashed_password)

def get_user_appointments(db: Session, user_id: int):
    """Get all appointments for a specific user"""
    return db.query(models.Appointment)\
             .filter(models.Appointment.user_id == user_id)\
             .all()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    """Get all users including admins"""
    # Get regular users
    users = db.query(models.User).offset(skip).limit(limit).all()
    
    # Get admin users
    admins = db.query(models.Admin).all()
    
    # Return combined list of model instances
    return users + admins

def delete_user(db: Session, user_id: int):
    """Delete a user or admin"""
    # Try to find and delete user
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user:
        db.delete(user)
        db.commit()
        return True

    # If not found, try to find and delete admin
    admin = db.query(models.Admin).filter(models.Admin.id == user_id).first()
    if admin:
        # Prevent deleting the last admin
        admin_count = db.query(models.Admin).count()
        if admin_count <= 1:
            raise HTTPException(
                status_code=400,
                detail="Cannot delete the last admin user"
            )
        db.delete(admin)
        db.commit()
        return True

    raise HTTPException(
        status_code=404,
        detail="User not found"
    )
