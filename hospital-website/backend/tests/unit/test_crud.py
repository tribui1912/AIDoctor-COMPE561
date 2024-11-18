import pytest
from app import crud, schemas
from datetime import datetime

@pytest.fixture
def test_user_data():
    return {
        "email": "test@example.com",
        "password": "testpass123",
        "name": "Test User",
        "phone": "1234567890"
    }

def test_create_user(db_session, test_user_data):
    user = crud.create_user(db_session, schemas.UserCreate(**test_user_data))
    assert user.email == test_user_data["email"]
    assert user.name == test_user_data["name"]
    assert user.phone == test_user_data["phone"]

def test_get_user_by_email(db_session):
    user_data = schemas.UserCreate(
        email="test@example.com",
        password="testpass123",
        name="Test User",
        phone="1234567890"
    )
    user = crud.create_user(db_session, user_data)
    fetched_user = crud.get_user_by_email(db_session, email=user.email)
    assert fetched_user.email == user.email