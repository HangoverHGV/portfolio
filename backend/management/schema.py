from pydantic import BaseModel
from typing import Optional

class ScheduleCreate(BaseModel):
    title: str


class ScheduleEdit(BaseModel):
    title: Optional[str] = None
