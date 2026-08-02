"""
Global middleware stack for RankPilot API.
Implements: Rate Limiting, Audit Logging, Request Size Limiting, Security Headers.
"""
import time
import uuid
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from app.core.rate_limit import get_rate_limiter, get_client_ip
from app.core.config import settings


class RateLimitMiddleware(BaseHTTPMiddleware):
    """Global rate limiting middleware applied to all routes.
    100 requests/minute per IP globally.
    """
    async def dispatch(self, request: Request, call_next):
        ip = get_client_ip(request)
        limiter = get_rate_limiter()
        key = f"rate_limit:global:{ip}"
        
        if not limiter.is_allowed(key, max_requests=100, window_seconds=60):
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please slow down."}
            )
        
        response = await call_next(request)
        return response


class AuditLogMiddleware(BaseHTTPMiddleware):
    """Logs all sensitive actions (POST, PUT, DELETE) for security audit trail.
    In production, these would be written to the audit_logs table via Supabase.
    """
    # In-memory store for testing/dev — in production, write to Supabase audit_logs table
    audit_entries = []
    
    async def dispatch(self, request: Request, call_next):
        # Only log mutating requests
        if request.method in ("POST", "PUT", "DELETE"):
            ip = get_client_ip(request)
            user_agent = request.headers.get("User-Agent", "unknown")
            
            # Extract user_id from JWT if present
            user_id = None
            auth_header = request.headers.get("Authorization", "")
            if auth_header.startswith("Bearer "):
                try:
                    import jwt
                    token = auth_header.split(" ")[1]
                    payload = jwt.decode(
                        token, 
                        settings.SUPABASE_JWT_SECRET, 
                        algorithms=["HS256"],
                        options={"verify_aud": False, "verify_exp": False}
                    )
                    user_id = payload.get("sub")
                except Exception:
                    pass
            
            entry = {
                "id": str(uuid.uuid4()),
                "user_id": user_id,
                "action": f"{request.method} {request.url.path}",
                "ip": ip,
                "user_agent": user_agent,
                "timestamp": time.time()
            }
            self.audit_entries.append(entry)
        
        response = await call_next(request)
        return response


class RequestSizeLimitMiddleware(BaseHTTPMiddleware):
    """Rejects requests larger than 1MB to prevent payload flooding attacks."""
    MAX_SIZE = 1_048_576  # 1MB
    
    async def dispatch(self, request: Request, call_next):
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > self.MAX_SIZE:
            return JSONResponse(
                status_code=413,
                content={"detail": "Request payload too large. Maximum size is 1MB."}
            )
        response = await call_next(request)
        return response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Injects security headers into every API response."""
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["Cache-Control"] = "no-store"
        response.headers["X-Request-ID"] = str(uuid.uuid4())
        return response
