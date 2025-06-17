# app/database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from app.config import settings

from collections.abc import AsyncGenerator

# Create the async engine with our DATABASE_URL
engine = create_async_engine(settings.database_url, echo=False)

# Create a session maker bound to the engine
async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


# Dependency (for use in route handlers)
async def get_db():
    async with async_session() as session:
        yield session


async def get_async_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session() as session:
        yield session
