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
    role: str = "user"
    status: str = "active"

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

class NewsArticleResponse(BaseModel):
    id: int
    title: str
    summary: str
    content: str
    category: str
    image_url: str
    status: str
    date: datetime
    
    model_config = ConfigDict(from_attributes=True)

class PaginatedNewsArticles(BaseModel):
    total: int
    items: List[NewsArticleResponse]
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
    totalUsers: int
    totalArticles: int
    totalViews: int

    model_config = ConfigDict(from_attributes=True)

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    role: str = "user"
    status: str
    is_active: bool

    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def from_admin(cls, admin: "Admin") -> "UserResponse":
        return cls(
            id=admin.id,
            name=admin.username,
            email=admin.email,
            role="admin",
            status="active" if admin.is_active else "inactive",
            is_active=admin.is_active
        )

    @classmethod
    def from_user(cls, user: "User") -> "UserResponse":
        return cls(
            id=user.id,
            name=user.name,
            email=user.email,
            role="user",
            status="active" if user.is_active else "inactive",
            is_active=user.is_active
        )

class AdminUserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str = "user"
    status: str = "active"
    phone: Optional[str] = None
    permissions: Optional[Dict[str, List[str]]] = None

    model_config = ConfigDict(from_attributes=True)

class PublicNewsArticle(BaseModel):
    id: int
    title: str
    summary: str
    content: str
    category: str
    image_url: str
    date: datetime
    
    model_config = ConfigDict(from_attributes=True)

class AdminNewsArticle(NewsArticle):
    admin_id: int
    status: str
    
    model_config = ConfigDict(from_attributes=True)

class PaginatedAdminNewsArticles(BaseModel):
    total: int
    items: List[AdminNewsArticle]
    skip: int
    limit: int
    
    model_config = ConfigDict(from_attributes=True)

class AdminResponse(BaseModel):
    id: int
    username: str
    email: str
    role: str = "admin"
    status: str
    is_active: bool
    permissions: Optional[Dict[str, List[str]]] = None

    model_config = ConfigDict(from_attributes=True)
