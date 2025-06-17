from fastapi_users import schemas
from pydantic import BaseModel


class RoleRead(BaseModel):
    id: int
    role_name_ru: str
    role_name_en: str
    role_description_ru: str | None
    role_description_en: str | None


class UserRead(schemas.BaseUser[int]): ...


class UserCreate(schemas.BaseUserCreate):
    role_id: int


class UserUpdate(schemas.BaseUserUpdate):
    role_id: int
