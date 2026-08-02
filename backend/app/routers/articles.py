from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import List, Optional
import datetime
from app.core.security import verify_jwt_token
from app.core.rate_limit import RateLimitDependency

router = APIRouter(prefix="/articles", tags=["articles"])

class ArticleResponse(BaseModel):
    id: str
    site_id: str
    keyword: str
    title: str
    content: str
    meta_title: str
    meta_desc: str
    score: int
    status: str
    created_at: str

class PaginatedArticlesResponse(BaseModel):
    data: List[ArticleResponse]
    next_cursor: Optional[str]
    has_more: bool

# Seed a mock articles database (e.g., 50 articles) for testing cursor-based pagination
MOCK_ARTICLES_DB = []
for i in range(50):
    MOCK_ARTICLES_DB.append({
        "id": f"art-uuid-{50-i:03d}", # art-uuid-050 down to art-uuid-001 (descending order)
        "site_id": "site-uuid-1",
        "keyword": f"seo agent {i}",
        "title": f"How to automate SEO with agent {i}",
        "content": f"Full body content for article {i}...",
        "meta_title": f"Automate SEO {i} | RankPilot",
        "meta_desc": f"Learn how agent {i} ranks websites automatically on Google.",
        "score": 70 + (i % 25),
        "status": "published" if i % 2 == 0 else "draft",
        # Decreasing timestamps
        "created_at": (datetime.datetime.utcnow() - datetime.timedelta(hours=i)).isoformat()
    })

# Rate Limiters
generate_rate_limit = RateLimitDependency(max_requests=10, window_seconds=3600, scope="generate")
publish_rate_limit = RateLimitDependency(max_requests=20, window_seconds=3600, scope="publish")

@router.get("/", response_model=PaginatedArticlesResponse)
async def list_articles(
    cursor: Optional[str] = Query(None, description="The cursor ID of the last item from the previous page"),
    limit: int = Query(20, ge=1, le=50, description="Number of items to retrieve"),
    status: Optional[str] = Query(None, description="Filter articles by status"),
    site_id: Optional[str] = Query(None, description="Filter articles by site_id"),
    user_payload: dict = Depends(verify_jwt_token)
):
    """Retrieves list of articles using cursor-based pagination (descending order of creation)."""
    # In production: query using supabase postgres cursor format:
    # select * from articles where user_id = auth.uid() and created_at < cursor_timestamp order by created_at desc limit 20
    
    # 1. Filter articles
    filtered = MOCK_ARTICLES_DB.copy()
    if status:
        filtered = [a for a in filtered if a["status"] == status]
    if site_id:
        filtered = [a for a in filtered if a["site_id"] == site_id]
        
    # 2. Apply Cursor
    start_idx = 0
    if cursor:
        # Find index of cursor item
        found = False
        for idx, art in enumerate(filtered):
            if art["id"] == cursor:
                start_idx = idx + 1
                found = True
                break
        if not found:
            # If cursor is not found, return empty results (prevent infinite loops)
            return PaginatedArticlesResponse(data=[], next_cursor=None, has_more=False)
            
    # 3. Retrieve Page Slice
    end_idx = start_idx + limit
    page_items = filtered[start_idx:end_idx]
    
    # 4. Check if there are more items
    has_more = end_idx < len(filtered)
    next_cursor = page_items[-1]["id"] if (has_more and page_items) else None
    
    return PaginatedArticlesResponse(
        data=[ArticleResponse(**a) for a in page_items],
        next_cursor=next_cursor,
        has_more=has_more
    )

@router.post("/generate", dependencies=[Depends(generate_rate_limit)])
async def trigger_generation(keyword: str, site_id: str, user_payload: dict = Depends(verify_jwt_token)):
    """Triggers autonomous article generation (mocked)."""
    # AI Generation Orchestration logic
    return {
        "status": "success",
        "message": f"SEO Article generation started for keyword '{keyword}'",
        "task_id": "job-uuid-generation-999"
    }

@router.post("/publish/{article_id}", dependencies=[Depends(publish_rate_limit)])
async def publish_article(article_id: str, user_payload: dict = Depends(verify_jwt_token)):
    """Publishes a drafted article to WordPress (mocked)."""
    # Locate article
    article = next((a for a in MOCK_ARTICLES_DB if a["id"] == article_id), None)
    if not article:
        raise HTTPException(status_code=404, detail="Article not found")
        
    # Mark as published
    article["status"] = "published"
    article["wp_post_id"] = 1234
    
    return {
        "status": "success",
        "article_id": article_id,
        "wp_post_id": 1234,
        "message": "Article successfully published to WordPress."
    }
