from typing import Optional
from pydantic import BaseModel


class TeacherCreate(BaseModel):
    first_name: str
    last_name: str
    phone: Optional[str] = None
    email: str = "test@example.com"
    password: str = "password"


class AdministratorCreate(TeacherCreate): ...


class StudentCreate(TeacherCreate):
    group_id: Optional[int] = None
