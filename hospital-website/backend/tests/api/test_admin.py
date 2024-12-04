import pytest
from datetime import datetime, timedelta

def test_admin_login(client):
    login_data = {
        "username": "testadmin",
        "password": "testpass123"
    }
    response = client.post("/api/admin/login", json=login_data)
    assert response.status_code == 401  # Unauthorized because admin doesn't exist yet

def test_get_all_news_articles(client, admin_token):
    response = client.get(
        "/api/admin/news",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200  # Should return empty list if no articles
    data = response.json()
    assert "items" in data
    assert "total" in data