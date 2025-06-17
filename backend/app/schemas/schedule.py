# app/schemas/schedule.py

from typing import List, Optional
from pydantic import BaseModel

from app.schemas.core import LocalizedDescriptionField, LocalizedNameField, BaseID
from app.schemas.profile import GroupResponse


class LessonPeriodResponse(BaseModel):
    id: BaseID
    lesson_number: int
    start_time: str
    end_time: str


class WeekTypeResponse(BaseModel):
    id: BaseID
    name: LocalizedNameField


class DayOfWeekResponse(BaseModel):
    id: BaseID
    day_number: int
    name: LocalizedNameField


class SubjectResponse(BaseModel):
    id: BaseID
    name: LocalizedNameField
    description: LocalizedDescriptionField


class TeacherResponse(BaseModel):
    id: BaseID
    user_id: int
    first_name: LocalizedNameField
    last_name: LocalizedNameField
    patronymic: LocalizedNameField
    phone: Optional[str]


class LessonTypeResponse(BaseModel):
    id: BaseID
    name: LocalizedNameField


class SiteResponse(BaseModel):
    id: BaseID
    name: LocalizedNameField
    description: LocalizedDescriptionField


class LocationResponse(BaseModel):
    site: SiteResponse
    room_number: Optional[str]
    is_virtual: bool


class ScheduleResponse(BaseModel):
    term_id: BaseID
    day_of_week: DayOfWeekResponse
    week_type: WeekTypeResponse


class DayLessonResponse(BaseModel):
    id: BaseID
    lesson_period: LessonPeriodResponse
    subject: SubjectResponse
    teacher: TeacherResponse
    lesson_type: LessonTypeResponse
    location: LocationResponse
    schedule: ScheduleResponse
    groups: List[GroupResponse]


class WeekLessonResponse(BaseModel):
    id: BaseID
    lesson_period: LessonPeriodResponse
    subject: SubjectResponse
    teacher: TeacherResponse
    lesson_type: LessonTypeResponse
    location: LocationResponse
    schedule: ScheduleResponse
    groups: List[GroupResponse]
