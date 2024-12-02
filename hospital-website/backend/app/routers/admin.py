from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, models, schemas
from ..database import get_db
from ..auth_utils import get_current_admin
from datetime import datetime
from sqlalchemy import func
import secrets

router = APIRouter(
    prefix="/api/admin",
    tags=["admin"]
)

# Admin Authentication
@router.post("/login", response_model=schemas.TokenResponse)
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
    refresh_token = secrets.token_urlsafe(32)
    
    # Create refresh token in database
    crud.create_admin_refresh_token(db, admin.id, refresh_token)
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }

# News Articles Management
@router.get("/news", response_model=schemas.PaginatedAdminNewsArticles)
async def get_all_news(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    total = crud.get_news_articles_count(db)
    articles = crud.get_news_articles(db, skip=skip, limit=limit)
    
    # Convert SQLAlchemy models to dictionaries with admin fields
    articles_list = [
        {
            "id": article.id,
            "title": article.title,
            "summary": article.summary,
            "content": article.content,
            "category": article.category,
            "image_url": article.image_url,
            "date": article.date,
            "admin_id": article.admin_id,
            "status": article.status
        }
        for article in articles
    ]
    
    return {
        "total": total,
        "items": articles_list,
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
    article_dict = article.model_dump(exclude_unset=True)
    article_dict["date"] = datetime.utcnow()
    return crud.update_news_article(db, article_id, article_dict)

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

@router.get("/users", response_model=List[schemas.UserResponse])
async def get_users(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    """Get all users (admin only)"""
    users = crud.get_users(db, skip=skip, limit=limit)
    return [
        schemas.UserResponse.from_admin(user) if isinstance(user, models.Admin)
        else schemas.UserResponse.from_user(user)
        for user in users
    ]

@router.get("/stats", response_model=schemas.AdminStatistics)
async def get_admin_stats(
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    total_users = db.query(models.User).count()
    total_articles = db.query(models.NewsArticle).count()
    total_views = db.query(func.sum(models.NewsArticle.views_count)).scalar() or 0

    return {
        "totalUsers": total_users,
        "totalArticles": total_articles,
        "totalViews": total_views
    }

@router.post("/users", response_model=schemas.UserResponse)
async def create_user(
    user: schemas.AdminUserCreate,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    """Create a new user (admin only)"""
    # Check if email already exists
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    if user.role == "admin":
        # Create admin user
        admin_data = schemas.AdminCreate(
            username=user.name,
            email=user.email,
            password=user.password,
            role="admin",
            permissions=user.permissions or {
                "news": ["create", "read", "update", "delete"],
                "appointments": ["create", "read", "update", "delete"],
                "users": ["read", "update", "delete"]
            }
        )
        created_user = crud.create_admin(db, admin_data)
        return schemas.UserResponse.from_admin(created_user)
    else:
        # Create regular user
        created_user = crud.create_user(db, user)
        return schemas.UserResponse.from_user(created_user)

@router.delete("/users/{user_id}")
async def delete_regular_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    """Delete a regular user"""
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

@router.delete("/admins/{admin_id}")
async def delete_admin(
    admin_id: int,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    """Delete an admin user"""
    # Prevent admin from deleting themselves
    if admin_id == current_admin.id:
        raise HTTPException(
            status_code=400,
            detail="Cannot delete your own admin account"
        )
    
    admin = db.query(models.Admin).filter(models.Admin.id == admin_id).first()
    if not admin:
        raise HTTPException(
            status_code=404,
            detail="Admin not found"
        )
    
    db.delete(admin)
    db.commit()
    return {"message": "Admin deleted successfully"}

@router.post("/logout")
async def admin_logout(
    token: schemas.RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    """Logout admin user without requiring authentication"""
    try:
        crud.revoke_refresh_token(db, token.refresh_token)
    except Exception as e:
        # Log the error but don't fail the logout
        print(f"Error revoking token: {e}")
    
    return {"message": "Successfully logged out"}

# Add these new endpoints for separate user and admin management

@router.get("/admins", response_model=List[schemas.AdminResponse])
async def get_admins(
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    """Get all admin users"""
    admins = db.query(models.Admin).all()
    return [
        {
            "id": admin.id,
            "username": admin.username,
            "email": admin.email,
            "role": "admin",
            "status": "active" if admin.is_active else "inactive",
            "is_active": admin.is_active,
            "permissions": admin.permissions
        }
        for admin in admins
    ]

@router.get("/users", response_model=List[schemas.UserResponse])
async def get_regular_users(
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    """Get all regular users"""
    users = db.query(models.User).all()
    return [
        {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "role": "user",
            "status": "active" if user.is_active else "inactive",
            "is_active": user.is_active
        }
        for user in users
    ]