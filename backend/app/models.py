from datetime import date, datetime, time
from typing import List, Optional
from sqlalchemy import (
    Integer,
    String,
    Date,
    Time,
    ForeignKey,
    TIMESTAMP,
    Boolean,
    func,
)
from sqlalchemy.orm import relationship, Mapped, mapped_column, DeclarativeBase
from fastapi_users.db import SQLAlchemyBaseUserTable

"""
Cascade Delete and Delete Restriction Documentation
-----------------------------------------------------

Overview:
    This document outlines the cascade delete behaviors, restriction policies, and proper deletion procedures for the models in this project. It covers both ORM-level cascade options and database-level ON DELETE constraints.

1. Cascade Deletes and Passive Deletes:
    - Cascade Deletes (ORM Level): Automatically propagates deletions from parent objects to child objects based on specified cascade options.
    - Passive Deletes: Instructs SQLAlchemy to rely on the database’s ON DELETE rules, reducing unnecessary queries.

2. User and Profile Relationships:
    - One-to-One Bidirectional Relationship: Each User has exactly one profile (Teacher, Student, or Administrator), and the profile is directly associated with the User.
    - Cascade Behavior: Deleting a User will automatically delete its associated profile, and deleting a profile will also remove the corresponding User.
    - Implementation: Achieved using cascade options ("all, delete-orphan" and "single_parent") combined with ON DELETE CASCADE on the foreign key.

3. Teacher and TermSchedule:
    - Restriction Policy: The TermSchedule references a Teacher with a non-nullable foreign key set to ON DELETE RESTRICT.
    - Effect: A Teacher cannot be deleted if any TermSchedule records reference it.
    - Proper Deletion: Remove or reassign dependent TermSchedule records before deleting a Teacher.

4. Subject and TermSchedule:
    - Restriction Policy: The TermSchedule references a Subject with an ON DELETE RESTRICT constraint.
    - Effect: A Subject cannot be deleted if it is still referenced by any TermSchedule.
    - Proper Deletion: Dependent TermSchedule records must be removed or updated prior to deleting a Subject.

5. Site and TermSchedule:
    - Restriction Policy: The TermSchedule references a Site via a non-nullable foreign key with an ON DELETE RESTRICT constraint.
    - Effect: A Site cannot be deleted if there are term schedules linked to it.
    - Proper Deletion: Remove or reassign all dependent TermSchedule records before attempting to delete a Site.

6. Role and User:
    - Restriction Policy: The User model references a Role using an ON DELETE RESTRICT foreign key.
    - Effect: A Role cannot be deleted if any User is assigned to it.
    - Proper Deletion: Users must be either reassigned to another Role or deleted before the Role can be removed.

Best Practices:
    - Always verify the existence of dependent records before deleting a parent record.
    - Use transactions to group deletion operations to ensure data integrity.
    - Consider reassigning dependent records when appropriate rather than deleting them.
    - Thoroughly test all deletion scenarios to confirm that cascade and restrict rules work as expected.

This documentation ensures that developers understand the implications of deletions in the data model and follow proper procedures to maintain referential integrity.
"""


class Base(DeclarativeBase):
    pass


# Mixin for the common id column.
class IdMixin:
    __abstract__ = True

    id: Mapped[int] = mapped_column(primary_key=True)


# DRY mixin for common profile fields
class ProfileMixin(IdMixin):
    __abstract__ = True

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True
    )
    first_name_ru: Mapped[str] = mapped_column(String(255), nullable=False)
    first_name_en: Mapped[str] = mapped_column(String(255), nullable=False)
    last_name_ru: Mapped[str] = mapped_column(String(255), nullable=False)
    last_name_en: Mapped[str] = mapped_column(String(255), nullable=False)
    patronymic_ru: Mapped[str] = mapped_column(String(255), nullable=False)
    patronymic_en: Mapped[str] = mapped_column(String(255), nullable=False)
    phone: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)


class Role(IdMixin, Base):  # TODO consider indexes
    __tablename__ = "roles"

    role_name_ru: Mapped[str] = mapped_column(
        String(length=100), unique=True, nullable=False
    )
    role_name_en: Mapped[str] = mapped_column(
        String(length=100), unique=True, nullable=False
    )
    role_description_ru: Mapped[Optional[str]] = mapped_column(
        String(length=255), nullable=True
    )
    role_description_en: Mapped[Optional[str]] = mapped_column(
        String(length=255), nullable=True
    )

    users: Mapped[List["User"]] = relationship("User", back_populates="role")


class User(SQLAlchemyBaseUserTable, IdMixin, Base):
    __tablename__ = "users"

    is_verified: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    role_id: Mapped[int] = mapped_column(
        ForeignKey("roles.id", ondelete="RESTRICT"), nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, nullable=False, server_default=func.current_timestamp()
    )
    role_id: Mapped[int] = mapped_column(
        ForeignKey("roles.id", ondelete="RESTRICT"), nullable=False
    )  # BUG delete repeating one

    role: Mapped["Role"] = relationship("Role", back_populates="users")
    teacher_profile: Mapped["Teacher"] = relationship(
        "Teacher",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
        single_parent=True,
        passive_deletes=True,
    )  # TODO Test how good cascade there works
    student_profile: Mapped["Student"] = relationship(
        "Student",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
        single_parent=True,
        passive_deletes=True,
    )  # TODO Test how good cascade there works
    administrator_profile: Mapped["Administrator"] = relationship(
        "Administrator",
        back_populates="user",
        uselist=False,
        cascade="all, delete-orphan",
        single_parent=True,
        passive_deletes=True,
    )  # TODO Test how good cascade there works


class Teacher(ProfileMixin, Base):
    __tablename__ = "teachers"

    term_schedules: Mapped[List["TermSchedule"]] = relationship(
        "TermSchedule",
        back_populates="teacher",
        cascade="save-update, merge",
        passive_deletes=True,
    )
    user: Mapped["User"] = relationship(
        "User",
        back_populates="teacher_profile",
        cascade="all, delete-orphan",
        single_parent=True,
        passive_deletes=True,
    )


class Student(ProfileMixin, Base):
    __tablename__ = "students"

    group_id: Mapped[Optional[int]] = mapped_column(
        ForeignKey("groups.id", ondelete="SET NULL"), nullable=True
    )

    group: Mapped[Optional["Group"]] = relationship("Group", back_populates="students")
    attendance_records: Mapped[List["Attendance"]] = relationship(
        "Attendance", back_populates="student", cascade="all, delete"
    )
    user: Mapped["User"] = relationship(
        "User",
        back_populates="student_profile",
        cascade="all, delete-orphan",
        single_parent=True,
        passive_deletes=True,
    )


class Administrator(ProfileMixin, Base):
    __tablename__ = "administrators"

    user: Mapped["User"] = relationship(
        "User",
        back_populates="administrator_profile",
        cascade="all, delete-orphan",
        single_parent=True,
        passive_deletes=True,
    )


# -------------------------------
# Student related Models
# -------------------------------


class Group(IdMixin, Base):
    __tablename__ = "groups"

    group_name_ru: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    group_name_en: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)

    group_description_ru: Mapped[Optional[str]] = mapped_column(
        String(length=255), nullable=True
    )
    group_description_en: Mapped[Optional[str]] = mapped_column(
        String(length=255), nullable=True
    )

    students: Mapped[List["Student"]] = relationship("Student", back_populates="group")
    schedule_groups: Mapped[List["ScheduleGroup"]] = relationship(
        "ScheduleGroup", back_populates="group", cascade="all, delete"
    )


class ScheduleGroup(Base):
    __tablename__ = "schedule_groups"

    schedule_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("term_schedule.id", ondelete="CASCADE"),
        primary_key=True,
    )
    group_id: Mapped[int] = mapped_column(
        Integer,
        ForeignKey("groups.id", ondelete="CASCADE"),
        primary_key=True,
    )

    term_schedule: Mapped["TermSchedule"] = relationship(
        "TermSchedule", back_populates="schedule_groups"
    )
    group: Mapped["Group"] = relationship("Group", back_populates="schedule_groups")


class Attendance(IdMixin, Base):
    __tablename__ = "attendance"

    schedule_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("term_schedule.id", ondelete="CASCADE"), nullable=False
    )
    lesson_date: Mapped[date] = mapped_column(Date, nullable=False)
    student_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("students.id", ondelete="CASCADE"), nullable=False
    )
    scanned_at: Mapped[datetime] = mapped_column(
        TIMESTAMP, server_default=func.current_timestamp(), nullable=False
    )

    term_schedule: Mapped["TermSchedule"] = relationship(
        "TermSchedule", back_populates="attendance_records"
    )
    student: Mapped["Student"] = relationship(
        "Student", back_populates="attendance_records"
    )


# -------------------------------
# Schedule related Models
# -------------------------------


class Site(IdMixin, Base):
    __tablename__ = "sites"

    site_name_ru: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    site_name_en: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    site_description_ru: Mapped[Optional[str]] = mapped_column(
        String(length=255), nullable=True
    )
    site_description_en: Mapped[Optional[str]] = mapped_column(
        String(length=255), nullable=True
    )

    term_schedules: Mapped[List["TermSchedule"]] = relationship(
        "TermSchedule", back_populates="site"
    )


class Term(IdMixin, Base):
    __tablename__ = "terms"

    term_name_ru: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    term_name_en: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    end_date: Mapped[date] = mapped_column(Date, nullable=False)

    term_schedules: Mapped[List["TermSchedule"]] = relationship(
        "TermSchedule", back_populates="term", cascade="all, delete"
    )


class LessonPeriod(IdMixin, Base):
    __tablename__ = "lesson_periods"

    lesson_number: Mapped[int] = mapped_column(unique=True, nullable=False)
    start_time: Mapped[time] = mapped_column(Time, unique=True, nullable=False)
    end_time: Mapped[time] = mapped_column(Time, unique=True, nullable=False)

    term_schedules: Mapped[List["TermSchedule"]] = relationship(
        "TermSchedule",
        back_populates="lesson_period",
        cascade="save-update, merge",  # No cascade delete
    )


class Subject(IdMixin, Base):
    __tablename__ = "subjects"

    subject_name_ru: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False
    )
    subject_name_en: Mapped[str] = mapped_column(
        String(255), unique=True, nullable=False
    )
    subject_description_ru: Mapped[Optional[str]] = mapped_column(
        String(length=255), nullable=True
    )
    subject_description_en: Mapped[Optional[str]] = mapped_column(
        String(length=255), nullable=True
    )

    term_schedules: Mapped[List["TermSchedule"]] = relationship(
        "TermSchedule", back_populates="subject"
    )


class WeekType(IdMixin, Base):
    __tablename__ = "week_types"

    name_ru: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    name_en: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    term_schedules: Mapped[List["TermSchedule"]] = relationship(
        "TermSchedule", back_populates="week_type"
    )


class DayOfWeek(IdMixin, Base):
    __tablename__ = "day_of_week"

    day_number: Mapped[int] = mapped_column(
        unique=True,
        nullable=False,
        comment="Numeric representation of day of week (e.g., 1=Monday, 2=Tuesday, ...)",
    )

    name_ru: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    name_en: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    term_schedules: Mapped[List["TermSchedule"]] = relationship(
        "TermSchedule", back_populates="day_of_week"
    )


class LessonType(IdMixin, Base):
    __tablename__ = "lesson_types"

    name_ru: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)
    name_en: Mapped[str] = mapped_column(String(50), unique=True, nullable=False)

    term_schedules: Mapped[List["TermSchedule"]] = relationship(
        "TermSchedule", back_populates="lesson_type"
    )


class TermSchedule(IdMixin, Base):
    __tablename__ = "term_schedule"

    term_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("terms.id", ondelete="CASCADE"), nullable=False
    )
    week_type_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("week_types.id", ondelete="RESTRICT"), nullable=False
    )

    day_of_week_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("day_of_week.id", ondelete="RESTRICT"), nullable=False
    )
    lesson_period_id: Mapped[int] = mapped_column(
        ForeignKey("lesson_periods.id", ondelete="RESTRICT"), nullable=False
    )
    subject_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("subjects.id", ondelete="RESTRICT"), nullable=False
    )
    teacher_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("teachers.id", ondelete="RESTRICT"), nullable=False
    )
    lesson_type_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("lesson_types.id", ondelete="RESTRICT"), nullable=False
    )
    site_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("sites.id", ondelete="RESTRICT"), nullable=False
    )
    room_number: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    is_virtual: Mapped[bool] = mapped_column(
        default=False,
        nullable=False,
        comment="True if the lesson is conducted online",
    )

    term: Mapped["Term"] = relationship("Term", back_populates="term_schedules")
    week_type: Mapped["WeekType"] = relationship(
        "WeekType", back_populates="term_schedules"
    )
    day_of_week: Mapped["DayOfWeek"] = relationship(
        "DayOfWeek", back_populates="term_schedules"
    )
    subject: Mapped["Subject"] = relationship(
        "Subject", back_populates="term_schedules"
    )
    teacher: Mapped["Teacher"] = relationship(
        "Teacher", back_populates="term_schedules"
    )
    lesson_type: Mapped["LessonType"] = relationship(
        "LessonType", back_populates="term_schedules"
    )
    site: Mapped["Site"] = relationship("Site", back_populates="term_schedules")
    lesson_period: Mapped["LessonPeriod"] = relationship(
        "LessonPeriod", back_populates="term_schedules"
    )
    schedule_groups: Mapped[List["ScheduleGroup"]] = relationship(
        "ScheduleGroup", back_populates="term_schedule", cascade="all, delete"
    )
    attendance_records: Mapped[List["Attendance"]] = relationship(
        "Attendance", back_populates="term_schedule", cascade="all, delete"
    )
