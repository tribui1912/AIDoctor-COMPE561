from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import crud, models, schemas
from ..database import get_db
from ..auth_utils import get_current_admin, get_password_hash
from datetime import datetime
from sqlalchemy import func
import secrets
import bcrypt

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
    db_article = crud.create_news_article(db, article, current_admin.id)
    # Convert the SQLAlchemy model instance to a Pydantic model
    return schemas.NewsArticle.from_orm(db_article)

@router.put("/news/{article_id}", response_model=schemas.AdminNewsArticle)
async def update_article(
    article_id: int,
    article: schemas.NewsArticleUpdate,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    """Update a news article"""
    try:
        # Check if article exists
        db_article = crud.get_news_article(db, article_id)
        if not db_article:
            raise HTTPException(
                status_code=404,
                detail="Article not found"
            )
        
        # Check if admin is the owner or has sufficient permissions
        if db_article.admin_id != current_admin.id and not current_admin.permissions.get("news", []):
            raise HTTPException(
                status_code=403,
                detail="Not authorized to edit this article"
            )
        
        # Create update_data dictionary manually from non-None values
        update_data = {}
        if article.title is not None:
            update_data["title"] = article.title
        if article.summary is not None:
            update_data["summary"] = article.summary
        if article.content is not None:
            update_data["content"] = article.content
        if article.category is not None:
            update_data["category"] = article.category
        if article.image_url is not None:
            update_data["image_url"] = article.image_url
        if article.status is not None:
            update_data["status"] = article.status
            
        print(f"Update data received: {update_data}")  # Debug log
        
        # Update the article object
        for key, value in update_data.items():
            setattr(db_article, key, value)
        
        db.commit()
        db.refresh(db_article)
        
        return schemas.AdminNewsArticle(
            id=db_article.id,
            title=db_article.title,
            summary=db_article.summary,
            content=db_article.content,
            category=db_article.category,
            image_url=db_article.image_url,
            date=db_article.date,
            admin_id=db_article.admin_id,
            status=db_article.status
        )
        
    except Exception as e:
        print(f"Error updating article: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.delete("/news/{article_id}")
async def delete_news_article(
    article_id: int,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    # First check if article exists, including drafts
    article = crud.get_news_article(db, article_id, include_drafts=True)
    if not article:
        raise HTTPException(
            status_code=404,
            detail="Article not found"
        )
    
    # Check if admin has permission to delete this article
    if article.admin_id != current_admin.id and not current_admin.permissions.get("news", []):
        raise HTTPException(
            status_code=403,
            detail="Not authorized to delete this article"
        )
    
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
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    """Get all users (admin only)"""
    users = db.query(models.User).all()
    return [
        schemas.UserResponse(
            id=user.id,
            name=user.name,
            email=user.email,
            is_active=user.is_active,
            role="user",
            status="active" if user.is_active else "inactive",
            created_at=user.created_at
        ) 
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
    user: schemas.UserCreate,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    """Create a new user (admin only)"""
    try:
        # Check if email already exists
        db_user = crud.get_user_by_email(db, user.email)
        if db_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
        
        # Create new user
        hashed_password = get_password_hash(user.password)
        
        new_user = models.User(
            name=user.name,
            email=user.email,
            hashed_password=hashed_password,
            is_active=True,
            phone=user.phone
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        return schemas.UserResponse(
            id=new_user.id,
            name=new_user.name,
            email=new_user.email,
            is_active=new_user.is_active,
            role="user",
            status="active",
            created_at=new_user.created_at
        )
        
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error creating user: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error creating user: {str(e)}"
        )

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
    """Get all admins (admin only)"""
    admins = db.query(models.Admin).all()
    return [
        schemas.AdminResponse(
            id=admin.id,
            username=admin.username,
            email=admin.email,
            is_active=admin.is_active,
            role="admin",
            status="active" if admin.is_active else "inactive",
            permissions=admin.permissions,
            created_at=admin.created_at
        )
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

@router.put("/users/{user_id}", response_model=schemas.UserResponse)
async def update_user(
    user_id: int,
    user: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    """Update a user (admin only)"""
    db_user = crud.get_user(db, user_id)
    if not db_user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    for key, value in user.model_dump(exclude_unset=True).items():
        setattr(db_user, key, value)
    
    db.commit()
    db.refresh(db_user)
    return schemas.UserResponse.from_user(db_user)

@router.put("/admins/{admin_id}", response_model=schemas.AdminResponse)
async def update_admin(
    admin_id: int,
    admin: schemas.AdminUpdate,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    """Update an admin user"""
    db_admin = crud.get_admin(db, admin_id)
    if not db_admin:
        raise HTTPException(
            status_code=404,
            detail="Admin not found"
        )
    
    for key, value in admin.model_dump(exclude_unset=True).items():
        setattr(db_admin, key, value)
    
    db.commit()
    db.refresh(db_admin)
    return schemas.AdminResponse.from_orm(db_admin)

@router.patch("/admins/{admin_id}", response_model=schemas.AdminResponse)
async def patch_admin(
    admin_id: int,
    admin: schemas.AdminUpdate,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    """Update an admin user"""
    try:
        db_admin = crud.get_admin_by_id(db, admin_id)
        if not db_admin:
            raise HTTPException(
                status_code=404,
                detail="Admin not found"
            )
        
        # Create update_data dictionary manually from non-None values
        update_data = {}
        if admin.username is not None:
            update_data["username"] = admin.username
        if admin.email is not None:
            update_data["email"] = admin.email
        if admin.password is not None:
            hashed_password = bcrypt.hashpw(
                admin.password.encode('utf-8'), 
                bcrypt.gensalt()
            )
            update_data["password_hash"] = hashed_password.decode('utf-8')
        if admin.is_active is not None:
            update_data["is_active"] = admin.is_active
        if admin.permissions is not None:
            update_data["permissions"] = admin.permissions
            
        print(f"Update data received: {update_data}")  # Debug log
        
        # Update the admin object
        for key, value in update_data.items():
            setattr(db_admin, key, value)
        
        db.commit()
        db.refresh(db_admin)
        
        return schemas.AdminResponse(
            id=db_admin.id,
            username=db_admin.username,
            email=db_admin.email,
            is_active=db_admin.is_active,
            role="admin",
            status="active" if db_admin.is_active else "inactive",
            permissions=db_admin.permissions,
            created_at=db_admin.created_at
        )
    except Exception as e:
        print(f"Error updating admin: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.patch("/users/{user_id}", response_model=schemas.UserResponse)
async def patch_user(
    user_id: int,
    user: schemas.UserUpdate,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    """Update a user (admin only)"""
    try:
        db_user = crud.get_user(db, user_id)
        if not db_user:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
        
        # Create update_data dictionary manually from non-None values
        update_data = {}
        if user.name is not None:
            update_data["name"] = user.name
        if user.email is not None:
            update_data["email"] = user.email
        if user.password is not None:
            update_data["hashed_password"] = get_password_hash(user.password)
        if user.is_active is not None:
            update_data["is_active"] = user.is_active
        if user.phone is not None:
            update_data["phone"] = user.phone
            
        print(f"Update data received: {update_data}")  # Debug log
        
        # Update the user object
        for key, value in update_data.items():
            setattr(db_user, key, value)
        
        db.commit()
        db.refresh(db_user)
        
        return schemas.UserResponse(
            id=db_user.id,
            name=db_user.name,
            email=db_user.email,
            is_active=db_user.is_active,
            role="user",
            status="active" if db_user.is_active else "inactive",
            created_at=db_user.created_at
        )
    except Exception as e:
        print(f"Error updating user: {str(e)}")

@router.post("/admins", response_model=schemas.AdminResponse)
async def create_admin(
    admin: schemas.AdminCreate,
    db: Session = Depends(get_db),
    current_admin: models.Admin = Depends(get_current_admin)
):
    """Create a new admin"""
    try:
        # Check if username already exists
        db_admin = crud.get_admin_by_username(db, admin.username)
        if db_admin:
            raise HTTPException(
                status_code=400,
                detail="Username already registered"
            )
        
        # Check if email already exists
        db_admin = crud.get_admin_by_email(db, admin.email)
        if db_admin:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
        
        # Create new admin
        hashed_password = bcrypt.hashpw(
            admin.password.encode('utf-8'), 
            bcrypt.gensalt()
        )
        
        new_admin = models.Admin(
            username=admin.username,
            email=admin.email,
            password_hash=hashed_password.decode('utf-8'),
            permissions=admin.permissions,
            is_active=admin.is_active,
            role=admin.role
        )
        
        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)
        
        return schemas.AdminResponse(
            id=new_admin.id,
            username=new_admin.username,
            email=new_admin.email,
            is_active=new_admin.is_active,
            role="admin",
            status="active" if new_admin.is_active else "inactive",
            permissions=new_admin.permissions,
            created_at=new_admin.created_at
        )
        
    except HTTPException as e:
        raise e
    except Exception as e:
        print(f"Error creating admin: {str(e)}")
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=f"Error creating admin: {str(e)}"
        )