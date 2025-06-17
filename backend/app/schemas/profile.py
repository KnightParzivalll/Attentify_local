from typing import List, Optional
from pydantic import BaseModel

from app.schemas.core import BaseID, LocalizedDescriptionField, LocalizedNameField


class ProfileBase(BaseModel):
    id: BaseID
    first_name: LocalizedNameField
    last_name: LocalizedNameField
    patronymic: LocalizedNameField
    phone: Optional[str] = None


class RoleResponse(BaseModel):
    id: BaseID
    name: LocalizedNameField
    description: LocalizedDescriptionField


class GroupResponse(BaseModel):
    id: BaseID
    name: LocalizedNameField
    description: LocalizedDescriptionField


class UserProfileResponse(BaseModel):
    id: BaseID
    email: str
    is_superuser: bool
    profile: ProfileBase
    role: RoleResponse
    groups: List[GroupResponse] = []
