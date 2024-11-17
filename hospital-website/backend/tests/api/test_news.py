import pytest

def test_read_news(client):
    response = client.get("/api/news")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_news_article(client, admin_token):
    article_data = {
        "title": "Test Article",
        "content": "Test content",
        "summary": "Test summary",
        "category": "Test",
        "image_url": "https://test.com/image.jpg"
    }
    
    response = client.post(
        "/api/news",
        json=article_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    assert response.status_code == 200
    assert response.json()["title"] == article_data["title"]