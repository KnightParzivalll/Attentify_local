# app/config.py
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str

    access_token_expire_hours: int = 24  # extended lifetime
    secret_key: str


settings = Settings()  # type: ignore
