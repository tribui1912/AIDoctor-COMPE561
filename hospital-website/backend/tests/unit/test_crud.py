import pytest
from app import crud, schemas
from datetime import datetime

def test_create_user(db_session):
    user_data = schemas.UserCreate(
        email="test@example.com",
        password="testpass123",
        name="Test User"
    )
    user = crud.create_user(db_session, user_data)
    assert user.email == "test@example.com"
    assert user.name == "Test User"

def test_get_user_by_email(db_session):
    # First create a user
    user_data = schemas.UserCreate(
        email="test@example.com",
        password="testpass123",
        name="Test User"
    )
    created_user = crud.create_user(db_session, user_data)
    
    # Then try to get the user
    user = crud.get_user_by_email(db_session, email="test@example.com")
    assert user is not None
    assert user.email == created_user.email