from fastapi import Depends, HTTPException, status
from fastapi_users import BaseUserManager, FastAPIUsers, IntegerIDMixin
from fastapi_users.authentication import (
    JWTStrategy,
    AuthenticationBackend,
    BearerTransport,
    CookieTransport,
)
from fastapi_users.db import SQLAlchemyUserDatabase
from sqlalchemy import select

from app.config import settings
from app.models import Administrator, Student, Teacher, User
from app.database import get_async_session, get_db
from sqlalchemy.ext.asyncio import AsyncSession

token_max_age_seconds = (
    settings.access_token_expire_hours * 3600
)  # TODO split into bearer and cookie max age

# --- Bearer Token Transport ---
bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")
cookie_transport = CookieTransport(  # TODO consider deleting
    cookie_max_age=token_max_age_seconds,
    cookie_httponly=False,
    cookie_secure=False,
)


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(
        secret=settings.secret_key,
        lifetime_seconds=settings.access_token_expire_hours * 3600,
    )


auth_jwt_backend: AuthenticationBackend[User, int] = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

auth_cookie_backend: AuthenticationBackend[User, int] = AuthenticationBackend(
    name="cookie",
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)


# --- User Manager ---
class UserManager(IntegerIDMixin, BaseUserManager[User, int]):
    reset_password_token_secret = settings.secret_key
    verification_token_secret = settings.secret_key


async def get_user_db(session: AsyncSession = Depends(get_async_session)):
    yield SQLAlchemyUserDatabase(session, User)


async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)


app_fastapi_users = FastAPIUsers[User, int](
    get_user_manager,
    [auth_jwt_backend, auth_cookie_backend],
)

current_active_user = app_fastapi_users.current_user(active=True)


async def get_current_active_teacher(
    user: User = Depends(current_active_user), db: AsyncSession = Depends(get_db)
) -> Teacher:
    # Query the database explicitly for the teacher profile linked to this user.
    result = await db.execute(select(Teacher).where(Teacher.user_id == user.id))
    teacher_profile = result.scalars().first()
    if not teacher_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Teacher profile not found."
        )
    return teacher_profile


async def get_current_active_student(
    user: User = Depends(current_active_user), db: AsyncSession = Depends(get_db)
) -> Student:
    result = await db.execute(select(Student).where(Student.user_id == user.id))
    student_profile = result.scalars().first()
    if not student_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Student profile not found."
        )
    return student_profile


async def get_current_active_administrator(
    user: User = Depends(current_active_user), db: AsyncSession = Depends(get_db)
) -> Administrator:
    result = await db.execute(
        select(Administrator).where(Administrator.user_id == user.id)
    )
    administrator_profile = result.scalars().first()
    if not administrator_profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Administrator profile not found.",
        )
    return administrator_profile
