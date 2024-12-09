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
    date: Optional[datetime] = None

class NewsArticle(NewsArticleBase):
    id: int
    admin_id: int
    date: datetime
    
    class Config:
        orm_mode = True
        from_attributes = True

class UserBase(BaseModel):
    email: EmailStr
    name: str

    model_config = ConfigDict(from_attributes=True)

class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    
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

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    phone: Optional[str] = None
    
    model_config = ConfigDict(from_attributes=True)

class AdminBase(BaseModel):
    username: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)

class AdminCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    permissions: Optional[Dict[str, List[str]]] = {
        "news": ["create", "read", "update", "delete"],
        "appointments": ["create", "read", "update", "delete"],
        "users": ["read", "update", "delete"]
    }
    is_active: bool = True
    role: str = "admin"
    
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
    reason: str = "General checkup"
    status: str = "pending"

class AppointmentCreate(AppointmentBase):
    pass

class AppointmentUpdate(BaseModel):
    date: Optional[datetime] = None
    reason: Optional[str] = None
    status: Optional[str] = None
    doctor_id: Optional[int] = None

    model_config = ConfigDict(from_attributes=True)

class Appointment(AppointmentBase):
    id: int
    user_id: int

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
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None
    permissions: Optional[Dict[str, List[str]]] = None
    
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

    def model_dump(self, *args, **kwargs):
        return super().dict(*args, **kwargs)

class AdminStatistics(BaseModel):
    totalUsers: int
    totalArticles: int
    totalViews: int

    model_config = ConfigDict(from_attributes=True)

class UserResponse(BaseModel):
    id: int
    name: str
    email: str
    is_active: bool = True
    role: str = "user"
    status: str = "active"
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

    @classmethod
    def from_user(cls, user):
        return cls(
            id=user.id,
            email=user.email,
            name=user.name,
            is_active=user.is_active,
            role=user.role,
            created_at=user.created_at
        )

    @classmethod
    def from_admin(cls, admin):
        return cls(
            id=admin.id,
            email=admin.email,
            name=admin.username,
            is_active=admin.is_active,
            role="admin",
            created_at=admin.created_at
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
    
    class Config:
        orm_mode = True
        from_attributes = True

class AdminNewsArticle(NewsArticle):
    admin_id: int
    status: str
    
    class Config:
        orm_mode = True
        from_attributes = True

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
    is_active: bool = True
    role: str = "admin"
    status: str = "active"
    permissions: Optional[Dict[str, List[str]]] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class SignupResponse(BaseModel):
    id: int
    email: str
    name: str
    created_at: datetime
    is_active: bool
    
    model_config = ConfigDict(from_attributes=True)
