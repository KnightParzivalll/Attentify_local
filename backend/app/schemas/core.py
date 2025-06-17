# app/schemas/core.py

from typing import Optional
from pydantic import BaseModel


BaseID = int


class LocalizedNameField(BaseModel):
    ru: str
    en: str


class LocalizedDescriptionField(BaseModel):
    en: Optional[str] = None
    ru: Optional[str] = None
