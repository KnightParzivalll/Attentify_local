# app/db/seed.py
from datetime import datetime, time
from typing import Any
from sqlalchemy import insert, select
from sqlalchemy.ext.asyncio import AsyncSession
from app.models import Role, Site, LessonPeriod, WeekType, DayOfWeek, LessonType


def to_time(time_str: str) -> time:
    return datetime.strptime(time_str, "%H:%M").time()


# Constant data definitions
DEFAULT_ROLES = [
    {
        "role_name_ru": "Администратор",
        "role_name_en": "Administrator",
        "role_description_ru": "Полный доступ к системе",
        "role_description_en": "Full system access",
    },
    {
        "role_name_ru": "Преподаватель",
        "role_name_en": "Teacher",
        "role_description_ru": "Доступ к расписанию и журналам",
        "role_description_en": "Access to schedules and journals",
    },
    {
        "role_name_ru": "Студент",
        "role_name_en": "Student",
        "role_description_ru": "Доступ к расписанию",
        "role_description_en": "Access to schedules",
    },
]

DEFAULT_SITES = [
    {
        "site_name_ru": "Б",
        "site_name_en": "В",
        "site_description_ru": "",
        "site_description_en": "",
    },
    {
        "site_name_ru": "Г",
        "site_name_en": "G",
        "site_description_ru": "",
        "site_description_en": "",
    },
    {
        "site_name_ru": "рГ",
        "site_name_en": "pG",
        "site_description_ru": "",
        "site_description_en": "",
    },
    {
        "site_name_ru": "Л",
        "site_name_en": "L",
        "site_description_ru": "",
        "site_description_en": "",
    },
    {
        "site_name_ru": "В",
        "site_name_en": "V",
        "site_description_ru": "",
        "site_description_en": "",
    },
    {
        "site_name_ru": "Варшава",
        "site_name_en": "Varshava",
        "site_description_ru": "",
        "site_description_en": "",
    },
    {
        "site_name_ru": "А",
        "site_name_en": "A",
        "site_description_ru": "",
        "site_description_en": "",
    },
    {
        "site_name_ru": "фк",
        "site_name_en": "PE",
        "site_description_ru": "",
        "site_description_en": "",
    },
]

DEFAULT_LESSON_PERIODS = [
    {"lesson_number": 1, "start_time": to_time("09:00"), "end_time": to_time("10:35")},
    {"lesson_number": 2, "start_time": to_time("10:50"), "end_time": to_time("12:25")},
    {"lesson_number": 3, "start_time": to_time("12:40"), "end_time": to_time("14:15")},
    {"lesson_number": 4, "start_time": to_time("14:30"), "end_time": to_time("16:05")},
    {"lesson_number": 5, "start_time": to_time("16:20"), "end_time": to_time("17:55")},
    {"lesson_number": 6, "start_time": to_time("18:00"), "end_time": to_time("19:25")},
    {"lesson_number": 7, "start_time": to_time("19:35"), "end_time": to_time("21:00")},
]


DEFAULT_WEEK_TYPES = [
    {"name_ru": "Верхняя", "name_en": "upper"},
    {"name_ru": "Нижняя", "name_en": "bottom"},
]

DEFAULT_DAYS_OF_WEEK = [
    {"day_number": 1, "name_ru": "Понедельник", "name_en": "Monday"},
    {"day_number": 2, "name_ru": "Вторник", "name_en": "Tuesday"},
    {"day_number": 3, "name_ru": "Среда", "name_en": "Wednesday"},
    {"day_number": 4, "name_ru": "Четверг", "name_en": "Thursday"},
    {"day_number": 5, "name_ru": "Пятница", "name_en": "Friday"},
    {"day_number": 6, "name_ru": "Суббота", "name_en": "Saturday"},
    {"day_number": 7, "name_ru": "Воскресенье", "name_en": "Sunday"},
]

DEFAULT_LESSON_TYPES = [
    {"name_ru": "Лекция", "name_en": "Lecture"},
    {"name_ru": "Практика", "name_en": "Practice"},
    {"name_ru": "Лабораторная", "name_en": "Laboratory"},
]


async def seed_model(
    db: AsyncSession, model: Any, defaults: list[dict], unique_fields: list[str]
):
    """
    Seed a database table with default data if it doesn't exist
    """
    # Check existing entries using SQLAlchemy model attributes
    existing = await db.execute(select(model))
    existing_entries = existing.scalars().all()

    # Create set of existing unique field combinations
    existing_values = {
        tuple(getattr(entry, field) for field in unique_fields)
        for entry in existing_entries
    }

    # Filter out existing entries
    new_entries = [
        entry
        for entry in defaults
        if tuple(entry[field] for field in unique_fields) not in existing_values
    ]

    # Insert new entries
    if new_entries:
        await db.execute(insert(model).values(new_entries))
        await db.commit()


async def seed_all_models(db: AsyncSession):
    """Seed all constant data models"""
    await seed_model(db, Role, DEFAULT_ROLES, ["role_name_ru", "role_name_en"])
    await seed_model(db, Site, DEFAULT_SITES, ["site_name_ru", "site_name_en"])
    await seed_model(db, LessonPeriod, DEFAULT_LESSON_PERIODS, ["lesson_number"])
    await seed_model(db, WeekType, DEFAULT_WEEK_TYPES, ["name_ru", "name_en"])
    await seed_model(db, DayOfWeek, DEFAULT_DAYS_OF_WEEK, ["day_number"])
    await seed_model(db, LessonType, DEFAULT_LESSON_TYPES, ["name_ru", "name_en"])
