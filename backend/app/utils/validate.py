# app/utils/validate.py


from datetime import date


def validate_week_type(week_type: str):
    """Validate week_type parameter"""
    valid_week_types = ["upper", "bottom"]
    if week_type.lower() not in valid_week_types:
        raise ValueError(f"Invalid week_type. Valid options: {valid_week_types}")


def validate_term_start_date(term_start: date):
    if term_start.weekday() != 0:
        raise ValueError(
            f"Term must start on a Monday. Invalid start date: {term_start}"
        )
