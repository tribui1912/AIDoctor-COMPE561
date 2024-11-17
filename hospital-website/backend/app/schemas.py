from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from typing import Optional, Dict, Any, List

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

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

class RefreshTokenRequest(BaseModel):
    refresh_token: str

class LoginResponse(BaseModel):
    user: User
    access_token: str
    refresh_token: str
    token_type: str

class AppointmentBase(BaseModel):
    date: datetime
    reason: str
    status: str = "pending"

class AppointmentCreate(AppointmentBase):
    user_id: int

class AppointmentUpdate(BaseModel):
    date: Optional[datetime] = None
    reason: Optional[str] = None
    status: Optional[str] = None
    doctor_id: Optional[int] = None

class Appointment(AppointmentBase):
    id: int
    user_id: int
    doctor_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class AdminLogin(BaseModel):
    username: str
    password: str

class AdminToken(BaseModel):
    access_token: str
    token_type: str

class AdminUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[str] = None
    permissions: Optional[Dict[str, List[str]]] = None

class PaginatedNewsArticles(BaseModel):
    total: int
    items: List[NewsArticle]
    skip: int
    limit: int

class NewsArticleUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    status: Optional[str] = None

class AdminStatistics(BaseModel):
    total_articles: int
    published_articles: int
    draft_articles: int
    total_views: int
    articles_by_category: Dict[str, int]
    recent_articles: List[NewsArticle]

    model_config = ConfigDict(from_attributes=True)
