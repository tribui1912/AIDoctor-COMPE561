import pytest
from app.auth_utils import create_access_token, get_current_user, get_current_admin
from datetime import datetime, timedelta
from fastapi import HTTPException
import os

# Set test environment variables
os.environ["SECRET_KEY"] = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"

def test_create_access_token():
    """Test creating an access token with default expiry"""
    data = {"sub": "test@example.com"}
    token = create_access_token(data)
    assert isinstance(token, str)
    assert len(token) > 0

def test_create_access_token_with_expiry():
    """Test creating an access token with custom expiry"""
    data = {"sub": "test@example.com"}
    expires = timedelta(minutes=30)
    token = create_access_token(data, expires_delta=expires)
    assert isinstance(token, str)
    assert len(token) > 0

@pytest.mark.asyncio
async def test_expired_token(db_session, test_user):
    """Test handling of expired tokens"""
    # Create token that's already expired
    token = create_access_token(
        {"sub": test_user.email},
        expires_delta=timedelta(minutes=-1)
    )
    
    # Test expired token
    with pytest.raises(HTTPException) as exc_info:
        await get_current_user(token, db_session)
    assert exc_info.value.status_code == 401