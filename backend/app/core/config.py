import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    APP_ENV: str = "development"
    
    # Supabase configurations
    SUPABASE_URL: str = "https://your-supabase-project.supabase.co"
    SUPABASE_ANON_KEY: str = "your-supabase-anon-key"
    SUPABASE_JWT_SECRET: str = "your-supabase-jwt-secret-very-long-and-secure"
    
    # Encryption key for WordPress App Passwords (must be 32 bytes base64-encoded or a strong string of 32 characters)
    # Default is a 32-byte key for local development
    AES_SECRET_KEY: str = "zJ4w8e9rT0y2u1i3o4p5a6s7d8f9g0hJ" 
    
    # Redis configuration for shared rate limiting (load balancing)
    REDIS_URL: Optional[str] = None
    
    # WordPress configuration (for testing/validation)
    WP_TEST_TIMEOUT: int = 10  # seconds
    
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
