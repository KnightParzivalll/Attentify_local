from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import and_, select
from datetime import date, datetime, timezone
from app.auth import get_current_active_student, get_current_active_teacher
from app.database import get_async_session
from app.models import Attendance, Group, ScheduleGroup, Student, TermSchedule
from app.utils.decrypt import decrypt_payload
from pydantic import BaseModel
from starlette import status
from redis.asyncio import Redis
from app.redis import get_redis_client

router = APIRouter(prefix="/attendance", tags=["attendance"])


class QRScanData(BaseModel):
    data: str
    teacher_id: int  # added explicitly from QR


class StudentAttendanceResponse(BaseModel):
    student_id: int
    first_name: str
    last_name: str
    group_name: Optional[str]
    attended: bool


@router.post("/confirm", status_code=status.HTTP_201_CREATED)
async def confirm_attendance(
    data: QRScanData,
    session: AsyncSession = Depends(get_async_session),
    current_user: Student = Depends(get_current_active_student),
    redis: Redis = Depends(get_redis_client),
):
    try:
        # Retrieve session key from Redis via teacher_id
        session_key = await redis.get(f"session:{data.teacher_id}")
        if not session_key:
            raise HTTPException(
                status_code=404, detail="Session key not found for this teacher"
            )

        # Decrypt payload from QR using the retrieved session key
        payload = decrypt_payload(data.data, session_key)
        print(f"Decrypted payload: {payload}")

        schedule_id = payload.get("schedule_id")
        timestamp = payload.get("timestamp")

        if not schedule_id or not timestamp:
            raise HTTPException(status_code=400, detail="Invalid QR data")

        # Confirm timestamp freshness (max 5 minutes)
        qr_time = datetime.fromtimestamp(timestamp, tz=timezone.utc)
        now = datetime.now(timezone.utc)
        time_diff = abs((now - qr_time).total_seconds())
        if time_diff > 10:
            raise HTTPException(status_code=400, detail="QR code expired")

        # Check if schedule exists for today
        today = date.today()
        result = await session.execute(
            select(TermSchedule).where(TermSchedule.id == schedule_id)
        )
        schedule = result.scalar_one_or_none()

        if not schedule:
            raise HTTPException(status_code=404, detail="Schedule not found for today")

        # Check if attendance already recorded
        result = await session.execute(
            select(Attendance).where(
                Attendance.schedule_id == schedule_id,
                Attendance.student_id == current_user.id,
                Attendance.lesson_date == today,
            )
        )
        existing_record = result.scalar_one_or_none()

        if existing_record:
            raise HTTPException(status_code=409, detail="Attendance already confirmed")

        # Create new attendance record
        new_record = Attendance(
            schedule_id=schedule_id,
            student_id=current_user.id,
            lesson_date=today,
            scanned_at=datetime.now(timezone.utc).replace(tzinfo=None),  # make naive
        )
        session.add(new_record)
        await session.commit()

        return {"detail": "Attendance confirmed successfully"}

    except ValueError:
        raise HTTPException(status_code=400, detail="Failed to decrypt QR data")


@router.get(
    "/day",
    response_model=List[StudentAttendanceResponse],
    summary="Get attendance for a specific subject and date",
    responses={
        200: {"description": "Attendance list retrieved successfully"},
        403: {"description": "Unauthorized access"},
        404: {
            "description": "No schedules or students found for given subject and date"
        },
    },
)
async def get_attendance_for_day(
    subject_id: int = Query(..., description="Subject ID"),
    lesson_date: date = Query(..., description="Lesson date in YYYY-MM-DD format"),
    db: AsyncSession = Depends(get_async_session),
    current_teacher=Depends(get_current_active_teacher),
):
    # Fetch schedules for this teacher, subject and date
    schedule_stmt = select(TermSchedule).where(
        and_(
            TermSchedule.subject_id == subject_id,
            TermSchedule.teacher_id == current_teacher.id,
        )
    )
    result = await db.execute(schedule_stmt)
    schedules = result.scalars().all()

    if not schedules:
        raise HTTPException(status_code=404, detail="No schedules found.")

    schedule_ids = [s.id for s in schedules]

    # Fetch all related groups via ScheduleGroup
    group_stmt = (
        select(Group)
        .join(ScheduleGroup)
        .where(ScheduleGroup.schedule_id.in_(schedule_ids))
        .distinct()
    )
    groups_result = await db.execute(group_stmt)
    groups = groups_result.scalars().all()

    if not groups:
        raise HTTPException(status_code=404, detail="No groups found.")

    group_ids = [g.id for g in groups]

    # Fetch all students in those groups
    students_stmt = select(Student).where(Student.group_id.in_(group_ids))
    students_result = await db.execute(students_stmt)
    students = students_result.scalars().all()

    if not students:
        raise HTTPException(status_code=404, detail="No students found.")

    # Fetch attendance records for those students for that date and schedule
    attendance_stmt = select(Attendance).where(
        and_(
            Attendance.schedule_id.in_(schedule_ids),
            Attendance.lesson_date == lesson_date,
        )
    )
    attendance_result = await db.execute(attendance_stmt)
    attendance_records = attendance_result.scalars().all()

    attendance_by_student = {a.student_id: a for a in attendance_records}

    # Build response
    response = []
    for student in students:
        attended = student.id in attendance_by_student
        response.append(
            StudentAttendanceResponse(
                student_id=student.id,
                first_name=student.first_name_en,
                last_name=student.last_name_en,
                group_name=student.group.group_name_en if student.group else None,
                attended=attended,
            )
        )

    return response
