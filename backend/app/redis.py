import redis.asyncio as redis

# Create a global Redis client instance
redis_client = redis.Redis(
    host="redis-backend",
    port=6379,
    db=0,
    decode_responses=True,  # optional: to auto-decode byte responses to str
)


async def get_redis_client():
    return redis_client
