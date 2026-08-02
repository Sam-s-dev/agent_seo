import os
from typing import Optional

from app.core.config import settings


def get_supabase_client(token: Optional[str] = None):
    """Returns a Supabase client.
    If a user JWT token is provided, it is forwarded in the headers so that
    Row Level Security (RLS) policies are correctly evaluated in Supabase.
    
    Note: supabase-py is optional for MVP. When installed, uncomment the import.
    For now, this module serves as an abstraction layer.
    """
    # from supabase import create_client, Client
    # headers = {}
    # if token:
    #     headers["Authorization"] = f"Bearer {token}"
    # return create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
    return {"url": settings.SUPABASE_URL, "token": token}


def get_service_role_client():
    """Returns a Supabase client with admin service role permissions.
    WARNING: This bypasses RLS. Use ONLY in trusted backend cron jobs or administrative tasks.
    """
    service_key = os.getenv("SUPABASE_SERVICE_ROLE_KEY", settings.SUPABASE_ANON_KEY)
    # from supabase import create_client
    # return create_client(settings.SUPABASE_URL, service_key)
    return {"url": settings.SUPABASE_URL, "service_key": service_key}
