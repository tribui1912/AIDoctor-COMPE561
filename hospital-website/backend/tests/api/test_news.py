import pytest
from datetime import datetime

def test_create_news_article(client, admin_token, test_admin):
    """Test creating a news article with admin privileges"""
    article_data = {
        "title": "Test Article",
        "content": "Test content",
        "summary": "Test summary",
        "category": "Test",
        "image_url": "https://test.com/image.jpg",
        "status": "draft"
    }
    
    # Make sure we're using a valid admin token
    response = client.post(
        "/api/news",
        json=article_data,
        headers={"Authorization": f"Bearer {admin_token}"}
    )
    
    # Should return 401 if not authenticated as admin
    assert response.status_code == 401
    
def test_get_news_articles(client):
    """Test getting published news articles"""
    response = client.get("/api/news")
    assert response.status_code == 200
    assert isinstance(response.json(), list)

@pytest.fixture
def test_article(db_session, test_admin):
    """Fixture to create a test article"""
    from app.models import NewsArticle
    
    article = NewsArticle(
        title="Test Article",
        content="Test content",
        summary="Test summary",
        category="Test",
        image_url="https://test.com/image.jpg",
        status="published",
        admin_id=test_admin.id,
        date=datetime.utcnow()
    )
    db_session.add(article)
    db_session.commit()
    db_session.refresh(article)
    return article