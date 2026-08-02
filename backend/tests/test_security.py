import pytest
import jwt
import datetime
from fastapi import HTTPException
from app.core.config import settings
from app.core.security import (
    encrypt_password, 
    decrypt_password, 
    verify_jwt_token, 
    HTTPAuthorizationCredentials
)

def test_aes_encryption_decryption(test_env):
    """Verifies that strings are encrypted with AES-256-GCM and decrypted correctly."""
    original_password = "wp_secure_app_password_123"
    
    # Encrypt password
    encrypted = encrypt_password(original_password)
    assert encrypted != original_password
    assert len(encrypted) > 0
    
    # Decrypt password
    decrypted = decrypt_password(encrypted)
    assert decrypted == original_password

def test_aes_decryption_with_bad_data(test_env):
    """Verifies decryption of invalid ciphertext raises exception."""
    with pytest.raises(HTTPException) as exc_info:
        decrypt_password("invalid_base64_data_or_too_short")
    assert exc_info.value.status_code == 500

def test_jwt_verification_valid(test_env):
    """Verifies that valid JWT tokens are correctly authenticated."""
    payload = {
        "sub": "user-uuid-1",
        "email": "user@example.com",
        "role": "authenticated",
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=15)
    }
    token = jwt.encode(payload, settings.SUPABASE_JWT_SECRET, algorithm="HS256")
    
    credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
    decoded = verify_jwt_token(credentials)
    
    assert decoded["sub"] == "user-uuid-1"
    assert decoded["email"] == "user@example.com"

def test_jwt_verification_expired(test_env):
    """Verifies that expired JWT tokens are rejected."""
    payload = {
        "sub": "user-uuid-1",
        "email": "user@example.com",
        "role": "authenticated",
        # Expired in past
        "exp": datetime.datetime.utcnow() - datetime.timedelta(minutes=15)
    }
    token = jwt.encode(payload, settings.SUPABASE_JWT_SECRET, algorithm="HS256")
    credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
    
    with pytest.raises(HTTPException) as exc_info:
        verify_jwt_token(credentials)
    assert exc_info.value.status_code == 401
    assert "expired" in exc_info.value.detail.lower()

def test_jwt_verification_invalid(test_env):
    """Verifies that invalid signature JWT tokens are rejected."""
    payload = {
        "sub": "user-uuid-1",
        "email": "user@example.com"
    }
    # Sign with a completely different secret key
    token = jwt.encode(payload, "wrong-secret-key", algorithm="HS256")
    credentials = HTTPAuthorizationCredentials(scheme="Bearer", credentials=token)
    
    with pytest.raises(HTTPException) as exc_info:
        verify_jwt_token(credentials)
    assert exc_info.value.status_code == 401
    assert "invalid token" in exc_info.value.detail.lower()
