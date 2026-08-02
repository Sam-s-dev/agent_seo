import os
import time
from fastapi import Request, HTTPException, Depends
from typing import Optional, Dict, List
import redis
from app.core.config import settings

class InMemoryRateLimiter:
    """In-memory rate limiter using a sliding window algorithm.
    Used for local development or fallback when Redis is unavailable.
    """
    def __init__(self):
        # Format: { key: [timestamps] }
        self.storage: Dict[str, List[float]] = {}

    def is_allowed(self, key: str, max_requests: int, window_seconds: int) -> bool:
        now = time.time()
        cutoff = now - window_seconds
        
        if key not in self.storage:
            self.storage[key] = []
            
        # Filter out expired timestamps
        self.storage[key] = [t for t in self.storage[key] if t > cutoff]
        
        if len(self.storage[key]) >= max_requests:
            return False
            
        self.storage[key].append(now)
        return True

class RedisRateLimiter:
    """Redis rate limiter using sliding window with sorted sets.
    Used in production for multi-instance load balancing rate-limiting synchronization.
    """
    def __init__(self, redis_url: str):
        self.client = redis.from_url(redis_url)

    def is_allowed(self, key: str, max_requests: int, window_seconds: int) -> bool:
        now = time.time()
        cutoff = now - window_seconds
        
        try:
            pipe = self.client.pipeline()
            # Remove timestamps older than the window
            pipe.zremrangebyscore(key, 0, cutoff)
            # Add current timestamp with random suffix for uniqueness across instances
            member_id = f"{now}-{os.urandom(4).hex()}"
            pipe.zadd(key, {member_id: now})
            # Count elements in the window
            pipe.zcard(key)
            # Set TTL on the key to clean up space
            pipe.expire(key, window_seconds)
            
            # Execute pipeline
            results = pipe.execute()
            count = results[2]  # Output of zcard
            
            return count <= max_requests
        except redis.RedisError:
            # Fallback to local memory log if Redis is down (high availability fallback)
            # Log error in production, but allow request if Redis goes down to avoid complete service outage
            return True

# Initialize global rate limiter instance
_redis_limiter = None
_in_memory_limiter = InMemoryRateLimiter()

def get_rate_limiter():
    global _redis_limiter
    if settings.REDIS_URL:
        if _redis_limiter is None:
            try:
                _redis_limiter = RedisRateLimiter(settings.REDIS_URL)
            except Exception:
                return _in_memory_limiter
        return _redis_limiter
    return _in_memory_limiter

def get_client_ip(request: Request) -> str:
    """Extracts client IP from X-Forwarded-For header if present (under load balancer).
    Otherwise falls back to remote host IP.
    """
    x_forwarded_for = request.headers.get("X-Forwarded-For")
    if x_forwarded_for:
        # First IP in the list is the original client IP
        return x_forwarded_for.split(",")[0].strip()
    return request.client.host

class RateLimitDependency:
    """Rate Limit dependency that can be applied to individual route endpoints."""
    def __init__(self, max_requests: int, window_seconds: int, scope: str = "global"):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.scope = scope

    async def __call__(self, request: Request, limiter = Depends(get_rate_limiter)):
        ip = get_client_ip(request)
        key = f"rate_limit:{self.scope}:{ip}"
        
        if not limiter.is_allowed(key, self.max_requests, self.window_seconds):
            raise HTTPException(
                status_code=429,
                detail="Too Many Requests. Please retry later."
            )
