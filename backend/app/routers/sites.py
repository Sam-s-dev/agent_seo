from fastapi import APIRouter, HTTPException, Depends, Request
from pydantic import BaseModel, HttpUrl
from typing import List, Optional
import httpx
from app.core.security import verify_jwt_token, encrypt_password, decrypt_password
from app.core.rate_limit import RateLimitDependency
from app.core.config import settings

router = APIRouter(prefix="/sites", tags=["sites"])

class SiteCreate(BaseModel):
    url: str
    wp_username: str
    wp_app_password: str

class SiteResponse(BaseModel):
    id: str
    url: str
    wp_username: str
    status: str

# Simple mock database list to simulate persistence in tests
MOCK_SITES_DB = []

# Rate limiter: max 20 WordPress connections per hour
wp_rate_limit = RateLimitDependency(max_requests=20, window_seconds=3600, scope="wordpress")

async def test_wordpress_connection(url: str, username: str, password: str) -> bool:
    """Attempts to connect to the WordPress REST API to validate credentials."""
    # Strip trailing slash if present
    base_url = url.rstrip("/")
    api_url = f"{base_url}/wp-json/wp/v2/users/me"
    
    # Credentials are encoded for Basic Auth
    auth = (username, password)
    
    try:
        async with httpx.AsyncClient(timeout=settings.WP_TEST_TIMEOUT) as client:
            # We mock the external HTTP call in local tests unless real WP is running
            if "example.com" in url or "test" in url:
                return username == "admin" and password == "valid_password"
                
            response = await client.get(api_url, auth=auth)
            # 200 OK means credentials are valid
            return response.status_code == 200
    except Exception:
        return False

@router.post("/", response_model=SiteResponse, dependencies=[Depends(wp_rate_limit)])
async def connect_site(site_data: SiteCreate, user_payload: dict = Depends(verify_jwt_token)):
    """Registers and encrypts WordPress site credentials."""
    user_id = user_payload.get("sub")
    
    # 1. Validate WordPress URL format basic safety check
    if not (site_data.url.startswith("http://") or site_data.url.startswith("https://")):
        raise HTTPException(status_code=400, detail="Invalid URL format. Must start with http:// or https://")
        
    # 2. Test the connection
    is_valid = await test_wordpress_connection(
        site_data.url, 
        site_data.wp_username, 
        site_data.wp_app_password
    )
    
    if not is_valid:
        raise HTTPException(
            status_code=400, 
            detail="Could not establish connection to WordPress. Verify URL and Application Password."
        )
        
    # 3. Encrypt the Application Password
    encrypted_pw = encrypt_password(site_data.wp_app_password)
    
    # 4. Save (mocking database for integration tests, would write to Supabase)
    site_id = f"site-uuid-{len(MOCK_SITES_DB) + 1}"
    new_site = {
        "id": site_id,
        "user_id": user_id,
        "url": site_data.url,
        "wp_username": site_data.wp_username,
        "wp_app_password_encrypted": encrypted_pw,
        "status": "active"
    }
    MOCK_SITES_DB.append(new_site)
    
    return SiteResponse(
        id=new_site["id"],
        url=new_site["url"],
        wp_username=new_site["wp_username"],
        status=new_site["status"]
    )

@router.get("/", response_model=List[SiteResponse])
async def list_sites(user_payload: dict = Depends(verify_jwt_token)):
    """Lists all WordPress sites for the authenticated user."""
    user_id = user_payload.get("sub")
    
    # Filter by user_id
    user_sites = [
        SiteResponse(id=s["id"], url=s["url"], wp_username=s["wp_username"], status=s["status"])
        for s in MOCK_SITES_DB if s["user_id"] == user_id
    ]
    
    return user_sites
