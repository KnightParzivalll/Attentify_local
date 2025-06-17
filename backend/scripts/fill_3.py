import asyncio
from datetime import datetime, date, time
from typing import List, Dict, Tuple, Any
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext

from app.database import async_session
from app.models import (
    Role,
    User,
    Teacher,
    Student,
    Administrator,
    Group,
    Site,
    Term,
    Subject,
    LessonPeriod,
    DayOfWeek,
    WeekType,
    LessonType,
    TermSchedule,
    ScheduleGroup,
)

# Настройка хеширования паролей
pwd_context = CryptContext(schemes=["argon2"])


def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def to_time(time_str: str) -> time:
    return datetime.strptime(time_str, "%H:%M").time()


# ------------------- Функции для заполнения таблиц -------------------


async def create_roles(session: AsyncSession) -> Dict[str, Role]:
    """Создает роли пользователей и возвращает словарь с объектами ролей."""
    roles = {}
    role_data = [
        {"role_name_ru": "Администратор", "role_name_en": "Administrator"},
        {"role_name_ru": "Преподаватель", "role_name_en": "Teacher"},
        {"role_name_ru": "Студент", "role_name_en": "Student"},
    ]
    for data in role_data:
        role = Role(**data)
        session.add(role)
        await session.flush()
        roles[data["role_name_en"].lower()] = role
    return roles



async def create_group(session: AsyncSession) -> Group:
    """Создает учебную группу."""
    group = Group(
        group_name_ru="Тестовая_группа",
        group_name_en="Test_Group",
    )
    session.add(group)
    await session.flush()
    return group


async def create_sites(session: AsyncSession, site_codes: List[str]) -> Dict[str, Site]:
    """Создает учебные корпуса."""
    sites = {}
    for code in site_codes:
        site = Site(
            site_name_ru=code,
            site_name_en=code,
            site_description_ru=f"Описание для корпуса {code}",
            site_description_en=f"Description for site {code}",
        )
        session.add(site)
        await session.flush()
        sites[code] = site
    return sites


async def create_term(session: AsyncSession) -> Term:
    """Создает семестр."""
    term = Term(
        term_name_ru="Тестовый семестр",
        term_name_en="Test semester",
        start_date=date(2024, 1, 1),
        end_date=date(2027, 1, 1),
    )
    session.add(term)
    await session.flush()
    return term


async def create_subjects(
    session: AsyncSession, subject_names: List[Dict[str, str]]
) -> Dict[str, Subject]:
    """Создает предметы."""
    subjects = {}
    for name in subject_names:
        sub = Subject(
            subject_name_ru=name["ru"],
            subject_name_en=name["en"],
            subject_description_ru=f"Описание для {name['ru']}",
            subject_description_en=f"Description for {name['en']}",
        )
        session.add(sub)
        await session.flush()
        subjects[name["ru"]] = sub
    return subjects


async def create_lesson_periods(
    session: AsyncSession, period_times: List[Tuple[str, str]]
) -> List[LessonPeriod]:
    """Создает учебные периоды."""
    lesson_periods = []
    for i, (start, end) in enumerate(period_times, start=1):
        lp = LessonPeriod(
            lesson_number=i,
            start_time=to_time(start),
            end_time=to_time(end),
        )
        session.add(lp)
        await session.flush()
        lesson_periods.append(lp)
    return lesson_periods


async def create_teachers(
    session: AsyncSession, teacher_data: List[Dict[str, Any]], teacher_role: Role
) -> Dict[str, Teacher]:
    """Создает преподавателей."""
    teachers = {}
    for data in teacher_data:
        user = User(
            email=data["email"],
            hashed_password=get_password_hash("teacherpassword"),
            role_id=teacher_role.id,
            is_verified=True,
        )
        session.add(user)
        await session.flush()

        teacher = Teacher(
            user_id=user.id,
            first_name_ru=data["ru"]["first_name"],
            first_name_en=data["en"]["first_name"],
            last_name_ru=data["ru"]["last_name"],
            last_name_en=data["en"]["last_name"],
            patronymic_ru=data["ru"]["patronymic"],
            patronymic_en=data["en"]["patronymic"],
            phone="",
        )
        session.add(teacher)
        await session.flush()
        teachers[data["ru"]["first_name"]] = teacher
    return teachers


async def create_students(
    session: AsyncSession, group: Group, student_count: int, student_role: Role
) -> Dict[str, Student]:
    """Создает студентов."""
    students = {}
    for i in range(1, student_count + 1):
        email = f"student{i}@example.com"
        user = User(
            email=email,
            hashed_password=get_password_hash("studentpassword"),
            role_id=student_role.id,
            is_verified=True,
        )
        session.add(user)
        await session.flush()
        student = Student(
            user_id=user.id,
            first_name_ru=f"Студент{i}",
            first_name_en=f"Student{i}",
            last_name_ru="Фамилия",
            last_name_en="Lastname",
            patronymic_ru="Отчество",
            patronymic_en="Patronymic",
            group_id=group.id,
        )
        session.add(student)
        await session.flush()
        students[email] = student
    return students


async def create_day_of_week(session: AsyncSession) -> Dict[str, DayOfWeek]:
    """Создает дни недели и возвращает словарь с объектами."""
    days = {}
    day_names = [
        ("Monday", "Понедельник"),
        ("Tuesday", "Вторник"),
        ("Wednesday", "Среда"),
        ("Thursday", "Четверг"),
        ("Friday", "Пятница"),
        ("Saturday", "Суббота"),
        ("Sunday", "Воскресенье"),
    ]
    for idx, (eng, ru) in enumerate(day_names, start=1):
        day = DayOfWeek(
            name_ru=ru,
            name_en=eng,
            day_number=idx,
        )
        session.add(day)
        await session.flush()
        days[eng] = day
    return days


async def create_week_types(session: AsyncSession) -> Dict[str, WeekType]:
    """Создает типы недель (верхняя и нижняя)."""
    week_types = {
        "upper": WeekType(name_ru="Верхняя", name_en="upper"),
        "bottom": WeekType(name_ru="Нижняя", name_en="bottom"),
    }
    session.add_all(week_types.values())
    await session.flush()
    return week_types


async def create_lesson_types(session: AsyncSession) -> Dict[str, LessonType]:
    """Создает типы занятий (лекция, практика, лабораторная)."""
    lesson_types = {
        "Лекция": LessonType(name_ru="Лекция", name_en="Lecture"),
        "Лабораторная": LessonType(name_ru="Лабораторная", name_en="Laboratory"),
        "Практическая": LessonType(name_ru="Практическая", name_en="Practical"),
    }
    session.add_all(lesson_types.values())
    await session.flush()
    return lesson_types


async def create_term_schedules(
    session: AsyncSession,
    term: Term,
    subjects: Dict[str, Subject],
    teachers: Dict[str, Teacher],
    sites: Dict[str, Site],
    lesson_periods: List[LessonPeriod],
    day_of_week: Dict[str, DayOfWeek],
    week_types: Dict[str, WeekType],
    lesson_types: Dict[str, LessonType],
) -> List[TermSchedule]:
    """Создает тестовое расписание занятий: по 2 пары в день (кроме воскресенья)."""
    term_schedules = []
    
    # Берем одинаковый шаблон для всех
    subject = next(iter(subjects.values()))
    teacher = next(iter(teachers.values()))
    site = next(iter(sites.values()))
    week_type_upper = week_types["upper"]
    week_type_bottom = week_types["bottom"]

    days = [d for d in day_of_week.keys() if d != "Sunday"]
    periods = sorted(lesson_periods, key=lambda p: p.lesson_number)

    for day_str in days:
        for week_type in (week_type_upper, week_type_bottom):
            # Для двух пар в день: первая — лекция, вторая — практика
            periods_for_day = [periods[0].lesson_number, periods[1].lesson_number]

            for i, period_num in enumerate(periods_for_day):
                lp = next((p for p in lesson_periods if p.lesson_number == period_num), None)
                if not lp:
                    raise Exception(f"Пара с номером {period_num} не найдена.")

                # Если первая пара — лекция, если вторая — практика
                lesson_type_key = "Лекция" if i == 0 else "Практическая"
                lesson_type = lesson_types.get(lesson_type_key)
                if not lesson_type:
                    raise Exception(f"Тип занятия {lesson_type_key} не найден.")

                ts = TermSchedule(
                    term_id=term.id,
                    week_type_id=week_type.id,
                    day_of_week_id=day_of_week[day_str].id,
                    lesson_period_id=lp.id,
                    subject_id=subject.id,
                    teacher_id=teacher.id,
                    lesson_type_id=lesson_type.id,
                    site_id=site.id,
                    room_number="101",
                    is_virtual=False,
                )
                session.add(ts)
                term_schedules.append(ts)


    await session.flush()
    return term_schedules


async def create_schedule_groups(
    session: AsyncSession, term_schedules: List[TermSchedule], group: Group
):
    """Создает связи между расписанием и группами."""
    schedule_groups = [
        ScheduleGroup(schedule_id=ts.id, group_id=group.id) for ts in term_schedules
    ]
    session.add_all(schedule_groups)
    await session.flush()


# ------------------- Основная функция -------------------


async def create_dummy_data():
    """Главная функция заполнения базы тестовыми данными."""
    async with async_session() as session:
        try:
            async with session.begin():
                roles = await create_roles(session)

                group = await create_group(session)
                sites = await create_sites(session, ["Л", "Г", "Б", "Онлайн"])
                term = await create_term(session)
                subject_names = [
                    {
                        "ru": "Тестовый предмет 1",
                        "en": "Test Subject 1",
                    },
                    {
                        "ru": "Тестовый предмет 2",
                        "en": "Test Subject 2",
                    },
                ]
                subjects = await create_subjects(session, subject_names)
                period_times = [
                    ("09:00", "10:35"),
                    ("10:50", "12:25"),
                    ("12:40", "14:15"),
                    ("14:30", "16:05"),
                    ("16:20", "17:55"),
                    ("18:00", "19:25"),
                    ("19:35", "21:00"),
                ]
                lesson_periods = await create_lesson_periods(session, period_times)
                teacher_data = [
                    {
                        "ru": {
                            "first_name": "Имя",
                            "last_name": "Фамилия",
                            "patronymic": "Отчество",
                        },
                        "en": {
                            "first_name": "FirstName",
                            "last_name": "LastName",
                            "patronymic": "Patronymic",
                        },
                        "email": "teacher1@example.com",
                    },
                ]
                teachers = await create_teachers(
                    session,
                    teacher_data,
                    roles["teacher"],
                )
                await create_students(session, group, 3, roles["student"])
                day_of_week = await create_day_of_week(session)
                week_types = await create_week_types(session)
                lesson_types = await create_lesson_types(session)

                term_schedules = await create_term_schedules(
                    session,
                    term,
                    subjects,
                    teachers,
                    sites,
                    lesson_periods,
                    day_of_week,
                    week_types,
                    lesson_types,
                )
                await create_schedule_groups(session, term_schedules, group)

            print("✅ Данные успешно загружены.")
        except Exception as e:
            await session.rollback()
            print(f"❌ Ошибка: {e}")
            raise


if __name__ == "__main__":
    asyncio.run(create_dummy_data())
