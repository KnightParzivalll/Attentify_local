# app/services/profile.py
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.models import Group, ProfileMixin, Role, ScheduleGroup, TermSchedule, User
from app.schemas.core import LocalizedDescriptionField, LocalizedNameField
from app.schemas.profile import (
    GroupResponse,
    ProfileBase,
    RoleResponse,
    UserProfileResponse,
)


class ProfileService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_user_profile(self, user: User) -> UserProfileResponse:
        """Main service method with proper return type"""
        base_profile = await self._get_base_profile(user)
        groups = await self._get_user_groups(user)
        role = await self._map_role(user.role)

        return UserProfileResponse(
            id=user.id,
            email=user.email,
            is_superuser=user.is_superuser,
            profile=base_profile,
            role=role,
            groups=groups,
        )

    async def _get_base_profile(self, user: User) -> ProfileBase:
        """Returns typed profile base"""
        profile = self._get_profile_entity(user)
        return ProfileBase(
            id=profile.id,
            first_name=LocalizedNameField(
                ru=profile.first_name_ru, en=profile.first_name_en
            ),
            last_name=LocalizedNameField(
                ru=profile.last_name_ru, en=profile.last_name_en
            ),
            patronymic=LocalizedNameField(
                ru=profile.patronymic_ru, en=profile.patronymic_en
            ),
            phone=profile.phone,
        )

    async def _map_role(self, role: Role) -> RoleResponse:
        """Returns typed role response"""
        return RoleResponse(
            id=role.id,
            name=LocalizedNameField(ru=role.role_name_ru, en=role.role_name_en),
            description=LocalizedDescriptionField(
                ru=role.role_description_ru, en=role.role_description_en
            ),
        )

    async def _get_user_groups(self, user: User) -> List[GroupResponse]:
        """Returns typed group responses"""
        groups = await self._fetch_groups(user)
        return [
            GroupResponse(
                id=group.id,
                name=LocalizedNameField(ru=group.group_name_ru, en=group.group_name_en),
                description=LocalizedDescriptionField(
                    ru=group.group_description_ru, en=group.group_description_en
                ),
            )
            for group in groups
        ]

    def _get_profile_entity(self, user: User) -> ProfileMixin:
        """Type-safe profile entity access"""
        if user.teacher_profile:
            return user.teacher_profile
        if user.student_profile:
            return user.student_profile
        if user.administrator_profile:
            return user.administrator_profile
        raise ValueError("User has no associated profile")

    async def _fetch_groups(self, user: User) -> List[Group]:
        """Database query with typed return"""
        if user.teacher_profile:
            result = await self.db.execute(
                select(Group)
                .join(ScheduleGroup)
                .join(TermSchedule)
                .where(TermSchedule.teacher_id == user.teacher_profile.id)
                .distinct()
            )
            return list(result.scalars().all())

        if user.student_profile and user.student_profile.group:
            return [user.student_profile.group]

        return []
