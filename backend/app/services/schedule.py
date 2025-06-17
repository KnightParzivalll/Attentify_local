# app/services/schedule.py
from datetime import date
from typing import List, Optional, OrderedDict

from sqlalchemy import asc
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload

from app.models import (
    Group,
    LessonType,
    ScheduleGroup,
    Student,
    Subject,
    Teacher,
    Term,
    TermSchedule,
    DayOfWeek,
    WeekType,
    LessonPeriod,
)
from app.schemas.core import LocalizedDescriptionField, LocalizedNameField
from app.schemas.profile import GroupResponse
from app.schemas.schedule import (
    DayOfWeekResponse,
    LocalizedDescriptionField,
    LocalizedNameField,
    LessonPeriodResponse,
    DayLessonResponse,
    WeekLessonResponse,
    LessonTypeResponse,
    LocationResponse,
    ScheduleResponse,
    SiteResponse,
    SubjectResponse,
    TeacherResponse,
    WeekTypeResponse,
)
from app.utils.date_utils import time_to_iso
from app.utils.validate import validate_term_start_date

WEEKDAY_ORDER = {
    "Monday": 0,
    "Tuesday": 1,
    "Wednesday": 2,
    "Thursday": 3,
    "Friday": 4,
    "Saturday": 5,
    "Sunday": 6,
}


class ScheduleService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_active_term(self, target_date: date) -> Optional[Term]:
        """Get active term for the given date"""
        stmt = (
            select(Term)
            .where(Term.start_date <= target_date)
            .where(Term.end_date >= target_date)
            .order_by(Term.start_date.desc())
            .limit(1)
        )
        result = await self.db.execute(stmt)
        return result.scalar_one_or_none()

    async def get_teacher_daily_schedules(
        self, term_id: int, target_date: date, teacher_id: Optional[int] = None
    ) -> List[TermSchedule]:
        """Retrieve daily schedules with eager loading"""
        # Get term with proper date validation
        term = await self.get_term(term_id)
        if not (term.start_date <= target_date <= term.end_date):
            raise ValueError("Target date outside term dates")

        week_type_name = self.calculate_week_type(term.start_date, target_date)

        weekday_name = target_date.strftime("%A")
        weekday_number = target_date.isoweekday()  # Monday=1 to Sunday=7

        stmt = (
            select(TermSchedule)
            .join(TermSchedule.lesson_period)
            .join(TermSchedule.day_of_week)
            .join(TermSchedule.week_type)
            .options(
                selectinload(TermSchedule.subject),
                selectinload(TermSchedule.lesson_period),
                selectinload(TermSchedule.site),
                selectinload(TermSchedule.day_of_week),
                selectinload(TermSchedule.lesson_type),
                selectinload(TermSchedule.week_type),
                selectinload(TermSchedule.teacher),
                selectinload(TermSchedule.schedule_groups).selectinload(
                    ScheduleGroup.group
                ),
            )
            .where(
                TermSchedule.term_id == term_id,
                DayOfWeek.name_en == weekday_name,  # TODO consider deleting
                DayOfWeek.day_number == weekday_number,  # Double-check weekday
                WeekType.name_en == week_type_name,
                *([TermSchedule.teacher_id == teacher_id] if teacher_id else []),
            )
            .order_by(LessonPeriod.lesson_number)
        )

        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_student_daily_schedules(
        self, term_id: int, target_date: date, student_id: int
    ) -> List[TermSchedule]:
        """Retrieve daily schedules with eager loading"""
        # Get term with proper date validation
        term = await self.get_term(term_id)
        if not (term.start_date <= target_date <= term.end_date):
            raise ValueError("Target date outside term dates")

        week_type_name = self.calculate_week_type(term.start_date, target_date)

        weekday_name = target_date.strftime("%A")
        weekday_number = target_date.isoweekday()  # Monday=1 to Sunday=7

        stmt = (
            select(TermSchedule)
            .join(TermSchedule.lesson_period)
            .join(TermSchedule.day_of_week)
            .join(TermSchedule.week_type)
            .options(
                selectinload(TermSchedule.subject),
                selectinload(TermSchedule.lesson_period),
                selectinload(TermSchedule.site),
                selectinload(TermSchedule.day_of_week),
                selectinload(TermSchedule.lesson_type),
                selectinload(TermSchedule.week_type),
                selectinload(TermSchedule.teacher),
                selectinload(TermSchedule.schedule_groups)
                .selectinload(ScheduleGroup.group)
                .selectinload(Group.students),
            )
            .where(
                TermSchedule.term_id == term_id,
                DayOfWeek.name_en == weekday_name,  # TODO consider deleting
                DayOfWeek.day_number == weekday_number,  # Double-check weekday
                WeekType.name_en == week_type_name,
                Student.id == student_id,
            )
            .order_by(LessonPeriod.lesson_number)
        )

        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    def calculate_week_type(self, term_start: date, target_date: date) -> str:
        """Calculate week type (upper/bottom)"""
        validate_term_start_date(term_start)

        weeks_passed = (target_date - term_start).days // 7
        return "upper" if weeks_passed % 2 == 0 else "bottom"

    async def get_term(self, term_id: int) -> Term:
        """Get single term by ID"""
        result = await self.db.execute(select(Term).where(Term.id == term_id))
        return result.scalar_one()

    def map_to_lesson_response(self, schedule: TermSchedule) -> DayLessonResponse:
        """Map ORM model to response schema with helper methods"""
        return DayLessonResponse(
            id=schedule.id,
            lesson_period=self._map_lesson_period(schedule.lesson_period),
            subject=self._map_subject(schedule.subject),
            teacher=self._map_teacher(schedule.teacher),
            lesson_type=self._map_lesson_type(schedule.lesson_type),
            location=self._map_location(schedule),
            schedule=self._map_schedule_info(schedule),
            groups=[
                self._map_group(sg.group) for sg in schedule.schedule_groups if sg.group
            ],
        )

    def _map_lesson_period(self, period: LessonPeriod) -> LessonPeriodResponse:
        return LessonPeriodResponse(
            id=period.id,
            lesson_number=period.lesson_number,
            start_time=time_to_iso(period.start_time),
            end_time=time_to_iso(period.end_time),
        )

    def _map_subject(self, subject: Subject) -> SubjectResponse:
        return SubjectResponse(
            id=subject.id,
            name=LocalizedNameField(
                en=subject.subject_name_en, ru=subject.subject_name_ru
            ),
            description=LocalizedDescriptionField(
                en=subject.subject_description_en, ru=subject.subject_description_ru
            ),
        )

    def _map_teacher(self, teacher: Teacher) -> TeacherResponse:
        return TeacherResponse(
            id=teacher.id,
            user_id=teacher.user_id,
            first_name=LocalizedNameField(
                en=teacher.first_name_en, ru=teacher.first_name_ru
            ),
            last_name=LocalizedNameField(
                en=teacher.last_name_en, ru=teacher.last_name_ru
            ),
            patronymic=LocalizedNameField(
                en=teacher.patronymic_en, ru=teacher.patronymic_ru
            ),
            phone=teacher.phone,
        )

    def _map_lesson_type(self, lesson_type: LessonType) -> LessonTypeResponse:
        return LessonTypeResponse(
            id=lesson_type.id,
            name=LocalizedNameField(en=lesson_type.name_en, ru=lesson_type.name_ru),
        )

    def _map_location(self, schedule: TermSchedule) -> LocationResponse:
        return LocationResponse(
            site=SiteResponse(
                id=schedule.site.id,
                name=LocalizedNameField(
                    en=schedule.site.site_name_en, ru=schedule.site.site_name_ru
                ),
                description=LocalizedDescriptionField(
                    en=schedule.site.site_description_en,
                    ru=schedule.site.site_description_ru,
                ),
            ),
            room_number=schedule.room_number,
            is_virtual=schedule.is_virtual,
        )

    def _map_schedule_info(self, schedule: TermSchedule) -> ScheduleResponse:
        return ScheduleResponse(
            term_id=schedule.term.id,
            day_of_week=DayOfWeekResponse(
                id=schedule.day_of_week.id,
                day_number=schedule.day_of_week.day_number,
                name=LocalizedNameField(
                    en=schedule.day_of_week.name_en, ru=schedule.day_of_week.name_ru
                ),
            ),
            week_type=WeekTypeResponse(
                id=schedule.week_type.id,
                name=LocalizedNameField(
                    en=schedule.week_type.name_en, ru=schedule.week_type.name_ru
                ),
            ),
        )

    def _map_group(self, group: Group) -> GroupResponse:
        return GroupResponse(
            id=group.id,
            name=LocalizedNameField(ru=group.group_name_ru, en=group.group_name_en),
            description=LocalizedDescriptionField(
                ru=group.group_description_ru, en=group.group_description_en
            ),
        )

    async def get_teacher_weekly_schedules(
        self,
        term_id: int,
        week_type: str,
        teacher_id: Optional[int] = None,
        group_ids: Optional[List[int]] = None,
    ) -> List[TermSchedule]:
        """Get weekly schedules with filtering"""
        stmt = (
            select(TermSchedule)
            .join(TermSchedule.day_of_week)
            .join(TermSchedule.lesson_period)
            .join(TermSchedule.week_type)
            .options(
                selectinload(TermSchedule.subject),
                selectinload(TermSchedule.lesson_period),
                selectinload(TermSchedule.site),
                selectinload(TermSchedule.day_of_week),
                selectinload(TermSchedule.lesson_type),
                selectinload(TermSchedule.week_type),
                selectinload(TermSchedule.teacher),
                selectinload(TermSchedule.schedule_groups).selectinload(
                    ScheduleGroup.group
                ),
            )
            .where(
                TermSchedule.term_id == term_id,
                TermSchedule.week_type.has(WeekType.name_en == week_type),
                # TermSchedule.teacher_id == teacher_id,
                *([TermSchedule.teacher_id == teacher_id] if teacher_id else []),
            )
            .order_by(
                asc(DayOfWeek.day_number),  # Order days by day number
                asc(LessonPeriod.lesson_number),  # Order lessons within day
            )
        )

        if group_ids:
            stmt = stmt.where(
                TermSchedule.schedule_groups.any(ScheduleGroup.group_id.in_(group_ids))
            )

        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def get_student_weekly_schedules(
        self,
        term_id: int,
        week_type: str,
        student_id: int,
    ) -> List[TermSchedule]:
        """Get weekly schedules with filtering"""
        stmt = (
            select(TermSchedule)
            .join(TermSchedule.day_of_week)
            .join(TermSchedule.lesson_period)
            .join(TermSchedule.week_type)
            .options(
                selectinload(TermSchedule.subject),
                selectinload(TermSchedule.lesson_period),
                selectinload(TermSchedule.site),
                selectinload(TermSchedule.day_of_week),
                selectinload(TermSchedule.lesson_type),
                selectinload(TermSchedule.week_type),
                selectinload(TermSchedule.teacher),
                selectinload(TermSchedule.schedule_groups)
                .selectinload(ScheduleGroup.group)
                .selectinload(Group.students),
            )
            .where(
                TermSchedule.term_id == term_id,
                TermSchedule.week_type.has(WeekType.name_en == week_type),
                Student.id == student_id,
            )
            .order_by(
                asc(DayOfWeek.day_number),  # Order days by day number
                asc(LessonPeriod.lesson_number),  # Order lessons within day
            )
        )

        result = await self.db.execute(stmt)
        return list(result.scalars().all())

    async def build_weekly_structure(
        self, schedules: List[TermSchedule]
    ) -> OrderedDict[str, List[WeekLessonResponse]]:
        """Build ordered weekly schedule structure"""
        ordered_days = OrderedDict((day, []) for day in WEEKDAY_ORDER.keys())

        for sched in schedules:
            lesson = self._map_weekly_lesson(sched)
            day_key = sched.day_of_week.name_en
            ordered_days[day_key].append(lesson)

        return ordered_days

    def _map_weekly_lesson(self, schedule: TermSchedule) -> WeekLessonResponse:
        """Map schedule to weekly lesson response"""
        return WeekLessonResponse(
            id=schedule.id,
            lesson_period=self._map_lesson_period(schedule.lesson_period),
            subject=self._map_subject(schedule.subject),
            teacher=self._map_teacher(schedule.teacher),
            lesson_type=self._map_lesson_type(schedule.lesson_type),
            location=self._map_location(schedule),
            schedule=self._map_schedule_info(schedule),
            groups=[
                self._map_group(sg.group) for sg in schedule.schedule_groups if sg.group
            ],
        )
