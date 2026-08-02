from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.routers import auth, sites, articles
from app.core.config import settings
from app.core.middleware import (
    RateLimitMiddleware,
    AuditLogMiddleware,
    RequestSizeLimitMiddleware,
    SecurityHeadersMiddleware
)

app = FastAPI(
    title="RankPilot Core API",
    description="Autonomous AI-powered SEO Agent Backend API - Highly Secured",
    version="1.0.0"
)

# Strict CORS configuration
origins = [
    "http://localhost:3000",  # Next.js development
    "https://rankpilot.vercel.app",  # Production URL
]

# Note: Middlewares execute in reverse order of addition for response phase,
# but normal order for request phase.
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(AuditLogMiddleware)
app.add_middleware(RateLimitMiddleware)
app.add_middleware(RequestSizeLimitMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if settings.APP_ENV == "production" else ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-CSRF-Token"],
)

# Register route modules
app.include_router(auth.router)
app.include_router(sites.router)
app.include_router(articles.router)

# Database connection state for Health check mock
# In production, this would attempt a simple "SELECT 1" on Supabase/Postgres
DB_HEALTHY = True

@app.get("/")
async def root():
    """Welcome root endpoint."""
    return {
        "message": "Welcome to RankPilot Core API",
        "status": "online",
        "documentation": "/docs",
        "health": "/health"
    }

@app.get("/health", tags=["system"])
async def health_check():
    """System Health Check endpoint.
    Used by the Load Balancer to perform health checks and automatic failover.
    Returns 503 if any vital dependencies (e.g. database) are down.
    """
    global DB_HEALTHY
    if not DB_HEALTHY:
        return JSONResponse(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            content={"status": "unhealthy", "database": "disconnected"}
        )
    return {"status": "healthy", "database": "connected", "environment": settings.APP_ENV}

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global error handler. Sanitizes errors before exposing to client (prevents information leaks)."""
    # Log exception in actual logger
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "An internal server error occurred. Please contact support."}
    )
