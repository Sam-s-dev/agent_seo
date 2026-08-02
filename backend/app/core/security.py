import base64
import os
import jwt
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from app.core.config import settings

# HTTP Bearer authentication scheme
security_scheme = HTTPBearer(auto_error=False)

def get_aes_key() -> bytes:
    """Returns a 32-byte key derived from settings.AES_SECRET_KEY."""
    key_bytes = settings.AES_SECRET_KEY.encode()
    if len(key_bytes) >= 32:
        return key_bytes[:32]
    # Pad to 32 bytes if too short
    return key_bytes.ljust(32, b"\0")

def encrypt_password(password: str) -> str:
    """Encrypts a string using AES-256-GCM.
    Returns base64(nonce + ciphertext).
    """
    if not password:
        return ""
    key = get_aes_key()
    aesgcm = AESGCM(key)
    nonce = os.urandom(12)  # 96-bit nonce for AES-GCM
    ciphertext = aesgcm.encrypt(nonce, password.encode(), None)
    return base64.b64encode(nonce + ciphertext).decode()

def decrypt_password(encrypted_str: str) -> str:
    """Decrypts an AES-256-GCM encrypted string.
    Expects base64(nonce + ciphertext).
    """
    if not encrypted_str:
        return ""
    try:
        key = get_aes_key()
        aesgcm = AESGCM(key)
        data = base64.b64decode(encrypted_str.encode())
        if len(data) < 12:
            raise ValueError("Invalid encrypted data length")
        nonce = data[:12]
        ciphertext = data[12:]
        return aesgcm.decrypt(nonce, ciphertext, None).decode()
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"WordPress credentials decryption failed: {str(e)}"
        )

def verify_jwt_token(credentials: HTTPAuthorizationCredentials = Security(security_scheme)) -> dict:
    """Verifies the Supabase JWT token present in the Authorization header."""
    if not credentials:
        raise HTTPException(
            status_code=401,
            detail="Missing Authorization header"
        )
    
    token = credentials.credentials
    try:
        # Supabase JWT signature validation (using HS256 algorithm and Supabase JWT Secret)
        payload = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            options={"verify_aud": False}
        )
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=401, detail=f"Invalid token: {str(e)}")
