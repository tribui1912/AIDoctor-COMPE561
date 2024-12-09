from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
from typing import Optional
import secrets

from .. import crud, schemas, models
from ..database import get_db
from ..auth_utils import (
    create_access_token,
    get_current_user,
    get_password_hash,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(
    prefix="/api/auth",
    tags=["authentication"]
)

@router.post("/signup", response_model=schemas.SignupResponse)
async def signup(
    user_data: schemas.UserCreate,
    db: Session = Depends(get_db)
):
    db_user = crud.get_user_by_email(db, email=user_data.email)
    if db_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    # Create new user
    db_user = models.User(
        email=user_data.email,
        name=user_data.name,
        hashed_password=get_password_hash(user_data.password),
        phone=user_data.phone,
        is_active=True,
        email_verified=False,
        created_at=datetime.utcnow()
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Return a dictionary that matches SignupResponse schema
    return {
        "id": db_user.id,
        "email": db_user.email,
        "name": db_user.name,
        "phone": db_user.phone,
        "is_active": db_user.is_active,
        "email_verified": db_user.email_verified,
        "created_at": db_user.created_at
    }

@router.post("/login", response_model=schemas.TokenResponse)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = crud.get_user_by_email(db, email=form_data.username)
    if not user or not crud.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )

    # Create refresh token
    refresh_token = crud.create_refresh_token(db, user_id=user.id)

    # Update last login
    crud.update_user_last_login(db, user)

    return {
        "access_token": access_token,
        "refresh_token": refresh_token.token,
        "token_type": "bearer"
    }

@router.post("/refresh", response_model=schemas.TokenResponse)
async def refresh_token(
    token_data: schemas.RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    """Refresh access token using refresh token"""
    # Get refresh token from database
    db_token = crud.get_refresh_token(db, token_data.refresh_token)
    
    if not db_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )
    
    # Check if token is expired
    if db_token.expires_at < datetime.utcnow():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has expired"
        )
    
    # Check if token is revoked
    if db_token.is_revoked:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token has been revoked"
        )
    
    # Create new access token based on token type
    if db_token.user_id:
        user = crud.get_user_by_id(db, db_token.user_id)
        access_token = create_access_token(
            data={
                "sub": str(user.id),
                "type": "user"
            }
        )
    elif db_token.admin_id:
        admin = crud.get_admin_by_id(db, db_token.admin_id)
        access_token = create_access_token(
            data={
                "sub": str(admin.id),
                "type": "admin"
            }
        )
    else:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type"
        )
    
    # Create new refresh token and revoke the old one
    if db_token.user_id:
        new_refresh_token = crud.create_refresh_token(db, user_id=db_token.user_id)
    else:
        new_refresh_token = crud.create_admin_refresh_token(
            db, 
            admin_id=db_token.admin_id,
            token=secrets.token_urlsafe(32)
        )
    
    # Revoke old token
    crud.revoke_refresh_token(db, token_data.refresh_token)
    
    return {
        "access_token": access_token,
        "refresh_token": new_refresh_token.token,
        "token_type": "bearer"
    }

@router.post("/logout")
async def logout(
    token: schemas.RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    crud.revoke_refresh_token(db, token.refresh_token)
    return {"message": "Successfully logged out"}

@router.get("/me", response_model=schemas.User)
async def read_users_me(
    current_user: schemas.User = Depends(get_current_user)
):
    return current_user