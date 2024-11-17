import pytest
from datetime import datetime, timedelta

def test_admin_login(client, test_admin):
    login_data = {
        "username": "testadmin",
        "password": "testpass123"
    }
    response = client.post("/api/admin/login", json=login_data)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"

def test_admin_login_invalid_credentials(client):
    login_data = {
        "username": "wrongadmin",
        "password": "wrongpass"
    }
    response = client.post("/api/admin/login", json=login_data)
    assert response.status_code == 401
    assert "Incorrect username or password" in response.json()["detail"]

def test_get_all_news_articles(client, admin_token):
    response = client.get(
        "/api/admin/news",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert "total" in data
    assert "skip" in data
    assert "limit" in data

def test_create_news_article(client, admin_token):
    article_data = {
        "title": "Test Article",
        "content": "Test content",
        "summary": "Test summary",
        "category": "Test",
        "image_url": "https://test.com/image.jpg",
        "status": "draft"
    }
    
    response = client.post(
        "/api/admin/news",
        json=article_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == article_data["title"]
    assert data["status"] == "draft"

def test_update_news_article(client, admin_token):
    # First create an article
    article_data = {
        "title": "Original Title",
        "content": "Original content",
        "summary": "Original summary",
        "category": "Test",
        "image_url": "https://test.com/image.jpg"
    }
    
    create_response = client.post(
        "/api/admin/news",
        json=article_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    article_id = create_response.json()["id"]
    
    # Then update it
    update_data = {
        "title": "Updated Title",
        "content": "Updated content"
    }
    
    response = client.patch(
        f"/api/admin/news/{article_id}",
        json=update_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Updated Title"
    assert data["content"] == "Updated content"

def test_delete_news_article(client, admin_token):
    # First create an article
    article_data = {
        "title": "Article to Delete",
        "content": "Content to delete",
        "summary": "Summary",
        "category": "Test",
        "image_url": "https://test.com/image.jpg"
    }
    
    create_response = client.post(
        "/api/admin/news",
        json=article_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    article_id = create_response.json()["id"]
    
    # Then delete it
    response = client.delete(
        f"/api/admin/news/{article_id}",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    
    # Verify it's deleted
    get_response = client.get(
        f"/api/admin/news/{article_id}",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert get_response.status_code == 404

def test_manage_appointments(client, admin_token):
    # Create test appointment
    appointment_data = {
        "date": (datetime.utcnow() + timedelta(days=1)).isoformat(),
        "reason": "Test appointment",
        "user_id": 1,
        "status": "pending"
    }
    
    create_response = client.post(
        "/api/appointments",
        json=appointment_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    appointment_id = create_response.json()["id"]
    
    # Update appointment status
    update_data = {
        "status": "confirmed"
    }
    
    response = client.patch(
        f"/api/admin/appointments/{appointment_id}",
        json=update_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    assert response.json()["status"] == "confirmed"

def test_admin_permissions(client, admin_token):
    response = client.get(
        "/api/admin/permissions",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data["permissions"], dict)

def test_unauthorized_admin_access(client):
    response = client.get("/api/admin/news")
    assert response.status_code == 401
    assert "Not authenticated" in response.json()["detail"]

def test_admin_dashboard_stats(client, admin_token):
    response = client.get(
        "/api/admin/dashboard/stats",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert "total_users" in data
    assert "total_appointments" in data
    assert "total_articles" in data

def test_admin_profile_update(client, admin_token):
    update_data = {
        "email": "newemail@test.com",
        "role": "super_admin"
    }
    
    response = client.patch(
        "/api/admin/profile",
        json=update_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == update_data["email"]
    assert data["role"] == update_data["role"]

def test_create_sub_admin(client, admin_token):
    sub_admin_data = {
        "username": "subadmin",
        "email": "subadmin@test.com",
        "password": "subadmin123",
        "role": "editor",
        "permissions": {
            "news": ["read", "create"],
            "appointments": ["read"]
        }
    }
    
    response = client.post(
        "/api/admin/create",
        json=sub_admin_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["username"] == sub_admin_data["username"]
    assert data["role"] == "editor"

def test_admin_audit_log(client, admin_token):
    response = client.get(
        "/api/admin/audit-log",
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    if len(data) > 0:
        assert "action" in data[0]
        assert "timestamp" in data[0]
        assert "admin_id" in data[0]