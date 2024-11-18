import pytest

@pytest.fixture
def test_user_data():
    return {
        "email": "test@example.com",
        "password": "testpass123",
        "name": "Test User",
        "phone": "1234567890"
    }

def test_user_refresh_token(client, test_user_refresh_token):
    """Test refreshing user access token"""
    response = client.post(
        "/api/auth/refresh",
        json={"refresh_token": test_user_refresh_token.token}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"
    assert data["refresh_token"] != test_user_refresh_token.token  # New token generated

def test_admin_refresh_token(client, test_admin_refresh_token):
    """Test refreshing admin access token"""
    response = client.post(
        "/api/auth/refresh",
        json={"refresh_token": test_admin_refresh_token.token}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert "refresh_token" in data
    assert data["token_type"] == "bearer"
    assert data["refresh_token"] != test_admin_refresh_token.token  # New token generated

def test_expired_refresh_token(client, expired_refresh_token):
    """Test using expired refresh token"""
    response = client.post(
        "/api/auth/refresh",
        json={"refresh_token": expired_refresh_token.token}
    )
    assert response.status_code == 401
    assert "expired" in response.json()["detail"].lower()

def test_invalid_refresh_token(client):
    """Test using invalid refresh token"""
    response = client.post(
        "/api/auth/refresh",
        json={"refresh_token": "invalid_token"}
    )
    assert response.status_code == 401
    assert "invalid" in response.json()["detail"].lower()