import pytest

def test_user_signup(client):
    user_data = {
        "email": "test@example.com",
        "password": "testpass123",
        "name": "Test User"
    }
    response = client.post("/api/auth/signup", json=user_data)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == user_data["email"]

def test_user_login(client):
    # First create a user
    user_data = {
        "email": "test@example.com",
        "password": "testpass123",
        "name": "Test User"
    }
    client.post("/api/auth/signup", json=user_data)
    
    # Then try to login
    login_data = {
        "username": "test@example.com",
        "password": "testpass123"
    }
    response = client.post("/api/auth/login", data=login_data)
    assert response.status_code == 200
    assert "access_token" in response.json()