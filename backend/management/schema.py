from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime

class ScheduleCreate(BaseModel):
    title: str


class ScheduleEdit(BaseModel):
    title: Optional[str] = None


class ResourceCreate(BaseModel):
    name: str
    datetime_started: str
    datetime_ended: str
    schedule_id: int
    employ_id: int
    resource_type: str

    @field_validator('datetime_started', 'datetime_ended')
    def parse_datetime(cls, value):
        formats = ['%Y-%m-%dT%H:%M:%S', '%Y-%m-%dT%H:%M', '%Y-%m-%dT%H:%M:%S.%fZ']
        for fmt in formats:
            try:
                return datetime.strptime(value, fmt)
            except ValueError:
                continue
        raise ValueError(f"time data '{value}' does not match any of the formats")

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
