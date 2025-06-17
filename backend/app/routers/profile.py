# app/routers/profile.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models import User, Student
from app.schemas.profile import UserProfileResponse
from app.services.profile import ProfileService
from app.auth import current_active_user

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get(
    "/me",
    response_model=UserProfileResponse,
    summary="Get current user profile",
    responses={
        200: {"description": "Successfully retrieved user profile"},
        404: {"description": "User not found or profile incomplete"},
        500: {"description": "Internal server error"},
    },
)
async def get_current_user_profile(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(current_active_user),
):
    """
    Get complete profile information for the authenticated user

    Returns:
    - User metadata (email, superuser status)
    - Localized profile information (name, patronymic, phone)
    - Assigned role with descriptions
    - Associated groups (if teacher/student)
    """
    try:
        # Refresh user with all necessary relationships
        result = await db.execute(
            select(User)
            .options(
                selectinload(User.role),
                selectinload(User.teacher_profile),
                selectinload(User.student_profile).selectinload(Student.group),
                selectinload(User.administrator_profile),
            )
            .where(User.id == current_user.id)
        )
        user = result.scalar_one()

        # Get processed profile through service layer
        return await ProfileService(db).get_user_profile(user)

    except ValueError as e:
        # Handle missing profile or data validation errors
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
    except Exception as e:
        # Catch-all for unexpected errors
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Could not retrieve user profile: {e}",
        )
