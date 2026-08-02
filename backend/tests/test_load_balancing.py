import pytest
import time
from fastapi.testclient import TestClient
from app.main import app
import app.main as main_module
from app.core.rate_limit import InMemoryRateLimiter, RedisRateLimiter, get_client_ip
from fastapi import Request

client = TestClient(app)

def test_load_balancer_health_check_and_failover():
    """Simulates load balancer checking health.
    If database drops (DB_HEALTHY = False), the instance must return 503 so
    the Load Balancer can remove it from rotation and route traffic to healthy instances.
    """
    # 1. Normal state (Healthy)
    main_module.DB_HEALTHY = True
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"
    
    # 2. Simulated Database Outage (Unhealthy)
    main_module.DB_HEALTHY = False
    response = client.get("/health")
    assert response.status_code == 503
    assert response.json()["status"] == "unhealthy"
    
    # Reset
    main_module.DB_HEALTHY = True

def test_client_ip_resolution_through_load_balancer():
    """Verifies that the rate limiter extracts the correct client IP from X-Forwarded-For
    rather than the load balancer's proxy IP.
    """
    # Simulating request passing through a load balancer
    class MockRequest:
        def __init__(self, headers, client_host="127.0.0.1"):
            self.headers = headers
            class MockClient:
                def __init__(self, host):
                    self.host = host
            self.client = MockClient(client_host)

    # Scenario A: Direct request (no proxy)
    req_direct = MockRequest(headers={})
    assert get_client_ip(req_direct) == "127.0.0.1"

    # Scenario B: Single proxy load balancer
    req_single_proxy = MockRequest(headers={"X-Forwarded-For": "203.0.113.195"})
    assert get_client_ip(req_single_proxy) == "203.0.113.195"

    # Scenario C: Multi-tier proxy chain (Client IP, Proxy 1 IP, Proxy 2 IP)
    req_multi_proxy = MockRequest(headers={"X-Forwarded-For": "203.0.113.195, 198.51.100.10, 192.0.2.1"})
    assert get_client_ip(req_multi_proxy) == "203.0.113.195"

class MockRedisClient:
    """Mock Redis client to simulate a shared Redis database state
    used by multiple server instances behind a load balancer.
    """
    def __init__(self):
        # Format: { key: { score_member_str: score_float } }
        self.db = {}

    def pipeline(self):
        return MockRedisPipeline(self)

class MockRedisPipeline:
    def __init__(self, redis_mock):
        self.redis = redis_mock
        self.commands = []

    def zremrangebyscore(self, key, min_val, max_val):
        self.commands.append(("zremrangebyscore", key, min_val, max_val))
        return self

    def zadd(self, key, mapping):
        self.commands.append(("zadd", key, mapping))
        return self

    def zcard(self, key):
        self.commands.append(("zcard", key))
        return self

    def expire(self, key, seconds):
        self.commands.append(("expire", key, seconds))
        return self

    def execute(self):
        results = []
        for cmd in self.commands:
            action = cmd[0]
            if action == "zremrangebyscore":
                key, min_val, max_val = cmd[1], cmd[2], cmd[3]
                if key in self.redis.db:
                    self.redis.db[key] = {k: v for k, v in self.redis.db[key].items() if not (min_val <= v <= max_val)}
                results.append(0) # Mock return count of removed items
            elif action == "zadd":
                key, mapping = cmd[1], cmd[2]
                if key not in self.redis.db:
                    self.redis.db[key] = {}
                self.redis.db[key].update(mapping)
                results.append(len(mapping))
            elif action == "zcard":
                key = cmd[1]
                count = len(self.redis.db.get(key, {}))
                results.append(count)
            elif action == "expire":
                results.append(True)
        return results

def test_synchronized_rate_limiting_across_backend_instances():
    """Simulates a load-balanced system with multiple backend instances.
    It verifies that rate limit state is synchronized across instances using the shared store.
    """
    # Create a shared mock database state
    shared_redis_mock = MockRedisClient()

    # Instance A and Instance B represent two separate FastAPI processes behind a Load Balancer
    # Both share the same Redis backplane.
    instance_a_limiter = RedisRateLimiter("redis://localhost:6379")
    instance_b_limiter = RedisRateLimiter("redis://localhost:6379")

    # Inject the shared Redis mock client into both limiters
    instance_a_limiter.client = shared_redis_mock
    instance_b_limiter.client = shared_redis_mock

    # Define rate limit: max 3 requests in a 10-second window
    limit_key = "rate_limit:global:203.0.113.195"
    max_reqs = 3
    window = 10

    # 1. First request hits Instance A
    assert instance_a_limiter.is_allowed(limit_key, max_reqs, window) is True

    # 2. Second request hits Instance B (different server, but shared state!)
    assert instance_b_limiter.is_allowed(limit_key, max_reqs, window) is True

    # 3. Third request hits Instance A
    assert instance_a_limiter.is_allowed(limit_key, max_reqs, window) is True

    # 4. Fourth request hits Instance B. It should be BLOCKED because the limit is 3.
    assert instance_b_limiter.is_allowed(limit_key, max_reqs, window) is False
