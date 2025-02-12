from pydantic import BaseModel
from typing import Optional

class ScheduleCreate(BaseModel):
    title: str


class ScheduleEdit(BaseModel):
    title: Optional[str] = None


class ResourceCreate(BaseModel):
    name: str
    datetime_started: str
    datetime_ended: str
    schedule_id: int

class ResourceEdit(BaseModel):
    name: Optional[str] = None
    datetime_started: Optional[str] = None
    datetime_ended: Optional[str] = None
    schedule_id: Optional[int] = None


class EmployCreate(BaseModel):
    name: str
    schedule_id: int

class EmployEdit(BaseModel):
    name: Optional[str] = None
    schedule_id: Optional[int] = None
    resources: Optional[list[int]] = None
