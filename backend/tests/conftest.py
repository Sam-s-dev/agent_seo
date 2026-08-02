import sys
import os
import pytest

# Ensure the backend directory is in the path for testing imports
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

@pytest.fixture
def test_env():
    """Sets testing environment variables."""
    os.environ["APP_ENV"] = "testing"
    os.environ["SUPABASE_JWT_SECRET"] = "test-jwt-secret-very-long-and-secure-12345"
    os.environ["AES_SECRET_KEY"] = "test-aes-key-must-be-32-chars-long"
