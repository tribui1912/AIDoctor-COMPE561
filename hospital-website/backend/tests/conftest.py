import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base, get_db
from app.main import app
import os

# Use an in-memory SQLite database for testing
SQLALCHEMY_TEST_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_TEST_DATABASE_URL, connect_args={"check_same_thread": False}
)
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
def test_admin(db_session):
    from app.crud import create_admin
    from app.schemas import AdminCreate
    
    admin = AdminCreate(
        username="testadmin",
        email="testadmin@test.com",
        password="testpass123",
        role="admin"
    )
    return create_admin(db_session, admin)

@pytest.fixture
def admin_token(test_admin):
    from app.auth_utils import create_access_token
    return create_access_token(data={"sub": str(test_admin.id)})

@pytest.fixture
def test_user(db_session):
    from app.crud import create_user
    from app.schemas import UserCreate
    
    user = UserCreate(
        email="testuser@test.com",
        password="testpass123",
        name="Test User"
    )
    return create_user(db_session, user)

@pytest.fixture
def test_doctor(db_session):
    from app.models import Doctor
    
    doctor = Doctor(
        name="Dr. Test",
        specialty="General",
        email="doctor@test.com"
    )
    db_session.add(doctor)
    db_session.commit()
    db_session.refresh(doctor)
    return doctor

@pytest.fixture
def user_token(test_user):
    from app.auth_utils import create_access_token
    return create_access_token(data={"sub": test_user.email})

@pytest.fixture
def sub_admin(db_session):
    from app.crud import create_admin
    from app.schemas import AdminCreate
    
    admin = AdminCreate(
        username="subadmin",
        email="subadmin@test.com",
        password="subadmin123",
        role="editor",
        permissions={
            "news": ["read", "create"],
            "appointments": ["read"]
        }
    )
    return create_admin(db_session, admin)

@pytest.fixture
def sub_admin_token(sub_admin):
    from app.auth_utils import create_access_token
    return create_access_token(data={"sub": str(sub_admin.id)})