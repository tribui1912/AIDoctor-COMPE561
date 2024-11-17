from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional, Dict, Any

class NewsArticleBase(BaseModel):
    title: str
    summary: str
    content: str
    category: str
    image_url: str
    date: datetime

class NewsArticleCreate(NewsArticleBase):
    pass

class NewsArticle(NewsArticleBase):
    id: int
    status: str
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime]
    views_count: int

    model_config = ConfigDict(
        json_encoders = {
            datetime: lambda v: v.strftime("%B %d, %Y")
        }
    )

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime]
    is_active: bool
    email_verified: bool
    email_verified_at: Optional[datetime]

    class Config:
        orm_mode = True

class AdminBase(BaseModel):
    username: str
    email: EmailStr

class AdminCreate(AdminBase):
    password: str
    role: str = 'editor'
    permissions: Optional[Dict[str, Any]]

class Admin(AdminBase):
    id: int
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime]
    is_active: bool
    role: str
    permissions: Optional[Dict[str, Any]]

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
