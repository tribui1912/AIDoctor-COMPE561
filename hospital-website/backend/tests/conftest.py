import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from datetime import datetime, timedelta
from dotenv import load_dotenv
from app.database import Base, get_db
from app.main import app
from app.auth_utils import create_access_token
from .utils.create_test_admin import create_test_admin, cleanup_test_admin
import os

# Load environment variables from .env
load_dotenv()

# Set test environment variables
os.environ["SECRET_KEY"] = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"

# Test database URL
SQLALCHEMY_TEST_DATABASE_URL = (
    f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/hospital_test_db"
)

engine = create_engine(SQLALCHEMY_TEST_DATABASE_URL)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

@pytest.fixture(scope="function")
def db_session():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)

@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            db_session.close()
    
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()

@pytest.fixture
def test_user(db_session):
    from app.crud import create_user
    from app.schemas import UserCreate
    
    user = UserCreate(
        email="testuser@test.com",
        password="testpass123",
        name="Test User",
        phone="1234567890"
    )
    return create_user(db_session, user)

@pytest.fixture
def test_user_token(test_user):
    return create_access_token(data={"sub": test_user.email})

@pytest.fixture
def test_user_refresh_token(db_session, test_user):
    """Create a test user refresh token"""
    from app.models import RefreshToken
    
    refresh_token = RefreshToken(
        token="test_user_refresh_token",
        user_id=test_user.id,
        expires_at=datetime.utcnow() + timedelta(days=7)
    )
    db_session.add(refresh_token)
    db_session.commit()
    db_session.refresh(refresh_token)
    return refresh_token

@pytest.fixture
def test_admin(db_session):
    """Create a test admin user"""
    from app.models import Admin
    from app.auth_utils import get_password_hash
    
    admin = Admin(
        username="testadmin",
        email="testadmin@test.com",
        password_hash=get_password_hash("testpass123"),
        role="admin",
        permissions={
            "news": ["create", "read", "update", "delete"],
            "appointments": ["create", "read", "update", "delete"],
            "users": ["read", "update", "delete"]
        }
    )
    db_session.add(admin)
    db_session.commit()
    db_session.refresh(admin)
    return admin

@pytest.fixture
def admin_token(test_admin):
    """Create a valid admin token"""
    return create_access_token(
        data={
            "sub": str(test_admin.id),
            "type": "admin"  # Add type to distinguish admin tokens
        }
    )

@pytest.fixture
def admin_refresh_token(db_session, test_admin):
    from app.models import RefreshToken
    
    refresh_token = RefreshToken(
        token="admin_refresh_token",
        admin_id=test_admin.id,
        expires_at=datetime.utcnow() + timedelta(days=7)
    )
    db_session.add(refresh_token)
    db_session.commit()
    db_session.refresh(refresh_token)
    return refresh_token

@pytest.fixture
def test_admin_refresh_token(db_session, test_admin):
    """Create a test admin refresh token"""
    from app.models import RefreshToken
    
    refresh_token = RefreshToken(
        token="test_admin_refresh_token",
        admin_id=test_admin.id,
        expires_at=datetime.utcnow() + timedelta(days=7)
    )
    db_session.add(refresh_token)
    db_session.commit()
    db_session.refresh(refresh_token)
    return refresh_token

@pytest.fixture
def test_doctor(db_session):
    from app.models import Doctor
    
    doctor = Doctor(
        name="Dr. Test",
        specialty="General",
        email="doctor@test.com",
        phone="1234567890",
        schedule={
            "monday": ["09:00-17:00"],
            "tuesday": ["09:00-17:00"],
            "wednesday": ["09:00-17:00"],
            "thursday": ["09:00-17:00"],
            "friday": ["09:00-17:00"]
        }
    )
    db_session.add(doctor)
    db_session.commit()
    db_session.refresh(doctor)
    return doctor

@pytest.fixture
def test_appointment(db_session, test_user, test_doctor):
    from app.models import Appointment
    
    appointment = Appointment(
        user_id=test_user.id,
        doctor_id=test_doctor.id,
        date=datetime.utcnow() + timedelta(days=1),
        reason="Test appointment",
        status="pending"
    )
    db_session.add(appointment)
    db_session.commit()
    db_session.refresh(appointment)
    return appointment

@pytest.fixture
def test_news_article(db_session, test_admin):
    from app.models import NewsArticle
    
    article = NewsArticle(
        title="Test Article",
        content="Test content",
        summary="Test summary",
        category="Test",
        image_url="https://test.com/image.jpg",
        status="published",
        admin_id=test_admin.id,
        date=datetime.utcnow()
    )
    db_session.add(article)
    db_session.commit()
    db_session.refresh(article)
    return article

@pytest.fixture
def expired_refresh_token(db_session, test_user):
    """Create an expired refresh token"""
    from app.models import RefreshToken
    
    refresh_token = RefreshToken(
        token="expired_token",
        user_id=test_user.id,
        expires_at=datetime.utcnow() - timedelta(days=1)
    )
    db_session.add(refresh_token)
    db_session.commit()
    db_session.refresh(refresh_token)
    return refresh_token

@pytest.fixture
def revoked_refresh_token(db_session, test_user):
    from app.models import RefreshToken
    
    refresh_token = RefreshToken(
        token="revoked_refresh_token",
        user_id=test_user.id,
        expires_at=datetime.utcnow() + timedelta(days=7),
        is_revoked=True,
        revoked_at=datetime.utcnow()
    )
    db_session.add(refresh_token)
    db_session.commit()
    db_session.refresh(refresh_token)
    return refresh_token