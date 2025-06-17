from datetime import date, datetime
from fastapi import APIRouter, Depends, status
from pydantic import BaseModel
from redis.asyncio import Redis
from sqlalchemy import delete, select
from app.models import Attendance
from app.redis import get_redis_client
from app.database import get_async_session
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter(prefix="/debug", tags=["debug"])


@router.get("/sessions")
async def list_all_session_keys(
    redis: Redis = Depends(get_redis_client),
):
    keys = await redis.keys("session:*")
    sessions = {}
    for key in keys:
        value = await redis.get(key)
        sessions[key] = value  # both are str if decode_responses=True
    return sessions


# Pydantic model to serialize attendance record
class AttendanceRecord(BaseModel):
    id: int
    schedule_id: int
    lesson_date: date
    student_id: int
    scanned_at: datetime

    class Config:
        orm_mode = True


@router.get("/all", response_model=list[AttendanceRecord])
async def list_all_attendance(session: AsyncSession = Depends(get_async_session)):
    result = await session.execute(select(Attendance))
    records = result.scalars().all()
    return records


@router.delete("/clear-attendance", status_code=status.HTTP_204_NO_CONTENT)
async def clear_all_attendance(session: AsyncSession = Depends(get_async_session)):
    await session.execute(delete(Attendance))
    await session.commit()
    return {"detail": "All attendance records cleared successfully."}
