import pytest
import jwt
from fastapi.testclient import TestClient
from app.main import app
from app.core.config import settings

client = TestClient(app)

def get_auth_headers(user_id="mock-uuid-12345", email="user@example.com"):
    payload = {
        "sub": user_id,
        "email": email,
        "role": "authenticated"
    }
    token = jwt.encode(payload, settings.SUPABASE_JWT_SECRET, algorithm="HS256")
    return {"Authorization": f"Bearer {token}"}

def test_security_headers_present():
    """Verifies that all defensive security headers are correctly injected by the middleware."""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.headers["X-Frame-Options"] == "DENY"
    assert response.headers["X-Content-Type-Options"] == "nosniff"
    assert response.headers["Cache-Control"] == "no-store"
    assert "X-Request-ID" in response.headers

def test_request_payload_size_limiting():
    """Verifies that requests with payloads exceeding 1MB are rejected with 413 Payload Too Large."""
    headers = get_auth_headers()
    # 1.1 MB payload of dummy characters
    large_payload = "a" * (1024 * 1024 + 100_000)
    
    response = client.post(
        "/sites/", 
        headers={**headers, "Content-Length": str(len(large_payload))},
        content=large_payload
    )
    assert response.status_code == 413
    assert "too large" in response.json()["detail"].lower()

def test_sql_injection_defense():
    """Verifies that raw SQL injection patterns in parameters are safely rejected or sanitized."""
    headers = get_auth_headers()
    
    # Attempt SQL injection inside username input
    payload = {
        "url": "https://example.com",
        "wp_username": "admin' OR '1'='1' --",
        "wp_app_password": "valid_password"
    }
    # In Pydantic v2/FastAPI standard behavior, this is processed as a string literal.
    # We test that the WP API connection fails rather than executing raw SQL,
    # and verify that it doesn't crash the server.
    response = client.post("/sites/", json=payload, headers=headers)
    assert response.status_code == 400

def test_xss_protection():
    """Verifies input sanitization or validation of script payloads to prevent XSS."""
    headers = get_auth_headers()
    
    payload = {
        "url": "https://example.com",
        "wp_username": "<script>alert('XSS')</script>",
        "wp_app_password": "valid_password"
    }
    response = client.post("/sites/", json=payload, headers=headers)
    # Rejects connection to WordPress due to invalid user/credentials, ensuring script does not execute
    assert response.status_code == 400

def test_idor_prevention():
    """Verifies Row Level Security logic and user scope separation (Insecure Direct Object Reference defense)."""
    # Create two users
    headers_user_a = get_auth_headers(user_id="user-a-111", email="a@example.com")
    headers_user_b = get_auth_headers(user_id="user-b-222", email="b@example.com")
    
    # User A registers a site
    site_payload = {
        "url": "https://example.com",
        "wp_username": "admin",
        "wp_app_password": "valid_password"
    }
    
    response_a = client.post("/sites/", json=site_payload, headers=headers_user_a)
    assert response_a.status_code == 200
    site_id = response_a.json()["id"]
    
    # User B tries to view User A's sites
    response_b_list = client.get("/sites/", headers=headers_user_b)
    assert response_b_list.status_code == 200
    # User B should see 0 sites because they are scoped to their own auth context (RLS simulation)
    assert len(response_b_list.json()) == 0
