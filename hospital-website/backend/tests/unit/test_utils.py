import pytest
from app.auth_utils import create_access_token, verify_password
from datetime import timedelta

def test_create_access_token():
    token = create_access_token({"sub": "test@example.com"})
    assert isinstance(token, str)
    
def test_create_access_token_with_expiry():
    token = create_access_token(
        {"sub": "test@example.com"}, 
        expires_delta=timedelta(minutes=30)
    )
    assert isinstance(token, str)