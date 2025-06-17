# app/utils/date_utils.py
from datetime import date, datetime, time
from fastapi import HTTPException


def get_current_date() -> date:
    return datetime.today().date()


def parse_date(date_str: str) -> date:
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError as e:
        raise HTTPException(
            status_code=400, detail=f"Invalid date format: {date_str}. Use YYYY-MM-DD"
        ) from e


def time_to_iso(time_obj: time) -> str:
    return time_obj.isoformat(timespec="minutes")
