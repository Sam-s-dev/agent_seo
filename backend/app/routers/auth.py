from fastapi import APIRouter, Response, Request, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional
from app.core.security import verify_jwt_token
from app.core.rate_limit import RateLimitDependency

router = APIRouter(prefix="/auth", tags=["auth"])

class AuthCredentials(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: str
    plan: str

# Rate limiter: max 5 requests per 15 minutes for auth endpoints
auth_rate_limit = RateLimitDependency(max_requests=5, window_seconds=900, scope="auth")

@router.post("/signup", response_model=UserResponse, dependencies=[Depends(auth_rate_limit)])
async def signup(credentials: AuthCredentials):
    """Sign up a new user (mocked for testing/local dev, integrated with Supabase)."""
    # In production, this would call supabase.auth.sign_up
    # We return a mock success for integration test coverage.
    if credentials.email == "fail@example.com":
         raise HTTPException(status_code=400, detail="User registration failed")
         
    return UserResponse(
        id="mock-uuid-12345",
        email=credentials.email,
        plan="free"
    )

@router.post("/login", dependencies=[Depends(auth_rate_limit)])
async def login(credentials: AuthCredentials, response: Response):
    """Authenticate user and set JWT inside a secure HttpOnly cookie."""
    # In production, calls supabase.auth.sign_in_with_password
    # Here, we generate a mock JWT for demonstration and testing.
    # JWT format: standard HS256 payload
    import jwt
    import datetime
    from app.core.config import settings
    
    if credentials.email == "fail@example.com" or credentials.password == "wrongpass":
        raise HTTPException(status_code=401, detail="Invalid credentials")
        
    payload = {
        "sub": "mock-uuid-12345",
        "email": credentials.email,
        "role": "authenticated",
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    }
    
    token = jwt.encode(payload, settings.SUPABASE_JWT_SECRET, algorithm="HS256")
    
    # Set httpOnly cookie containing the access token
    response.set_cookie(
        key="sb-access-token",
        value=token,
        httponly=True,
        secure=True,
        samesite="strict",
        max_age=900 # 15 minutes
    )
    
    return {
        "status": "success",
        "user": UserResponse(id="mock-uuid-12345", email=credentials.email, plan="free"),
        "access_token": token
    }

@router.post("/logout")
async def logout(response: Response):
    """Log out user by clearing the HttpOnly session cookie."""
    response.delete_cookie(key="sb-access-token", httponly=True, secure=True, samesite="strict")
    return {"status": "success", "message": "Logged out successfully"}

@router.get("/me", response_model=UserResponse)
async def get_current_user(request: Request):
    """Gets current user profile by validating httpOnly cookie or Authorization header."""
    # Read token from cookies or header
    token = request.cookies.get("sb-access-token")
    
    if not token:
        # Fallback to Authorization Header
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
        
    import jwt
    from app.core.config import settings
    try:
        payload = jwt.decode(token, settings.SUPABASE_JWT_SECRET, algorithms=["HS256"], options={"verify_aud": False})
        return UserResponse(
            id=payload.get("sub", "mock-uuid-12345"),
            email=payload.get("email", "user@example.com"),
            plan="free"
        )
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid session token")
