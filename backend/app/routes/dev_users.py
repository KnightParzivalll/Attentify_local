from fastapi import APIRouter, Depends, HTTPException, status
from fastapi_users import BaseUserManager
from app.auth import get_user_manager
from app.database import get_db
from app.global_schemas import UserCreate, UserRead
from app.models import User, Teacher, Student, Administrator
from app.schemas.dev_create import AdministratorCreate, StudentCreate, TeacherCreate
from sqlalchemy.ext.asyncio import AsyncSession
from fastapi_users import exceptions, schemas
from fastapi_users.router.common import ErrorCode, ErrorModel


router = APIRouter(prefix="/dev/create", tags=["dev"])


@router.post(
    "/teacher",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
    name="register:register",
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "model": ErrorModel,
            "content": {
                "application/json": {
                    "examples": {
                        ErrorCode.REGISTER_USER_ALREADY_EXISTS: {
                            "summary": "A user with this email already exists.",
                            "value": {"detail": ErrorCode.REGISTER_USER_ALREADY_EXISTS},
                        },
                        ErrorCode.REGISTER_INVALID_PASSWORD: {
                            "summary": "Password validation failed.",
                            "value": {
                                "detail": {
                                    "code": ErrorCode.REGISTER_INVALID_PASSWORD,
                                    "reason": "Password should beat least 3 characters",
                                }
                            },
                        },
                    }
                }
            },
        },
    },
)
async def create_teacher(
    data: TeacherCreate,
    db: AsyncSession = Depends(get_db),
    user_manager: BaseUserManager[User, int] = Depends(get_user_manager),
):
    user_data = UserCreate(
        email=data.email,
        password=data.password,
        role="teacher",
        is_verified=True,
        is_active=True,
        is_superuser=False,
    )

    try:
        created_user = await user_manager.create(user_data, safe=True, request=None)
    except exceptions.UserAlreadyExists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ErrorCode.REGISTER_USER_ALREADY_EXISTS,
        )
    except exceptions.InvalidPasswordException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": ErrorCode.REGISTER_INVALID_PASSWORD,
                "reason": e.reason,
            },
        )

    print(created_user)

    teacher = Teacher(
        user_id=created_user.id,
        first_name=data.first_name,
        last_name=data.last_name,
        phone=data.phone,
    )
    db.add(teacher)
    await db.commit()
    await db.refresh(teacher)

    return schemas.model_validate(UserRead, created_user)


@router.post(
    "/student",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
    name="register:register",
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "model": ErrorModel,
            "content": {
                "application/json": {
                    "examples": {
                        ErrorCode.REGISTER_USER_ALREADY_EXISTS: {
                            "summary": "A user with this email already exists.",
                            "value": {"detail": ErrorCode.REGISTER_USER_ALREADY_EXISTS},
                        },
                        ErrorCode.REGISTER_INVALID_PASSWORD: {
                            "summary": "Password validation failed.",
                            "value": {
                                "detail": {
                                    "code": ErrorCode.REGISTER_INVALID_PASSWORD,
                                    "reason": "Password should beat least 3 characters",
                                }
                            },
                        },
                    }
                }
            },
        },
    },
)
async def create_student(
    data: StudentCreate,
    db: AsyncSession = Depends(get_db),
    user_manager: BaseUserManager[User, int] = Depends(get_user_manager),
):
    user_data = UserCreate(
        email=data.email,
        password=data.password,
        role="student",
        is_verified=True,
        is_active=True,
        is_superuser=False,
    )

    try:
        created_user = await user_manager.create(user_data, safe=True, request=None)
    except exceptions.UserAlreadyExists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ErrorCode.REGISTER_USER_ALREADY_EXISTS,
        )
    except exceptions.InvalidPasswordException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": ErrorCode.REGISTER_INVALID_PASSWORD,
                "reason": e.reason,
            },
        )

    print(created_user)

    student = Student(
        user_id=created_user.id,
        first_name=data.first_name,
        last_name=data.last_name,
        phone=data.phone,
        group_id=data.group_id,
    )
    db.add(student)
    await db.commit()
    await db.refresh(student)

    return schemas.model_validate(UserRead, created_user)


@router.post(
    "/administrator",
    response_model=UserRead,
    status_code=status.HTTP_201_CREATED,
    name="register:register",
    responses={
        status.HTTP_400_BAD_REQUEST: {
            "model": ErrorModel,
            "content": {
                "application/json": {
                    "examples": {
                        ErrorCode.REGISTER_USER_ALREADY_EXISTS: {
                            "summary": "A user with this email already exists.",
                            "value": {"detail": ErrorCode.REGISTER_USER_ALREADY_EXISTS},
                        },
                        ErrorCode.REGISTER_INVALID_PASSWORD: {
                            "summary": "Password validation failed.",
                            "value": {
                                "detail": {
                                    "code": ErrorCode.REGISTER_INVALID_PASSWORD,
                                    "reason": "Password should beat least 3 characters",
                                }
                            },
                        },
                    }
                }
            },
        },
    },
)
async def create_administrator(
    data: AdministratorCreate,
    db: AsyncSession = Depends(get_db),
    user_manager: BaseUserManager[User, int] = Depends(get_user_manager),
):
    user_data = UserCreate(
        email=data.email,
        password=data.password,
        role="administrator",
        is_verified=True,
        is_active=True,
        is_superuser=True,
    )

    try:
        created_user = await user_manager.create(user_data, safe=False, request=None)
    except exceptions.UserAlreadyExists:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ErrorCode.REGISTER_USER_ALREADY_EXISTS,
        )
    except exceptions.InvalidPasswordException as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={
                "code": ErrorCode.REGISTER_INVALID_PASSWORD,
                "reason": e.reason,
            },
        )

    print(created_user)

    administrator = Administrator(
        user_id=created_user.id,
        first_name=data.first_name,
        last_name=data.last_name,
        phone=data.phone,
    )
    db.add(administrator)
    await db.commit()
    await db.refresh(administrator)

    return schemas.model_validate(UserRead, created_user)
