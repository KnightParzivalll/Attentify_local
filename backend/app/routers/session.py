from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models import Teacher
from app.auth import get_current_active_teacher
from app.redis import get_redis_client

from redis.asyncio import Redis
import secrets

router = APIRouter(prefix="/session", tags=["session"])

SESSION_TTL_SECONDS = 3600  # 1 hour


@router.post(
    "/create",
    summary="Create or refresh a session key for the current user",
    responses={
        200: {"description": "Session key created or refreshed successfully"},
        500: {"description": "Internal server error"},
    },
)
async def create_or_refresh_session_key(
    db: AsyncSession = Depends(get_db),
    current_user: Teacher = Depends(get_current_active_teacher),
    redis_client: Redis = Depends(get_redis_client),
):
    try:
        user_session_key_key = f"session:{current_user.user_id}"

        # Check for existing session key
        existing_session_key = await redis_client.get(user_session_key_key)
        if existing_session_key:
            # Delete old session key mapping
            await redis_client.delete(existing_session_key)

        # Generate new secure random session key
        new_session_key = secrets.token_urlsafe(32)

        # Set new session_key → user_id mapping
        await redis_client.set(
            new_session_key, str(current_user.id), ex=SESSION_TTL_SECONDS
        )

        # Set session:{user_id} → session_key mapping
        await redis_client.set(
            user_session_key_key, new_session_key, ex=SESSION_TTL_SECONDS
        )

        return {"session_key": new_session_key, "ttl_seconds": SESSION_TTL_SECONDS}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not create or refresh session key: {e}",
        )


# request body model
class SessionKeyCheckRequest(BaseModel):
    session_key: str


@router.post(
    "/check",
    summary="Check if a session key is valid",
    responses={
        200: {"description": "Session key is valid"},
        404: {"description": "Session key not found or expired"},
    },
)
async def check_session_key(
    request: SessionKeyCheckRequest,
    redis_client: Redis = Depends(get_redis_client),
):
    try:
        teacher_id = await redis_client.get(request.session_key)
        if teacher_id is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session key not found or expired",
            )

        return {
            "valid": True,
            "teacher_id": teacher_id.decode()
            if isinstance(teacher_id, bytes)
            else teacher_id,
        }

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not verify session key: {e}",
        )
