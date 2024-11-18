from pydantic import BaseModel, EmailStr, ConfigDict, Field, constr
from datetime import datetime
from typing import Optional, Dict, Any, List

class NewsArticleBase(BaseModel):
    title: str
    summary: str
    content: str
    category: str
    image_url: str
    status: str = "draft"

    model_config = ConfigDict(from_attributes=True)

class NewsArticleCreate(NewsArticleBase):
    pass

class NewsArticle(NewsArticleBase):
    id: int
    admin_id: int
    date: datetime
    model_config = ConfigDict(from_attributes=True)

class UserBase(BaseModel):
    email: EmailStr
    name: str

    model_config = ConfigDict(from_attributes=True)

class UserCreate(BaseModel):
    email: EmailStr
    password: constr(min_length=8)
    name: str
    phone: str

    model_config = ConfigDict(from_attributes=True)

class User(UserBase):
    id: int
    hashed_password: str
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime]
    is_active: bool
    email_verified: bool
    email_verified_at: Optional[datetime]
    model_config = ConfigDict(from_attributes=True)

class AdminBase(BaseModel):
    username: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)

class AdminCreate(AdminBase):
    password: str
    role: str = 'editor'
    permissions: Optional[Dict[str, Any]]

    model_config = ConfigDict(from_attributes=True)

class Admin(AdminBase):
    id: int
    created_at: datetime
    updated_at: datetime
    last_login: Optional[datetime]
    is_active: bool
    role: str
    permissions: Optional[Dict[str, Any]]
    model_config = ConfigDict(from_attributes=True)

class Token(BaseModel):
    access_token: str
    token_type: str

    model_config = ConfigDict(from_attributes=True)

class TokenData(BaseModel):
    email: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str

    model_config = ConfigDict(from_attributes=True)

class RefreshTokenRequest(BaseModel):
    refresh_token: str

    model_config = ConfigDict(from_attributes=True)

class LoginResponse(BaseModel):
    user: User
    access_token: str
    refresh_token: str
    token_type: str

    model_config = ConfigDict(from_attributes=True)

class AppointmentBase(BaseModel):
    date: datetime
    reason: str
    status: str = Field(..., description="Status of the appointment", 
                       pattern="^(pending|confirmed|cancelled|completed)$")
    additional_notes: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class AppointmentCreate(AppointmentBase):
    user_id: int

    model_config = ConfigDict(from_attributes=True)

class AppointmentUpdate(BaseModel):
    date: Optional[datetime] = None
    reason: Optional[str] = None
    status: Optional[str] = None
    doctor_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

class Appointment(AppointmentBase):
    id: int
    user_id: int
    doctor_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AdminLogin(BaseModel):
    username: str
    password: str
    model_config = ConfigDict(from_attributes=True)

class AdminToken(BaseModel):
    access_token: str
    token_type: str
    model_config = ConfigDict(from_attributes=True)

class AdminUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    model_config = ConfigDict(from_attributes=True)

class PaginatedNewsArticles(BaseModel):
    total: int
    items: List[NewsArticle]
    skip: int
    limit: int

    model_config = ConfigDict(from_attributes=True)

class NewsArticleUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    image_url: Optional[str] = None
    status: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)

class AdminStatistics(BaseModel):
    total_articles: int
    published_articles: int
    draft_articles: int
    total_views: int
    articles_by_category: Dict[str, int]
    recent_articles: List[NewsArticle]

    model_config = ConfigDict(from_attributes=True)
