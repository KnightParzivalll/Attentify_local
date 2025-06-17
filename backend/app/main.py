# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.auth import (
    app_fastapi_users,
    auth_jwt_backend,
    auth_cookie_backend,
)
from app.global_schemas import UserRead, UserUpdate
from app.routers import schedule, profile, session, attendance, debug


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield


app = FastAPI(root_path="/api", lifespan=lifespan)


@app.get("/health")
async def health_check():
    return {"status": "ok"}


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace "*" with a list of allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    app_fastapi_users.get_auth_router(auth_jwt_backend),
    prefix="/auth/jwt",
    tags=["auth"],
)

app.include_router(
    app_fastapi_users.get_auth_router(auth_cookie_backend),
    prefix="/auth/cookie",
    tags=["auth"],
)

# app.include_router(
#     app_fastapi_users.get_register_router(UserRead, UserCreate),
#     prefix="/auth",
#     tags=["auth"],
# )

app.include_router(
    app_fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)

# Include the test endpoints for creating users (development only)
# app.include_router(dev_users_router)  # TODO remove

app.include_router(schedule.teacher_router)
app.include_router(schedule.student_router)

app.include_router(profile.router)
app.include_router(session.router)

app.include_router(attendance.router)

app.include_router(debug.router)
