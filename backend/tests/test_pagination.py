import pytest
import jwt
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)

def get_auth_headers():
    payload = {
        "sub": "mock-uuid-12345",
        "email": "user@example.com",
        "role": "authenticated"
    }
    token = jwt.encode(payload, settings.SUPABASE_JWT_SECRET, algorithm="HS256")
    return {"Authorization": f"Bearer {token}"}

def test_articles_cursor_pagination_page_1(test_env):
    """Tests cursor-based pagination returns first page with correct limit and has_more flag."""
    headers = get_auth_headers()
    
    # Fetch first page (default limit 20)
    response = client.get("/articles/?limit=20", headers=headers)
    assert response.status_code == 200
    res_data = response.json()
    
    assert "data" in res_data
    assert "next_cursor" in res_data
    assert "has_more" in res_data
    
    # 20 items returned
    assert len(res_data["data"]) == 20
    assert res_data["has_more"] is True
    assert res_data["next_cursor"] == res_data["data"][-1]["id"]
    
    # Verify order (descending ID/created_at)
    assert res_data["data"][0]["id"] == "art-uuid-050"
    assert res_data["data"][-1]["id"] == "art-uuid-031"

def test_articles_cursor_pagination_page_2(test_env):
    """Tests fetching page 2 using the next_cursor from page 1."""
    headers = get_auth_headers()
    
    # 1. Fetch Page 1
    p1_response = client.get("/articles/?limit=10", headers=headers)
    p1_data = p1_response.json()
    cursor = p1_data["next_cursor"]
    assert cursor == "art-uuid-041"
    
    # 2. Fetch Page 2 using cursor
    p2_response = client.get(f"/articles/?limit=10&cursor={cursor}", headers=headers)
    assert p2_response.status_code == 200
    p2_data = p2_response.json()
    
    # Verify page 2 starts exactly after cursor
    assert len(p2_data["data"]) == 10
    assert p2_data["data"][0]["id"] == "art-uuid-040"
    assert p2_data["data"][-1]["id"] == "art-uuid-031"
    assert p2_data["next_cursor"] == "art-uuid-031"
    assert p2_data["has_more"] is True

def test_articles_pagination_out_of_bounds_limit(test_env):
    """Tests that a limit > 50 returns validation error (FastAPI validation check)."""
    headers = get_auth_headers()
    response = client.get("/articles/?limit=100", headers=headers)
    # FastAPI returns 422 Unprocessable Entity for parameter validation failures
    assert response.status_code == 422

def test_articles_pagination_filtering(test_env):
    """Tests that filtering by status works correctly combined with pagination."""
    headers = get_auth_headers()
    
    # Filter by draft status
    response = client.get("/articles/?status=draft&limit=10", headers=headers)
    assert response.status_code == 200
    res_data = response.json()
    
    for article in res_data["data"]:
        assert article["status"] == "draft"
